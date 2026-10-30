// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/**
 * Spawn-based tests against the real, built artifact
 * (`node dist/index.js`) -- automating as much of ACC-006/007/008 as
 * practical without a manual run, per Task 110.140. ACC-009's
 * no-`.env`/no-`logging.json` clean-start case and ACC-011 (watch
 * mode) are left to Task 110.150's manual verification: a clean
 * start is implicitly exercised by every test below (none of them
 * create a `.env` or override `logging.json`), but a dedicated
 * assertion of "no .env, no logging.json" is better checked by hand
 * against a truly pristine clone (see the plan's Progress -> Updates
 * entry for this phase).
 */

const DIST_ENTRY = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/index.js');

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
});
