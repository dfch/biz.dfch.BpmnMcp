// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer as createNetServer } from 'node:net';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { LoggingConfig } from '../src/config.js';
import { resolveDocsPrcDir } from '../src/paths.js';
import type { PrcLogger } from '../src/prc/store.js';
import { PrcStore } from '../src/prc/store.js';
import { PreviewServer } from '../src/preview/preview-server.js';
import { createServer } from '../src/server.js';

/**
 * The packed-artifact legs (feat-11 REQ-003/REQ-004, Tasks 100.120/
 * 100.130, ACC-002/ACC-003/ACC-004): the `npm pack` tarball of the
 * `apps/mcp-server` workspace -- with the `prepack` pipeline (Task
 * 100.110) already run by npm -- contains exactly the REQ-003 file
 * set, and the packed artifact works standalone in a clean
 * environment: it installs from the tarball into a temporary prefix,
 * its `bin` launches, and the MCP handshake over stdio lists exactly
 * the tool set registered on `dev` (the in-process reference server
 * built from `src/` below -- one source, not this spec: a future
 * tool-surface change updates `src/server.ts`, and both the packed
 * artifact and this leg follow it).
 *
 * The clean-environment leg is the packed counterpart of the spawn
 * suite (`mcp-server.spawn.test.ts`): production dependencies resolve
 * from the npm registry into the temporary prefix, so the leg proves
 * the published package is self-contained -- no repository checkout,
 * no workspace `node_modules`, no repository-root `LICENSE` or
 * `logging.json` (both ship in the package, asserted below).
 *
 * Every test-created artifact is removed in `afterAll`: the tarball
 * (untracked, written into the app directory by `npm pack`), the
 * package-directory `LICENSE` (the prepack copy), and the temporary
 * prefixes -- the working tree stays clean apart from the committed
 * changes.
 */

// Resolve the package and repository roots independent of the test
// runner's working directory (test/ -> apps/mcp-server/ -> apps/ ->
// repository root).
const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(APP_DIR, '../..');
const SRC_DIR = join(APP_DIR, 'src');

const manifest = JSON.parse(readFileSync(join(APP_DIR, 'package.json'), 'utf8')) as {
  name: string;
  version: string;
};

const TARBALL_NAME = `${manifest.name}-${manifest.version}.tgz`;
const TARBALL_PATH = join(APP_DIR, TARBALL_NAME);
const PACKED_LICENSE = join(APP_DIR, 'LICENSE');
const DIST_ENTRY = join(APP_DIR, 'dist', 'index.js');
const SHEBANG = '#!/usr/bin/env node';
const EXECUTABLE_MAX_BUFFER = 64 * 1024 * 1024;

/** Frees an ephemeral test port (a probe listener on port 0). */
async function getFreePort(): Promise<number> {
  const probe = createNetServer();
  await new Promise<void>((resolveProbe) => probe.listen(0, '127.0.0.1', resolveProbe));
  const { port } = probe.address() as AddressInfo;
  await new Promise<void>((resolveClose) => probe.close(() => resolveClose()));
  return port;
}

/** Every file under `dir` (recursive, sorted, no extension filter). */
function listAllFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const result: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listAllFiles(full));
    } else {
      result.push(full);
    }
  }
  return result;
}

/**
 * The expected `dist/` entries of the packed tarball, derived from
 * the source tree (the independent half of the exact-set comparison):
 * every non-ambient `.ts` file under `src/` compiles to the matching
 * `.js` under `dist/` plus its `sourceMap` sibling `.js.map`
 * (`tsconfig.json`'s `sourceMap: true`; ambient `.d.ts` declaration
 * files are not emitted).
 */
function expectedDistFiles(): string[] {
  const result: string[] = [];
  for (const file of listAllFiles(SRC_DIR)) {
    const name = file.split('/').pop() ?? '';
    if (!name.endsWith('.ts') || name.endsWith('.d.ts')) {
      continue;
    }
    const rel = relative(SRC_DIR, file).replace(/\.ts$/, '.js');
    result.push(`package/dist/${rel}`, `package/dist/${rel}.map`);
  }
  return result;
}

/** The REQ-003 set: the four package-root files plus the full `dist/**` tree. */
function expectedTarballFiles(): string[] {
  return [
    'package/LICENSE',
    'package/README.md',
    'package/logging.json',
    'package/package.json',
    ...expectedDistFiles(),
  ];
}

/** Byte-snapshots every file under `dir` (the "sources untouched" claim). */
function snapshotTree(dir: string): Map<string, Buffer> {
  const result = new Map<string, Buffer>();
  for (const file of listAllFiles(dir)) {
    result.set(file, readFileSync(file));
  }
  return result;
}

/** The in-process reference server's config (never read over the wire in this leg). */
const loggingConfig: LoggingConfig = {
  logFile: 'logs/server',
  logLevel: 'info',
  logRotate: 'daily',
  logRetain: 7,
};

/** A silent pino-shaped logger for the in-process reference server (no tool call runs against it). */
const noopLogger: PrcLogger = { info: () => {}, warn: () => {}, error: () => {} };

// State built once in `beforeAll` (the expensive legs: `npm pack`, the
// registry install into the temporary prefix, the two clients).
let prefix: string;
let scratchCwd: string;
let inProcessToolNames: string[];
let tarballFiles: string[];
let expectedFiles: string[];
let sourceBefore: Map<string, Buffer>;
let originalDocsDir: string | undefined;
let packedClient: Client;
let packedTransport: StdioClientTransport;

describe('the packed artifact (feat-11 REQ-003/REQ-004, ACC-002/ACC-003/ACC-004)', () => {
  beforeAll(async () => {
    // (0) Snapshot the source tree before anything runs: the
    // prepack pipeline must leave every file under `src/`
    // byte-unchanged (REQ-002, ACC-003).
    sourceBefore = snapshotTree(SRC_DIR);

    // Remove stale artifacts of a crashed previous run (the tarball
    // and the prepack LICENSE copy are test-created, untracked files
    // inside the repository tree).
    rmSync(TARBALL_PATH, { force: true });
    rmSync(PACKED_LICENSE, { force: true });

    // (1) Pack the workspace package: npm runs the `prepack`
    // pipeline (build -> shebang + exec bit on `dist/index.js` ->
    // root `LICENSE` copied into the package directory) and writes
    // the tarball into the app directory.
    const packOutput = execFileSync('npm', ['pack'], {
      cwd: APP_DIR,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: EXECUTABLE_MAX_BUFFER,
    });
    const lastLine = packOutput.trim().split('\n').pop();
    expect(lastLine, `npm pack output:\n${packOutput}`).toBe(TARBALL_NAME);

    // (2) The post-prepack in-tree state (ACC-003): the built entry
    // carries the shebang and the exec bit, and the package-directory
    // LICENSE is byte-identical to the repository root's.
    expect(readFileSync(DIST_ENTRY, 'utf8').split('\n')[0]).toBe(SHEBANG);
    expect(statSync(DIST_ENTRY).mode & 0o111).toBe(0o111);
    expect(existsSync(PACKED_LICENSE)).toBe(true);
    expect(readFileSync(PACKED_LICENSE)).toEqual(readFileSync(join(REPO_ROOT, 'LICENSE')));

    // (3) The tarball's file list (files only -- directory entries
    // end in '/').
    const tarListing = execFileSync('tar', ['-tzf', TARBALL_PATH], {
      encoding: 'utf8',
      maxBuffer: EXECUTABLE_MAX_BUFFER,
    });
    tarballFiles = tarListing
      .split('\n')
      .filter((line) => line.length > 0 && !line.endsWith('/'))
      .sort();
    expectedFiles = expectedTarballFiles().sort();

    // (4) Install the tarball into a fresh temporary prefix: a
    // clean environment (no repository checkout, no workspace
    // node_modules) with production dependencies from the registry.
    prefix = mkdtempSync(join(tmpdir(), 'bpmnmcp-packed-prefix-'));
    writeFileSync(
      join(prefix, 'package.json'),
      `${JSON.stringify({ name: 'bpmnmcp-packed-artifact-test', version: '0.0.0', private: true }, null, 2)}\n`,
    );
    execFileSync('npm', ['install', TARBALL_PATH, '--no-audit', '--no-fund', '--loglevel=error'], {
      cwd: prefix,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: EXECUTABLE_MAX_BUFFER,
    });
    const installedPkg = join(prefix, 'node_modules', manifest.name);
    expect(existsSync(join(installedPkg, 'dist', 'index.js'))).toBe(true);
    // The shipped component files survive the install byte-identical.
    expect(readFileSync(join(installedPkg, 'LICENSE'))).toEqual(readFileSync(join(REPO_ROOT, 'LICENSE')));
    expect(readFileSync(join(installedPkg, 'logging.json'))).toEqual(readFileSync(join(APP_DIR, 'logging.json')));
    expect(readFileSync(join(installedPkg, 'dist', 'index.js'), 'utf8').split('\n')[0]).toBe(SHEBANG);
    expect(statSync(join(installedPkg, 'dist', 'index.js')).mode & 0o111).toBe(0o111);

    // (5) The in-process reference server, built from `src/` exactly
    // as `index.ts` wires it: the tool set registered on `dev`
    // (REQ-004's one source).
    originalDocsDir = process.env.BPMN_MCP_DOCS_DIR;
    const refTemp = mkdtempSync(join(tmpdir(), 'bpmnmcp-packed-ref-'));
    process.env.BPMN_MCP_DOCS_DIR = join(refTemp, 'docs');
    const refStore = new PrcStore(resolveDocsPrcDir(), noopLogger);
    const refPreviewServer = new PreviewServer(refStore, noopLogger, { port: await getFreePort() });
    const refServer = createServer(loggingConfig, refStore, refPreviewServer);
    const [refClientTransport, refServerTransport] = InMemoryTransport.createLinkedPair();
    const refClient = new Client({ name: 'packed-ref-client', version: '0.0.0' });
    await Promise.all([refServer.connect(refServerTransport), refClient.connect(refClientTransport)]);
    const { tools: refTools } = await refClient.listTools();
    inProcessToolNames = refTools.map((tool) => tool.name).sort();
    await refClient.close();
    await refPreviewServer.closeServer();
    rmSync(refTemp, { recursive: true, force: true });

    // (6) The packed server: launch the installed `bin` (the
    // `node_modules/.bin` symlink -- a direct exec, which proves the
    // shebang and the exec bit end to end) over stdio.
    scratchCwd = mkdtempSync(join(tmpdir(), 'bpmnmcp-packed-cwd-'));
    const binPath = join(prefix, 'node_modules', '.bin', manifest.name);
    packedTransport = new StdioClientTransport({
      command: binPath,
      cwd: scratchCwd,
      env: { ...process.env, BPMN_MCP_DOCS_DIR: join(scratchCwd, 'docs') },
      stderr: 'pipe',
    });
    packedClient = new Client({ name: 'packed-test-client', version: '0.0.0' });
    await packedClient.connect(packedTransport);
  }, 900_000);

  afterAll(async () => {
    try {
      await packedClient?.close();
    } finally {
      packedTransport?.close();
    }
    // Remove every test-created artifact: the temporary prefixes, the
    // untracked tarball, and the prepack LICENSE copy inside the
    // repository tree (the working tree stays clean).
    rmSync(prefix, { recursive: true, force: true });
    rmSync(scratchCwd, { recursive: true, force: true });
    rmSync(TARBALL_PATH, { force: true });
    rmSync(PACKED_LICENSE, { force: true });
    if (originalDocsDir === undefined) {
      delete process.env.BPMN_MCP_DOCS_DIR;
    } else {
      process.env.BPMN_MCP_DOCS_DIR = originalDocsDir;
    }
  }, 120_000);

  it('ACC-002/REQ-003: the npm pack tarball contains exactly the REQ-003 file set (fails on any extra or missing file)', () => {
    const expected = new Set(expectedFiles);
    const actual = new Set(tarballFiles);
    const extra = tarballFiles.filter((file) => !expected.has(file)).sort();
    const missing = expectedFiles.filter((file) => !actual.has(file)).sort();
    expect(extra, `files in the tarball that are not part of the REQ-003 set`).toEqual([]);
    expect(missing, `files of the REQ-003 set that are not in the tarball`).toEqual([]);
    expect(tarballFiles).toEqual(expectedFiles);
  });

  it('REQ-003: the packed dist/index.js carries the shebang; LICENSE and logging.json ship byte-identical; the manifest is publishable', () => {
    // The shebang-ed entry point (REQ-003's "dist/** (with the
    // shebang-ed index.js)"): read it out of the tarball itself.
    const packedEntry = execFileSync('tar', ['-xzOf', TARBALL_PATH, 'package/dist/index.js'], {
      maxBuffer: EXECUTABLE_MAX_BUFFER,
    });
    expect(packedEntry.toString('utf8').split('\n')[0]).toBe(SHEBANG);

    // The license text travels with the package (AGPL), byte-identical
    // to the repository root's; the committed component config ships
    // (Design Notes: "logging.json ships").
    const packedLicense = execFileSync('tar', ['-xzOf', TARBALL_PATH, 'package/LICENSE'], {
      maxBuffer: EXECUTABLE_MAX_BUFFER,
    });
    expect(packedLicense).toEqual(readFileSync(join(REPO_ROOT, 'LICENSE')));
    const packedLogging = execFileSync('tar', ['-xzOf', TARBALL_PATH, 'package/logging.json'], {
      maxBuffer: EXECUTABLE_MAX_BUFFER,
    });
    expect(packedLogging).toEqual(readFileSync(join(APP_DIR, 'logging.json')));

    // The published manifest: publishable (no `private`), the
    // gate-asserted license, and the kept bin/engines entries.
    const packedManifest = JSON.parse(
      execFileSync('tar', ['-xzOf', TARBALL_PATH, 'package/package.json'], {
        encoding: 'utf8',
        maxBuffer: EXECUTABLE_MAX_BUFFER,
      }),
    ) as { private?: boolean; license: string; bin: Record<string, string>; engines: { node: string } };
    expect(packedManifest.private).toBeUndefined();
    expect(packedManifest.license).toBe('AGPL-3.0-only');
    expect(packedManifest.bin[manifest.name]).toBe('dist/index.js');
    expect(packedManifest.engines.node).toBe('>=26');
  });

  it('ACC-004/REQ-004: the clean-environment packed artifact handshakes exactly the tool set registered on dev', async () => {
    // Today that set is the seven Stage 1 tools (import, export,
    // create, change, parse, validate, preview) -- the literal list is
    // pinned by the in-process and the spawn suites; this leg compares
    // the packed artifact against the set `src/server.ts` registers,
    // so a future tool-surface change updates one source, not this
    // spec (REQ-004).
    const { tools } = await packedClient.listTools();
    const packedToolNames = tools.map((tool) => tool.name).sort();
    expect(inProcessToolNames.length).toBeGreaterThan(0);
    expect(packedToolNames).toEqual(inProcessToolNames);
  }, 120_000);

  it('REQ-002/ACC-003: the prepack pipeline and the pack/install left every source file byte-unchanged', () => {
    const sourceAfter = snapshotTree(SRC_DIR);
    expect(sourceAfter.size).toBe(sourceBefore.size);
    for (const [file, before] of sourceBefore) {
      expect(sourceAfter.get(file), `source file changed: ${file}`).toEqual(before);
    }
    // In particular the entry point's SPDX header (the license drift
    // gate's invariant): lines 0/1 untouched, no shebang in source.
    const indexLines = readFileSync(join(SRC_DIR, 'index.ts'), 'utf8').split('\n');
    expect(indexLines[0]).toBe('// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH');
    expect(indexLines[1]).toBe('// SPDX-License-Identifier: AGPL-3.0-only');
    expect(indexLines[0]).not.toBe(SHEBANG);
  });
});
