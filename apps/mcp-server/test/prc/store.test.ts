// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import pino from 'pino';
import { buildPrcFilename } from '../../src/prc/filename.js';
import { collectElementInventory, getProcessId, parseBpmn, serializeBpmn } from '../../src/prc/moddle.js';
import type { ImportResult, PrcLogger } from '../../src/prc/store.js';
import { PrcStore } from '../../src/prc/store.js';

// Resolve the fixture directory independent of the test runner's
// working directory (test/prc/ -> test/ -> fixtures/).
const FIXTURES_DIR = resolve(fileURLToPath(new URL('../fixtures/', import.meta.url)));

const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');
const NO_ID_FIXTURE = join(FIXTURES_DIR, 'no-process-id.bpmn');
const MALFORMED_FIXTURE = join(FIXTURES_DIR, 'malformed.bpmn');

const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

interface LogRecord {
  level: 'info' | 'warn' | 'error';
  event: string | undefined;
  msg: string;
}

/** A recording fake of the store's structural `PrcLogger`. */
function createFakeLogger(): { logger: PrcLogger; records: LogRecord[] } {
  const records: LogRecord[] = [];
  const push = (level: LogRecord['level']) => (obj: unknown, msg?: string) => {
    records.push({ level, event: (obj as { event?: string } | undefined)?.event, msg: msg ?? '' });
  };
  const logger: PrcLogger = { info: push('info'), warn: push('warn'), error: push('error') };
  return { logger, records };
}

const sha256Hex = (data: string | Uint8Array): string => createHash('sha256').update(data).digest('hex');

/** Narrows an `ImportResult` to its success side for the test body. */
function expectImportOk(result: ImportResult): Extract<ImportResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the import result must be a success');
  }
  return result;
}

describe('PrcStore (REQ-004/REQ-005/REQ-006/REQ-009)', () => {
  let tempDir: string;
  let prcDir: string;
  let foreignDir: string;
  let logger: PrcLogger;
  let records: LogRecord[];
  let store: PrcStore;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-store-'));
    prcDir = join(tempDir, 'docs', 'prc');
    foreignDir = join(tempDir, 'foreign');
    mkdirSync(foreignDir);
    ({ logger, records } = createFakeLogger());
    store = new PrcStore(prcDir, logger);
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  /** Copies a committed fixture into the foreign directory under a chosen name. */
  const copyFixture = (fixture: string, name: string): string => {
    const target = join(foreignDir, name);
    writeFileSync(target, readFileSync(fixture));
    return target;
  };

  /** SHA-256 of every regular file in the given directories (absent dirs skipped). */
  const snapshot = (dirs: string[]): Record<string, string> => {
    const result: Record<string, string> = {};
    for (const dir of dirs) {
      if (!existsSync(dir)) {
        continue;
      }
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (existsSync(path)) {
          result[path] = sha256Hex(readFileSync(path));
        }
      }
    }
    return result;
  };

  describe('constructor (REQ-009 precondition)', () => {
    it('rejects a relative or empty prc directory with the precondition message', () => {
      expect(() => new PrcStore('relative/prc', logger)).toThrow('non-empty absolute path');
      expect(() => new PrcStore('', logger)).toThrow('non-empty absolute path');
    });
  });

  describe('importProcess (REQ-005, ACC-002/ACC-003/ACC-004/ACC-009)', () => {
    it('imports a foreign file: a v4 uuid, the slug from the process id, the copy in place, the original byte-identical', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'my-diagram.bpmn');
      const before = readFileSync(source);

      const result = expectImportOk(await store.importProcess(source));

      expect(result.uuid).toMatch(UUID_V4_SHAPE);
      expect(result.slug).toBe('order-process');
      expect(result.copied).toBe(true);
      expect(result.outOfBandReRead).toBe(false);
      expect(result.path).toBe(join(prcDir, `prc-${result.uuid}-order-process.bpmn`));
      expect(existsSync(result.path)).toBe(true);
      expect(readFileSync(result.path)).toEqual(before); // byte-identical copy
      expect(readFileSync(source)).toEqual(before); // the original stays byte-identical
      expect(records.some((record) => record.event === 'prc-import')).toBe(true);
    });

    it('falls back to the source filename stem when the document has no process id', async () => {
      const source = copyFixture(NO_ID_FIXTURE, 'fallback-name.bpmn');
      const result = expectImportOk(await store.importProcess(source));
      expect(result.slug).toBe('fallback-name');
    });

    it('re-importing the registered own path returns the same uuid and creates no second file (ACC-003)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));

      const second = expectImportOk(await store.importProcess(first.path));

      expect(second.uuid).toBe(first.uuid);
      expect(second.copied).toBe(false);
      expect(second.outOfBandReRead).toBe(false);
      expect(readdirSync(prcDir).filter((name) => name.endsWith('.bpmn'))).toHaveLength(1);
      expect(records.some((record) => record.event === 'prc-import-reuse')).toBe(true);
    });

    it('re-importing the same foreign source within the session returns the same uuid (ACC-003)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));

      const second = expectImportOk(await store.importProcess(source));

      expect(second.uuid).toBe(first.uuid);
      expect(second.copied).toBe(false);
      expect(readdirSync(prcDir).filter((name) => name.endsWith('.bpmn'))).toHaveLength(1);
    });

    it('rejects a missing path with a structured error, writing nothing (ACC-004)', async () => {
      const missing = join(foreignDir, 'nope.bpmn');
      const result = await store.importProcess(missing);
      expect(result).toEqual({
        ok: false,
        error: { code: 'path-missing', message: `${missing} does not exist` },
      });
      expect(existsSync(prcDir)).toBe(false);
    });

    it('rejects a directory with a structured error, writing nothing (ACC-004)', async () => {
      const result = await store.importProcess(foreignDir);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a directory import must fail');
      }
      expect(result.error.code).toBe('path-is-directory');
      expect(existsSync(prcDir)).toBe(false);
    });

    it('rejects a malformed XML file with a structured error, registering nothing (ACC-004)', async () => {
      const source = copyFixture(MALFORMED_FIXTURE, 'broken.bpmn');
      const result = await store.importProcess(source);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a malformed import must fail');
      }
      expect(result.error.code).toBe('not-bpmn');
      expect(result.error.message).toMatch(/^failed to parse BPMN 2\.0 XML: /);
      expect(existsSync(prcDir)).toBe(false);
    });

    it('rejects a valid-XML but non-BPMN file with a structured error (ACC-004)', async () => {
      const source = join(foreignDir, 'not-bpmn.bpmn');
      writeFileSync(source, '<foo><bar /></foo>');
      const result = await store.importProcess(source);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a non-BPMN import must fail');
      }
      expect(result.error.code).toBe('not-bpmn');
      expect(existsSync(prcDir)).toBe(false);
    });

    it('rejects a source that yields no slug with a structured error (ACC-004)', async () => {
      const source = join(foreignDir, '###.bpmn');
      writeFileSync(source, readFileSync(NO_ID_FIXTURE));
      const result = await store.importProcess(source);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a slug-less import must fail');
      }
      expect(result.error.code).toBe('no-slug');
      expect(existsSync(prcDir)).toBe(false);
    });

    it('works from an absent prc directory: the import creates it, the own-path export works (ACC-009)', async () => {
      expect(existsSync(prcDir)).toBe(false);
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = expectImportOk(await store.importProcess(source));
      expect(existsSync(prcDir)).toBe(true);

      const exported = await store.exportProcess(imported.uuid);
      expect(exported.ok).toBe(true);
      if (!exported.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(exported.path).toBe(imported.path);
    });
  });

  describe('the conditional re-read (REQ-004, ACC-006)', () => {
    it('serves the cached tree without a re-read note when the checksum is unchanged', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));

      const second = expectImportOk(await store.importProcess(first.path));

      expect(second.outOfBandReRead).toBe(false);
      expect(records.filter((record) => record.event === 'prc-reread-out-of-band')).toHaveLength(0);
    });

    it('detects an out-of-band change on the next import and serves the modification (ACC-006)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));
      writeFileSync(first.path, readFileSync(first.path, 'utf8').replace('Review order', 'Review order (revised)'));

      const second = expectImportOk(await store.importProcess(first.path));

      expect(second.outOfBandReRead).toBe(true);
      const warning = records.find((record) => record.event === 'prc-reread-out-of-band');
      expect(warning?.level).toBe('warn');

      const exported = await store.exportProcess(second.uuid);
      expect(exported.ok).toBe(true);
      if (!exported.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(readFileSync(exported.path, 'utf8')).toContain('Review order (revised)');
    });

    it('detects an out-of-band change on the next export and serializes the modification (ACC-006)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));
      writeFileSync(first.path, readFileSync(first.path, 'utf8').replace('name="Review order"', 'name="Second look"'));

      const result = await store.exportProcess(first.uuid);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(result.outOfBandReRead).toBe(true);
      expect(readFileSync(result.path, 'utf8')).toContain('Second look');
      expect(readFileSync(result.path, 'utf8')).not.toContain('Review order');
    });

    it('treats a cold-cache load (a new session over an existing directory) as a first parse, not an out-of-band re-read', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));

      const freshStore = new PrcStore(prcDir, logger);
      const result = expectImportOk(await freshStore.importProcess(first.path));

      expect(result.uuid).toBe(first.uuid);
      expect(result.outOfBandReRead).toBe(false);
      expect(records.some((record) => record.event === 'prc-cache-load')).toBe(true);
      expect(records.some((record) => record.event === 'prc-reread-out-of-band')).toBe(false);
    });
  });

  describe('exportProcess (REQ-006, ACC-005/ACC-009)', () => {
    it('exports to the own path by default, modifying no other file (ACC-005)', async () => {
      // A minified (non-normalized) source, so the default export's
      // serialization demonstrably rewrites the own file's bytes.
      const sourceA = join(foreignDir, 'a.bpmn');
      writeFileSync(sourceA, readFileSync(ORDER_FIXTURE, 'utf8').replace(/\s*\n\s*/g, ' '));
      const first = expectImportOk(await store.importProcess(sourceA));
      const second = expectImportOk(await store.importProcess(copyFixture(NO_ID_FIXTURE, 'b.bpmn')));
      const before = snapshot([prcDir, foreignDir]);

      const result = await store.exportProcess(first.uuid);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(result.path).toBe(first.path);
      expect(result.outOfBandReRead).toBe(false);
      const after = snapshot([prcDir, foreignDir]);
      expect(Object.keys(before).sort()).toEqual(Object.keys(after).sort());
      expect(after[second.path]).toBe(before[second.path]); // the other process is untouched
      expect(after[first.path]).not.toBe(before[first.path]); // the own file is rewritten

      // The written file is the bpmn-moddle serialization (the normalization).
      const written = readFileSync(result.path, 'utf8');
      const reParsed = (await parseBpmn(written)).rootElement;
      expect(await serializeBpmn(reParsed)).toBe(written);
    });

    it('updates the checksum to the written file after a default export (no spurious re-read)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));

      const exported = await store.exportProcess(first.uuid);
      expect(exported.ok).toBe(true);

      const reImport = expectImportOk(await store.importProcess(first.path));
      expect(reImport.outOfBandReRead).toBe(false);
    });

    it('exports to an explicit path, overwriting a pre-existing file, leaving the own file untouched (ACC-005)', async () => {
      const first = expectImportOk(await store.importProcess(copyFixture(ORDER_FIXTURE, 'src.bpmn')));
      const explicitDir = join(tempDir, 'explicit');
      const explicitPath = join(explicitDir, 'out.bpmn');
      mkdirSync(explicitDir);
      writeFileSync(explicitPath, 'pre-existing content');
      const ownBefore = sha256Hex(readFileSync(first.path));

      const result = await store.exportProcess(first.uuid, explicitPath);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(result.path).toBe(explicitPath);
      const written = readFileSync(explicitPath, 'utf8');
      expect(written).not.toBe('pre-existing content');
      expect(written).toContain('<bpmn:process id="order-process"');
      expect(sha256Hex(readFileSync(first.path))).toBe(ownBefore); // the own file is untouched
    });

    it('writes atomically: no temporary file remains after a successful export', async () => {
      const first = expectImportOk(await store.importProcess(copyFixture(ORDER_FIXTURE, 'src.bpmn')));
      const result = await store.exportProcess(first.uuid);
      expect(result.ok).toBe(true);
      expect(readdirSync(prcDir).filter((name) => name.includes('.tmp'))).toHaveLength(0);
    });

    it('verifies the REQ-006 postcondition: the written file re-parses to the source element set', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = expectImportOk(await store.importProcess(source));
      const explicitPath = join(tempDir, 'postcondition.bpmn');

      const result = await store.exportProcess(first.uuid, explicitPath);
      expect(result.ok).toBe(true);

      const writtenTree = (await parseBpmn(readFileSync(explicitPath))).rootElement;
      const sourceTree = (await parseBpmn(readFileSync(source))).rootElement;
      expect(collectElementInventory(writtenTree)).toEqual(collectElementInventory(sourceTree));
    });

    it('returns a structured not-registered error for an unknown uuid in every directory state (ACC-009)', async () => {
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';
      const expectedError = {
        ok: false,
        error: { code: 'process-not-registered', message: `process ${unknown} is not registered` },
      } as const;

      // (a) the directory is absent.
      let result = await store.exportProcess(unknown);
      expect(result).toEqual(expectedError);
      expect(existsSync(prcDir)).toBe(false);

      // (b) the directory is empty.
      mkdirSync(prcDir, { recursive: true });
      result = await store.exportProcess(unknown);
      expect(result).toEqual(expectedError);

      // (c) the directory is populated with a conforming file that was
      // never imported in this session -- registration is in-memory only.
      const diskOnlyUuid = '11111111-1111-4111-8111-111111111111';
      writeFileSync(join(prcDir, buildPrcFilename(diskOnlyUuid, 'disk-only')), readFileSync(ORDER_FIXTURE));
      result = await store.exportProcess(unknown);
      expect(result).toEqual(expectedError);
    });

    it('returns a structured path-missing error when the own file was deleted out of band', async () => {
      const first = expectImportOk(await store.importProcess(copyFixture(ORDER_FIXTURE, 'src.bpmn')));
      rmSync(first.path);
      const result = await store.exportProcess(first.uuid);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: the export must fail');
      }
      expect(result.error.code).toBe('path-missing');
    });

    it('returns a structured path-missing error when re-importing a deleted own path', async () => {
      const first = expectImportOk(await store.importProcess(copyFixture(ORDER_FIXTURE, 'src.bpmn')));
      rmSync(first.path);
      const result = await store.importProcess(first.path);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: the import must fail');
      }
      expect(result.error.code).toBe('path-missing');
    });
  });

  describe('the cross-process export overwrite (REQ-008)', () => {
    it('export of A to B own path overwrites B, and B detects it on the next operation', async () => {
      const a = expectImportOk(await store.importProcess(copyFixture(ORDER_FIXTURE, 'a.bpmn')));
      const b = expectImportOk(await store.importProcess(copyFixture(NO_ID_FIXTURE, 'b.bpmn')));
      expect(a.uuid).not.toBe(b.uuid);

      const overwrite = await store.exportProcess(a.uuid, b.path);
      expect(overwrite.ok).toBe(true);
      if (!overwrite.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(overwrite.path).toBe(b.path);
      const bTree = (await parseBpmn(readFileSync(b.path))).rootElement;
      expect(getProcessId(bTree)).toBe('order-process'); // B now carries A's content

      const bReImport = expectImportOk(await store.importProcess(b.path));
      expect(bReImport.outOfBandReRead).toBe(true); // B detects the out-of-band change

      const bExport = await store.exportProcess(b.uuid);
      expect(bExport.ok).toBe(true);
      if (!bExport.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(bExport.outOfBandReRead).toBe(false); // the re-read already happened
      const bExported = readFileSync(bExport.path, 'utf8');
      expect(bExported).toContain('order-process');
      expect(bExported).not.toContain('task-1');

      const aExport = await store.exportProcess(a.uuid);
      expect(aExport.ok).toBe(true);
      if (!aExport.ok) {
        throw new Error('unreachable: the export must succeed');
      }
      expect(aExport.outOfBandReRead).toBe(false); // A's checksum is unaffected
    });
  });

  describe('logger compatibility', () => {
    it('accepts a real pino logger without a cast (structural compatibility)', async () => {
      const lines: string[] = [];
      const stream = new Writable({
        write(chunk: Uint8Array | string, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
          lines.push(String(chunk));
          callback();
        },
      });
      const pinoLogger = pino({ level: 'info' }, stream);
      const pinoStore = new PrcStore(prcDir, pinoLogger);

      const result = await pinoStore.importProcess(copyFixture(ORDER_FIXTURE, 'src.bpmn'));
      expect(result.ok).toBe(true);

      expect(lines.some((line) => line.includes('prc-import'))).toBe(true);
    });
  });
});
