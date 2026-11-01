// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import type { Stats } from 'node:fs';
import { basename, dirname, isAbsolute, resolve } from 'node:path';
import { postcondition, precondition } from '../assertions.js';
import { buildPrcFilename, deriveSlug, generateUuid, parsePrcFilename } from './filename.js';
import {
  BpmnParseError,
  collectElementInventory,
  getProcessId,
  oneLine,
  parseBpmn,
  serializeBpmn,
  type BpmnElementRef,
  type BpmnRootElement,
} from './moddle.js';

/**
 * The `prc` artifact store (REQ-004/REQ-005/REQ-006, QA pairs
 * 1.0020/1.0080/0.0300): the file-backed source of truth with an
 * in-memory tree cache.
 *
 * The cache is a `Map` from process UUID to the parsed tree plus the
 * SHA-256 of the process's own file at parse time, held for the
 * lifetime of the server process only (Design Note 1: in-memory, no
 * sidecar file); alongside it lives the session-scoped source-path
 * to UUID map (Design Note 2: copy-on-import, re-importing the same
 * outside-tree path within a session returns the same UUID). Every
 * operation that touches a registered process performs the
 * conditional re-read (REQ-004): an unchanged checksum serves the
 * cached tree, a changed one re-parses the file, updates the cache
 * and the checksum, and notes the out-of-band re-read in the result
 * and in the structured log.
 *
 * The operations return plain typed result objects (no MCP SDK
 * types -- the Phase 110 adapter maps them to tool results).
 * Expected failures (a missing source, a directory source,
 * unparseable XML, an unregistered UUID, a failed read/write) are
 * structured `ok: false` results; violated `precondition`/
 * `postcondition` invariants (REQ-009) throw and are never
 * swallowed -- a crashed invariant is a bug, not a tool error.
 */

/** The structured failure codes the store operations can return. */
export type PrcErrorCode =
  | 'path-missing'
  | 'path-is-directory'
  | 'not-bpmn'
  | 'no-slug'
  | 'process-not-registered'
  | 'read-failed'
  | 'write-failed';

/** A structured store error: a code plus a single-line message. */
export interface PrcError {
  code: PrcErrorCode;
  message: string;
}

/** The `import` success result (REQ-005). */
export interface ImportSuccess {
  ok: true;
  /** The process UUID (assigned, or reused). */
  uuid: string;
  /** The process's registered own path (absolute). */
  path: string;
  /** The process's slug. */
  slug: string;
  /** Whether a copy was placed (false for a re-import reuse). */
  copied: boolean;
  /** Whether the conditional re-read detected an out-of-band change (REQ-004). */
  outOfBandReRead: boolean;
}

/** The `import` failure result. */
export interface ImportFailure {
  ok: false;
  error: PrcError;
}

export type ImportResult = ImportSuccess | ImportFailure;

/** The `export` success result (REQ-006). */
export interface ExportSuccess {
  ok: true;
  /** The process UUID. */
  uuid: string;
  /** The written path (absolute -- the own path, or the explicit one). */
  path: string;
  /** Whether the conditional re-read detected an out-of-band change (REQ-004). */
  outOfBandReRead: boolean;
}

/** The `export` failure result. */
export interface ExportFailure {
  ok: false;
  error: PrcError;
}

export type ExportResult = ExportSuccess | ExportFailure;

/**
 * The minimal structural logger the store needs. A pino `Logger`
 * satisfies this interface (the store never imports pino or the MCP
 * SDK -- CONSTITUTION §4, QA 7.0030); tests may pass a recording
 * fake of the same shape.
 */
export interface PrcLogger {
  info(object: unknown, msg?: string): void;
  warn(object: unknown, msg?: string): void;
  error(object: unknown, msg?: string): void;
}

/** The in-memory cache entry for one registered process (REQ-004). */
interface CacheEntry {
  /** The parsed moddle tree (the `bpmn:Definitions` root). */
  tree: BpmnRootElement;
  /** The SHA-256 (hex) of the process's own file at parse time. */
  sha256: string;
  /** The process's registered own path (absolute). */
  path: string;
  /** The process's slug, read from the own path's filename. */
  slug: string;
}

/** A reuse target found by the `import` operation. */
interface ReuseTarget {
  uuid: string;
  ownPath: string;
}

/** The `prc` artifact store (see the module documentation). */
export class PrcStore {
  private readonly prcDir: string;

  private readonly logger: PrcLogger;

  private readonly cache: Map<string, CacheEntry> = new Map();

  private readonly sessionSourcePaths: Map<string, string> = new Map();

  /**
   * @param prcDir - The absolute path of the `prc` directory the
   *   store reads from and writes to (the writes create it when
   *   needed; the reads never do).
   * @param logger - The pino-compatible structured logger.
   */
  constructor(prcDir: string, logger: PrcLogger) {
    precondition(prcDir.length > 0 && isAbsolute(prcDir), 'the prc directory must be a non-empty absolute path');
    precondition(
      typeof logger.info === 'function' && typeof logger.warn === 'function' && typeof logger.error === 'function',
      'the logger must be a pino-compatible logger (info/warn/error)',
    );
    this.prcDir = resolve(prcDir);
    this.logger = logger;
  }

  /**
   * The `import` operation (REQ-005). A missing path, a directory,
   * unparseable XML, or an un-derivable slug is a structured error
   * with nothing registered and nothing written; the source's own
   * registered path (a conforming name in the `prc` directory)
   * reuses the UUID via the conditional re-read without a second
   * file; the same outside-tree source path within this session
   * reuses the UUID likewise; otherwise a fresh UUID and slug are
   * assigned and the source is copied (byte-identical, the original
   * left untouched) into the `prc` directory, creating it when
   * needed.
   *
   * @param sourcePath - The BPMN 2.0 file to import (any path).
   */
  async importProcess(sourcePath: string): Promise<ImportResult> {
    precondition(sourcePath.length > 0, 'the import source path must be a non-empty string');
    const resolvedSource = resolve(sourcePath);

    let sourceStats: Stats;
    try {
      sourceStats = await stat(resolvedSource);
    } catch (error) {
      return { ok: false, error: this.toIoError(error, 'read-failed', resolvedSource) };
    }
    if (!sourceStats.isFile()) {
      return {
        ok: false,
        error: {
          code: 'path-is-directory',
          message: `the import source ${resolvedSource} is a directory, not a file`,
        },
      };
    }

    const reuse = this.findReuse(resolvedSource);
    try {
      if (reuse !== undefined) {
        return await this.importReuse(reuse, resolvedSource);
      }
      return await this.importNew(resolvedSource);
    } catch (error) {
      if (error instanceof BpmnParseError) {
        return { ok: false, error: { code: 'not-bpmn', message: error.message } };
      }
      return { ok: false, error: this.toIoError(error, 'read-failed', resolvedSource) };
    }
  }

  /**
   * The `export` operation (REQ-006). After the conditional re-read,
   * the cached tree is serialized (`format: true`) and written
   * atomically: by default to the process's own `prc` path, or to
   * the explicit path when given (the only way another file -- e.g.
   * another process's own path -- is ever overwritten, QA pair
   * 9.0010). The checksum cache is updated to the written file's
   * SHA-256 when the own path was written (it always tracks the own
   * file, the one the conditional re-read watches). The postcondition
   * (REQ-009) verifies the written file re-parses to the same element
   * set as the serialized tree. An unregistered UUID is a structured
   * error in every directory state (ACC-009).
   *
   * @param uuid - The registered process UUID.
   * @param targetPath - The explicit write target (optional; defaults
   *   to the process's own path).
   */
  async exportProcess(uuid: string, targetPath?: string): Promise<ExportResult> {
    precondition(uuid.length > 0, 'the process uuid must be a non-empty string');
    const entry = this.cache.get(uuid);
    if (entry === undefined) {
      return {
        ok: false,
        error: { code: 'process-not-registered', message: `process ${uuid} is not registered` },
      };
    }

    let reRead: boolean;
    let current: CacheEntry | undefined;
    let xml: string;
    try {
      reRead = (await this.ensureCurrentTree(uuid, entry.path)).reRead;
      current = this.cache.get(uuid);
      precondition(current !== undefined, `process ${uuid} must stay registered during export`);
      xml = await serializeBpmn(current.tree);
    } catch (error) {
      if (error instanceof BpmnParseError) {
        return { ok: false, error: { code: 'not-bpmn', message: error.message } };
      }
      return { ok: false, error: this.toIoError(error, 'read-failed', entry.path) };
    }

    const writtenPath = targetPath !== undefined && targetPath.length > 0 ? resolve(targetPath) : current.path;
    try {
      await atomicWriteFile(writtenPath, xml);
    } catch (error) {
      return { ok: false, error: this.toIoError(error, 'write-failed', writtenPath) };
    }

    if (writtenPath === current.path) {
      current.sha256 = sha256Hex(xml);
    }

    const reParsed = (await parseBpmn(await readFile(writtenPath))).rootElement;
    postcondition(
      elementsAreEqual(collectElementInventory(reParsed), collectElementInventory(current.tree)),
      `the exported file at ${writtenPath} must re-parse to the same element set as the serialized tree`,
    );

    this.logger.info(
      { event: 'prc-export', uuid, path: writtenPath, ownPath: current.path, outOfBandReRead: reRead },
      'exported a BPMN process',
    );
    return { ok: true, uuid, path: writtenPath, outOfBandReRead: reRead };
  }

  /**
   * Finds the reuse target for an import source, if any: the
   * source's own registered path (a conforming name inside the
   * `prc` directory) first, then the session source-path to UUID
   * map (REQ-005, Design Note 2).
   *
   * @param resolvedSource - The resolved import source path.
   */
  private findReuse(resolvedSource: string): ReuseTarget | undefined {
    const parsedOwn = parsePrcFilename(basename(resolvedSource));
    if (parsedOwn !== null && dirname(resolvedSource) === this.prcDir) {
      return { uuid: parsedOwn.uuid, ownPath: this.ownPathFor(parsedOwn.uuid, resolvedSource) };
    }
    const sessionUuid = this.sessionSourcePaths.get(resolvedSource);
    if (sessionUuid !== undefined) {
      return { uuid: sessionUuid, ownPath: this.ownPathFor(sessionUuid, resolvedSource) };
    }
    return undefined;
  }

  /** The known own path of a UUID, or a fallback when the cache is cold. */
  private ownPathFor(uuid: string, fallback: string): string {
    const known = this.cache.get(uuid);
    return known !== undefined ? known.path : fallback;
  }

  /**
   * Re-imports an already registered process: the conditional
   * re-read on the own path, then the cached registration data. No
   * file is written (ACC-003).
   *
   * @param reuse - The reuse target.
   * @param resolvedSource - The import source as given (for the log).
   */
  private async importReuse(reuse: ReuseTarget, resolvedSource: string): Promise<ImportResult> {
    const { reRead } = await this.ensureCurrentTree(reuse.uuid, reuse.ownPath);
    const entry = this.cache.get(reuse.uuid);
    precondition(entry !== undefined, `process ${reuse.uuid} must be registered after the conditional re-read`);
    this.logger.info(
      {
        event: 'prc-import-reuse',
        uuid: reuse.uuid,
        source: resolvedSource,
        path: entry.path,
        outOfBandReRead: reRead,
      },
      're-imported an already registered BPMN process',
    );
    return {
      ok: true,
      uuid: reuse.uuid,
      path: entry.path,
      slug: entry.slug,
      copied: false,
      outOfBandReRead: reRead,
    };
  }

  /**
   * Imports a foreign source as a new process (REQ-005, Design Note
   * 2): parse, derive the slug (process `id`, filename-stem
   * fallback), assign a fresh UUID v4, copy the source byte-for-byte
   * into the `prc` directory (atomic, the directory created when
   * needed, the original untouched), register the copy, and verify
   * the postcondition (the copy exists and re-parses to the source's
   * element set, REQ-009).
   *
   * @param resolvedSource - The resolved import source path.
   */
  private async importNew(resolvedSource: string): Promise<ImportResult> {
    let bytes: Buffer;
    try {
      bytes = await readFile(resolvedSource);
    } catch (error) {
      return { ok: false, error: this.toIoError(error, 'read-failed', resolvedSource) };
    }
    const sha256 = sha256Hex(bytes);

    let sourceTree: BpmnRootElement;
    try {
      sourceTree = (await parseBpmn(bytes)).rootElement;
    } catch (error) {
      if (error instanceof BpmnParseError) {
        return { ok: false, error: { code: 'not-bpmn', message: error.message } };
      }
      throw error;
    }

    const slug = deriveSlug(getProcessId(sourceTree), basename(resolvedSource));
    if (slug.length === 0) {
      return {
        ok: false,
        error: {
          code: 'no-slug',
          message: `cannot derive a slug from the process id or the filename of ${resolvedSource}`,
        },
      };
    }

    const uuid = generateUuid();
    const targetPath = resolve(this.prcDir, buildPrcFilename(uuid, slug));
    try {
      await atomicWriteFile(targetPath, bytes);
    } catch (error) {
      return { ok: false, error: this.toIoError(error, 'write-failed', targetPath) };
    }

    this.cache.set(uuid, { tree: sourceTree, sha256, path: targetPath, slug });
    this.sessionSourcePaths.set(resolvedSource, uuid);

    const copyTree = (await parseBpmn(await readFile(targetPath))).rootElement;
    postcondition(
      elementsAreEqual(collectElementInventory(copyTree), collectElementInventory(sourceTree)),
      `the imported copy at ${targetPath} must exist and re-parse to the same element set as the source`,
    );

    this.logger.info(
      { event: 'prc-import', uuid, source: resolvedSource, path: targetPath, slug, sha256 },
      'imported a BPMN process',
    );
    return { ok: true, uuid, path: targetPath, slug, copied: true, outOfBandReRead: false };
  }

  /**
   * The conditional re-read (REQ-004): hashes the own file and
   * serves the cached tree when the checksum is unchanged; otherwise
   * re-parses, updates the cache entry (tree, checksum, own path,
   * slug), and notes the out-of-band re-read in the structured log.
   * A cold cache (first operation of this session) parses without a
   * re-read note -- there is no prior knowledge to differ from.
   *
   * @param uuid - The registered process UUID.
   * @param ownPath - The process's own file path.
   * @returns Whether an out-of-band change was detected and re-read.
   */
  private async ensureCurrentTree(uuid: string, ownPath: string): Promise<{ reRead: boolean }> {
    const bytes = await readFile(ownPath);
    const currentSha256 = sha256Hex(bytes);
    const cached = this.cache.get(uuid);
    if (cached !== undefined && cached.sha256 === currentSha256) {
      return { reRead: false };
    }

    const { rootElement } = await parseBpmn(bytes);
    const parsedOwn = parsePrcFilename(basename(ownPath));
    precondition(parsedOwn !== null, `the process own path ${ownPath} must carry a conforming prc filename`);
    this.cache.set(uuid, { tree: rootElement, sha256: currentSha256, path: ownPath, slug: parsedOwn.slug });

    if (cached !== undefined) {
      this.logger.warn(
        {
          event: 'prc-reread-out-of-band',
          uuid,
          path: ownPath,
          previousSha256: cached.sha256,
          currentSha256,
        },
        'an out-of-band change was detected; re-read the process file',
      );
    } else {
      this.logger.info(
        { event: 'prc-cache-load', uuid, path: ownPath, sha256: currentSha256 },
        'loaded the process tree into the cache',
      );
    }
    return { reRead: cached !== undefined };
  }

  /**
   * Maps a filesystem failure to a structured error: `ENOENT` is a
   * missing path regardless of phase; any other error code is the
   * phase's fallback code. Non-filesystem errors are rethrown --
   * they are bugs, not tool errors.
   *
   * @param error - The caught error value.
   * @param fallbackCode - The code for non-`ENOENT` failures.
   * @param path - The path the failure occurred on (for the message).
   */
  private toIoError(error: unknown, fallbackCode: PrcErrorCode, path: string): PrcError {
    if (isErrnoException(error)) {
      if (error.code === 'ENOENT') {
        return { code: 'path-missing', message: `${path} does not exist` };
      }
      const verb = fallbackCode === 'write-failed' ? 'write' : 'read';
      return { code: fallbackCode, message: `failed to ${verb} ${path}: ${oneLine(error.message)}` };
    }
    throw error;
  }
}

/**
 * Writes a file atomically: the content goes to a temporary file in
 * the target's own directory, then is renamed over the target
 * (REQ-006), so the target never exists in a partial state. The
 * target's parent directory is created when needed (writes create,
 * resolutions do not, REQ-003/REQ-005/REQ-006).
 *
 * @param targetPath - The absolute target path.
 * @param data - The content to write.
 */
async function atomicWriteFile(targetPath: string, data: string | Uint8Array): Promise<void> {
  await mkdir(dirname(targetPath), { recursive: true });
  const tempPath = `${targetPath}.${randomUUID()}.tmp`;
  try {
    await writeFile(tempPath, data);
    await rename(tempPath, targetPath);
  } catch (error) {
    await unlink(tempPath).catch(() => undefined);
    throw error;
  }
}

/** The SHA-256 (hex) of a string (UTF-8) or raw bytes. */
function sha256Hex(data: string | Uint8Array): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Type guard: is this a filesystem error carrying an error code? */
function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && typeof (error as NodeJS.ErrnoException).code === 'string';
}

/** Compares two deterministic element inventories (same length, same order). */
function elementsAreEqual(a: BpmnElementRef[], b: BpmnElementRef[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].id !== b[i].id || a[i].type !== b[i].type) {
      return false;
    }
  }
  return true;
}
