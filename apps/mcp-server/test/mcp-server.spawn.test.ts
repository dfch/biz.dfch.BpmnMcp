// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/**
 * Spawn-based tests against the real, built artifact
 * (`node dist/index.js`) -- automating as much of feat-1's
 * ACC-006/007/008 as practical without a manual run, per Task
 * 110.140, and of feat-2's ACC-006/ACC-008: a clean start is
 * implicitly exercised by every test below (none of them create a
 * `.env` or override `logging.json`), but a dedicated assertion of
 * "no .env, no logging.json" is better checked by hand against a
 * truly pristine clone (see the plan's Progress -> Updates entry for
 * this phase).
 *
 * The tool tests set `BPMN_MCP_DOCS_DIR` to a temporary directory, so
 * the spawned server's `prc` directory (and the files `import`
 * copies into it) live under the temporary `cwd` and never touch the
 * repository tree.
 */

const DIST_ENTRY = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/index.js');

// Resolve the fixture directory independent of the test runner's
// working directory (test/ -> fixtures/).
const FIXTURES_DIR = resolve(fileURLToPath(new URL('./fixtures/', import.meta.url)));
const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');

const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** The `import` tool result's success JSON (feat-2 REQ-005). */
interface ImportSuccessPayload {
  uuid: string;
  path: string;
  slug: string;
  copied: boolean;
  outOfBandReRead: boolean;
  note?: string;
}

/** The `export` tool result's success JSON (feat-2 REQ-006). */
interface ExportSuccessPayload {
  uuid: string;
  path: string;
  outOfBandReRead: boolean;
  note?: string;
}

/** The tool outcome a test asserts on: the `isError` flag and the single text content. */
interface ToolOutcome {
  isError: boolean;
  text: string;
}

/**
 * Calls a tool over the stdio transport and extracts the single text
 * content (both tools emit exactly one content block). The SDK's
 * `callTool` return type is a union (the task-based member has no
 * `content`); the cast narrows to the plain result shape this
 * server's tools produce.
 */
async function callTool(client: Client, name: string, args: Record<string, unknown>): Promise<ToolOutcome> {
  const result = (await client.callTool({ name, arguments: args })) as {
    content: { type: string; text?: string }[];
    isError?: boolean;
  };
  const [content] = result.content;
  const text = content !== undefined && content.type === 'text' && typeof content.text === 'string' ? content.text : '';
  return { isError: result.isError === true, text };
}

/** Calls `import` over stdio and narrows the success JSON. */
async function importSuccess(client: Client, path: string): Promise<ImportSuccessPayload> {
  const outcome = await callTool(client, 'import', { path });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ImportSuccessPayload;
}

/** Connects a client to a fresh spawned server over `tempCwd` with the docs dir pointed at `docsDir`. */
function connectSpawnedServer(tempCwd: string, docsDir: string): { client: Client; transport: StdioClientTransport } {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [DIST_ENTRY],
    cwd: tempCwd,
    env: { ...process.env, BPMN_MCP_DOCS_DIR: docsDir },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'spawn-test-client', version: '0.0.0' });
  return { client, transport };
}

describe('spawned server over real stdio (ACC-006, ACC-007, ACC-008)', () => {
  let tempCwd: string;
  let client: Client;
  let transport: StdioClientTransport;

  beforeEach(() => {
    tempCwd = mkdtempSync(join(tmpdir(), 'bpmnmcp-spawn-'));
  });

  afterEach(async () => {
    await client?.close();
    rmSync(tempCwd, { recursive: true, force: true });
  });

  it('exists as a built artifact to spawn (run `npm run build` first)', () => {
    expect(existsSync(DIST_ENTRY)).toBe(true);
  });

  it('ACC-006: lists version/config over real stdio, with stdout carrying only protocol frames', async () => {
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [DIST_ENTRY],
      cwd: tempCwd,
      stderr: 'pipe',
    });
    client = new Client({ name: 'spawn-test-client', version: '0.0.0' });
    await client.connect(transport);

    const { resources } = await client.listResources();
    const names = resources.map((resource) => resource.name);
    expect(names).toContain('version');
    expect(names).toContain('config');

    // StdioClientTransport itself only ever reads/writes well-formed
    // JSON-RPC frames over stdout/stdin; a successful MCP exchange
    // above is the practical proof that nothing else interleaved
    // non-protocol bytes onto stdout (a stray console.log would have
    // corrupted the newline-delimited JSON-RPC stream and made the
    // exchange above fail to parse).
  });

  it('ACC-007 & ACC-008: creates the log file and reports the BPMN_MCP_DOCS_DIR-derived path, without creating the docs dir', async () => {
    const docsDir = join(tempCwd, 'custom-docs');
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [DIST_ENTRY],
      cwd: tempCwd,
      env: { ...process.env, BPMN_MCP_DOCS_DIR: docsDir },
      stderr: 'pipe',
    });
    client = new Client({ name: 'spawn-test-client', version: '0.0.0' });
    await client.connect(transport);

    const { contents } = await client.readResource({ uri: 'bpmnmcp://config' });
    const [content] = contents;
    if (!('text' in content)) {
      throw new Error('expected a text resource content');
    }
    const parsed = JSON.parse(content.text) as { paths: { docsPrcDir: string } };
    expect(parsed.paths.docsPrcDir).toBe(join(docsDir, 'prc'));
    expect(existsSync(docsDir)).toBe(false);

    // Give pino-roll a moment to flush its first write to disk.
    await new Promise((res) => setTimeout(res, 200));
    const logsDir = join(tempCwd, 'logs');
    expect(existsSync(logsDir)).toBe(true);
    const logFiles = readdirSync(logsDir);
    expect(logFiles.length).toBeGreaterThan(0);
    const firstLine = readFileSync(join(logsDir, logFiles[0]), 'utf8').trim().split('\n')[0];
    expect(() => JSON.parse(firstLine)).not.toThrow();
  });

  describe('the import/export tools (feat-2, ACC-006/ACC-008, stdio leg)', () => {
    it('lists exactly the import and export tools over real stdio (ACC-008)', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const { tools } = await client.listTools();
      expect(tools.map((tool) => tool.name).sort()).toEqual(['export', 'import']);
    });

    it('imports a fixture and exports it over real stdio (ACC-008, ACC-002, ACC-005)', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const fixtureBefore = readFileSync(ORDER_FIXTURE);
      const imported = await importSuccess(client, ORDER_FIXTURE);
      expect(imported.uuid).toMatch(UUID_V4_SHAPE);
      expect(imported.slug).toBe('order-process');
      expect(imported.copied).toBe(true);
      expect(imported.outOfBandReRead).toBe(false);
      expect(imported.path).toBe(join(docsDir, 'prc', `prc-${imported.uuid}-order-process.bpmn`));
      expect(existsSync(imported.path)).toBe(true);
      // Copy-on-import: the own file is the byte-identical copy, the
      // original fixture is untouched.
      expect(readFileSync(imported.path)).toEqual(fixtureBefore);
      expect(readFileSync(ORDER_FIXTURE)).toEqual(fixtureBefore);

      // Default export: only the own path is written.
      const ownExport = await callTool(client, 'export', { uuid: imported.uuid });
      expect(ownExport.isError).toBe(false);
      const ownParsed = JSON.parse(ownExport.text) as ExportSuccessPayload;
      expect(ownParsed.path).toBe(imported.path);
      expect(ownParsed.outOfBandReRead).toBe(false);

      // Explicit-path export: only the explicit path is written.
      const explicitPath = join(tempCwd, 'explicit.bpmn');
      const explicitExport = await callTool(client, 'export', { uuid: imported.uuid, path: explicitPath });
      expect(explicitExport.isError).toBe(false);
      const explicitParsed = JSON.parse(explicitExport.text) as ExportSuccessPayload;
      expect(explicitParsed.path).toBe(explicitPath);
      expect(existsSync(explicitPath)).toBe(true);
      expect(readFileSync(explicitPath, 'utf8')).toContain('<bpmn:process id="order-process"');

      // An unknown UUID is a structured error over the wire, not a crash.
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';
      const unknownExport = await callTool(client, 'export', { uuid: unknown });
      expect(unknownExport.isError).toBe(true);
      expect(unknownExport.text).toBe(`process ${unknown} is not registered`);
    });

    it('notes the out-of-band re-read and serves the modification over real stdio (ACC-006, process-level)', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);

      // Modify the registered own file out of band (the test process
      // is "another instance" for the spawned server).
      const ownContent = readFileSync(imported.path, 'utf8');
      writeFileSync(imported.path, ownContent.replace('name="Review order"', 'name="Second look"'));

      // The next operation re-reads the file and notes it in the result.
      const exportOutcome = await callTool(client, 'export', { uuid: imported.uuid });
      expect(exportOutcome.isError).toBe(false);
      const exported = JSON.parse(exportOutcome.text) as ExportSuccessPayload;
      expect(exported.outOfBandReRead).toBe(true);
      expect(exported.note).toMatch(/out of band/);
      expect(exported.note).not.toContain('\n');
      // The serialized content reflects the modification.
      expect(readFileSync(imported.path, 'utf8')).toContain('Second look');
      expect(readFileSync(imported.path, 'utf8')).not.toContain('Review order');

      // The checksum tracks the written file now: the following
      // re-import is a cache hit, still the same UUID.
      const reImport = await importSuccess(client, imported.path);
      expect(reImport.uuid).toBe(imported.uuid);
      expect(reImport.copied).toBe(false);
      expect(reImport.outOfBandReRead).toBe(false);
    });
  });
});
