// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { LoggingConfig } from '../src/config.js';
import { readPackageMetadata } from '../src/package-metadata.js';
import { resolveDocsPrcDir } from '../src/paths.js';
import { collectAddressableInventory, collectElementInventory, parseBpmn } from '../src/prc/moddle.js';
import type { PrcLogger } from '../src/prc/store.js';
import { PrcStore } from '../src/prc/store.js';
import { createServer } from '../src/server.js';

/**
 * MCP-level test over the SDK `Client` and an in-memory transport
 * pair -- no process spawn. The resources cover feat-1's
 * REQ-011/ACC-010; the tools cover feat-2's REQ-005/REQ-006/REQ-007
 * (the adapter layer: the zod input shapes, the error mapping to
 * `isError` results, the JSON success mapping) and the in-process
 * legs of ACC-006 (the out-of-band re-read note) and ACC-007 (the
 * 1.0070 round-trip inventory comparison).
 *
 * Like feat-1's `paths.test.ts`, the tests run with a temporary
 * working directory and set `BPMN_MCP_DOCS_DIR`, so the store is
 * constructed exactly as `index.ts` constructs it (the resolved `prc`
 * path) and never touches the repository tree.
 */

// Resolve the fixture directory independent of the test runner's
// working directory (test/ -> fixtures/).
const FIXTURES_DIR = resolve(fileURLToPath(new URL('./fixtures/', import.meta.url)));
const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');
const MALFORMED_FIXTURE = join(FIXTURES_DIR, 'malformed.bpmn');
const FLAWED_FIXTURE = join(FIXTURES_DIR, 'flawed-process.bpmn');

const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * The pinned findings of the flawed fixture under the committed
 * config (feat-19 Task 100.100 spike; the same set the lint core
 * pins in `test/prc/lint.test.ts`): deterministic order, by rule,
 * then element id.
 */
const FLAWED_EXPECTED = [
  { rule: 'end-event-required', elementId: 'flawed-process', message: 'Process is missing end event' },
  { rule: 'no-disconnected', elementId: 'orphan-task', message: 'Element is not connected' },
  { rule: 'no-implicit-end', elementId: 'orphan-task', message: 'Element is an implicit end' },
  { rule: 'no-implicit-end', elementId: 'review', message: 'Element is an implicit end' },
  { rule: 'no-implicit-start', elementId: 'orphan-task', message: 'Element is an implicit start' },
];

/** The `import` tool result's success JSON (REQ-005). */
interface ImportSuccessPayload {
  uuid: string;
  path: string;
  slug: string;
  copied: boolean;
  outOfBandReRead: boolean;
  note?: string;
}

/** The `export` tool result's success JSON (REQ-006). */
interface ExportSuccessPayload {
  uuid: string;
  path: string;
  outOfBandReRead: boolean;
  note?: string;
}

/** The `create` tool result's success JSON (feat-17 REQ-001). */
interface CreateSuccessPayload {
  uuid: string;
  name: string;
  processId: string;
  slug: string;
  elementCount: number;
}

/** The `change` tool result's success JSON (feat-17 REQ-002; the detail fields vary per action). */
interface ChangeSuccessPayload {
  uuid: string;
  action: string;
  persisted: boolean;
  outOfBandReRead: boolean;
  note?: string;
  [detail: string]: unknown;
}

/** The `parse` tool result's success JSON (feat-18 REQ-001). */
interface ParseSuccessPayload {
  uuid: string;
  elements: { id: string; type: string; name?: string }[];
  flows: { id: string; kind: string; source?: string; target?: string; conditionExpression?: string }[];
  outOfBandReRead: boolean;
  note?: string;
}

/** The `validate` tool result's success JSON (feat-19 REQ-004). */
interface ValidateSuccessPayload {
  uuid: string;
  status: string | number;
  findings: { rule: string; elementId?: string; message: string }[];
  outOfBandReRead: boolean;
  note?: string;
}

/** The `config` resource's `bpmnlint` member (feat-19 REQ-005, ACC-005). */
interface BpmnlintResourceJson {
  preset?: string;
  error?: { code: string; message: string };
}

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

/** The tool outcome a test asserts on: the `isError` flag and the single text content. */
interface ToolOutcome {
  isError: boolean;
  text: string;
}

/**
 * Calls a tool and extracts the single text content (both tools emit
 * exactly one content block). The SDK's `callTool` return type is a
 * union (the task-based member has no `content`); the cast narrows to
 * the plain result shape this server's tools produce.
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

/** Calls `import` and narrows the success JSON (the test expects success). */
async function importSuccess(client: Client, path: string): Promise<ImportSuccessPayload> {
  const outcome = await callTool(client, 'import', { path });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ImportSuccessPayload;
}

/** Calls `create` and narrows the success JSON (the test expects success). */
async function createSuccess(
  client: Client,
  args: { name: string; elements?: Record<string, unknown>[] },
): Promise<CreateSuccessPayload> {
  const outcome = await callTool(client, 'create', args);
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as CreateSuccessPayload;
}

/** Calls `change` and narrows the success JSON (the test expects success). */
async function changeSuccess(client: Client, args: Record<string, unknown>): Promise<ChangeSuccessPayload> {
  const outcome = await callTool(client, 'change', args);
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ChangeSuccessPayload;
}

/** Calls `parse` and narrows the success JSON (the test expects success). */
async function parseSuccess(client: Client, uuid: string): Promise<ParseSuccessPayload> {
  const outcome = await callTool(client, 'parse', { uuid });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ParseSuccessPayload;
}

/** Calls `validate` and narrows the success JSON (the test expects success). */
async function validateSuccess(client: Client, uuid: string): Promise<ValidateSuccessPayload> {
  const outcome = await callTool(client, 'validate', { uuid });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ValidateSuccessPayload;
}

/** Reads the `config` resource's `bpmnlint` member (feat-19 REQ-005, ACC-005). */
async function readBpmnlintConfigMember(client: Client): Promise<BpmnlintResourceJson> {
  const { contents } = await client.readResource({ uri: 'bpmnmcp://config' });
  const [content] = contents;
  if (!('text' in content)) {
    throw new Error('expected a text resource content');
  }
  const parsed = JSON.parse(content.text) as { bpmnlint: BpmnlintResourceJson };
  return parsed.bpmnlint;
}

describe('MCP server (feat-1 resources, feat-2 import/export tools)', () => {
  let client: Client;
  let tempDir: string;
  let foreignDir: string;
  let originalCwd: string;
  let originalDocsDir: string | undefined;
  let logger: PrcLogger;
  let records: LogRecord[];

  const loggingConfig: LoggingConfig = {
    logFile: 'logs/server',
    logLevel: 'info',
    logRotate: 'daily',
    logRetain: 7,
  };

  beforeEach(async () => {
    originalCwd = process.cwd();
    originalDocsDir = process.env.BPMN_MCP_DOCS_DIR;
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-mcp-'));
    foreignDir = join(tempDir, 'foreign');
    mkdirSync(foreignDir);
    process.chdir(tempDir);
    process.env.BPMN_MCP_DOCS_DIR = join(tempDir, 'docs');
    ({ logger, records } = createFakeLogger());

    // Exactly as index.ts wires it: the resolved prc path + the logger.
    const store = new PrcStore(resolveDocsPrcDir(), logger);
    const server = createServer(loggingConfig, store);
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    client = new Client({ name: 'test-client', version: '0.0.0' });

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  });

  afterEach(async () => {
    await client.close();
    process.chdir(originalCwd);
    if (originalDocsDir === undefined) {
      delete process.env.BPMN_MCP_DOCS_DIR;
    } else {
      process.env.BPMN_MCP_DOCS_DIR = originalDocsDir;
    }
    rmSync(tempDir, { recursive: true, force: true });
  });

  /** Copies a committed fixture into the foreign directory under a chosen name. */
  const copyFixture = (fixture: string, name: string): string => {
    const target = join(foreignDir, name);
    writeFileSync(target, readFileSync(fixture));
    return target;
  };

  describe('resources (feat-1, REQ-011/ACC-010)', () => {
    it('lists both the version and config resources', async () => {
      const { resources } = await client.listResources();
      const names = resources.map((resource) => resource.name);
      expect(names).toContain('version');
      expect(names).toContain('config');
    });

    it('reads the version resource with the correct server name and version', async () => {
      const expected = readPackageMetadata();
      const { contents } = await client.readResource({ uri: 'bpmnmcp://version' });
      const [content] = contents;
      if (!('text' in content)) {
        throw new Error('expected a text resource content');
      }
      const parsed = JSON.parse(content.text) as { name: string; version: string };
      expect(parsed).toEqual(expected);
    });

    it('reads the config resource with the expected shape', async () => {
      const { contents } = await client.readResource({ uri: 'bpmnmcp://config' });
      const [content] = contents;
      if (!('text' in content)) {
        throw new Error('expected a text resource content');
      }
      const parsed = JSON.parse(content.text);

      expect(parsed).toEqual({
        logging: {
          destination: 'logs/server',
          level: 'info',
          rotation: 'daily',
        },
        otel: {
          endpoint: 'disabled',
        },
        paths: {
          docsPrcDir: join(tempDir, 'docs', 'prc'),
        },
        // The resolved preset of the committed .bpmnlintrc (feat-19
        // REQ-005/ACC-002), not a placeholder.
        bpmnlint: {
          preset: 'bpmnlint:recommended',
        },
      });
    });
  });

  it('lists exactly the six tools: change, create, export, import, parse, validate (feat-19 ACC-003)', async () => {
    // The handshake lists create, change, parse, and validate in
    // addition to the existing tools.
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      'change',
      'create',
      'export',
      'import',
      'parse',
      'validate',
    ]);
  });

  describe('the import tool (REQ-005, REQ-007, ACC-002/ACC-003/ACC-004)', () => {
    it('imports a foreign fixture: JSON with the v4 uuid, the registered path, the slug, copied (ACC-002)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'my-diagram.bpmn');
      const before = readFileSync(source);

      const parsed = await importSuccess(client, source);

      expect(parsed.uuid).toMatch(UUID_V4_SHAPE);
      expect(parsed.slug).toBe('order-process');
      expect(parsed.copied).toBe(true);
      expect(parsed.outOfBandReRead).toBe(false);
      expect(parsed.note).toBeUndefined();
      expect(parsed.path).toBe(join(resolveDocsPrcDir(), `prc-${parsed.uuid}-order-process.bpmn`));
      expect(existsSync(parsed.path)).toBe(true);
      expect(readFileSync(parsed.path)).toEqual(before); // the byte-identical copy
      expect(readFileSync(source)).toEqual(before); // the original stays byte-identical
    });

    it('re-importing the registered own path returns the same uuid, copied false, no second file (ACC-003)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = await importSuccess(client, source);

      const second = await importSuccess(client, first.path);

      expect(second.uuid).toBe(first.uuid);
      expect(second.copied).toBe(false);
      expect(second.outOfBandReRead).toBe(false);
      expect(readdirSync(resolveDocsPrcDir())).toHaveLength(1);
    });

    it('re-importing the same foreign source within the session returns the same uuid (ACC-003)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const first = await importSuccess(client, source);

      const second = await importSuccess(client, source);

      expect(second.uuid).toBe(first.uuid);
      expect(second.copied).toBe(false);
      expect(readdirSync(resolveDocsPrcDir())).toHaveLength(1);
    });

    it('maps a missing path to a single-line isError result and registers nothing (ACC-004)', async () => {
      const missing = join(foreignDir, 'nope.bpmn');

      const outcome = await callTool(client, 'import', { path: missing });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`${missing} does not exist`);
      expect(outcome.text).not.toContain('\n');
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('maps a directory source to a single-line isError result (ACC-004)', async () => {
      const outcome = await callTool(client, 'import', { path: foreignDir });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`the import source ${foreignDir} is a directory, not a file`);
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('maps unparseable XML to a single-line isError result with the bpmn-moddle cause (ACC-004)', async () => {
      const source = copyFixture(MALFORMED_FIXTURE, 'broken.bpmn');

      const outcome = await callTool(client, 'import', { path: source });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toMatch(/^failed to parse BPMN 2\.0 XML: /);
      expect(outcome.text).not.toContain('\n');
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('rejects a malformed input shape via zod (no crash, an isError result)', async () => {
      const missingArg = await callTool(client, 'import', {});
      expect(missingArg.isError).toBe(true);
      expect(missingArg.text.length).toBeGreaterThan(0);

      const wrongType = await callTool(client, 'import', { path: 42 });
      expect(wrongType.isError).toBe(true);
      expect(wrongType.text.length).toBeGreaterThan(0);

      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });
  });

  describe('the export tool (REQ-006, REQ-007, ACC-005/ACC-009)', () => {
    it('exports to the own path by default: JSON with the uuid and the own path, no re-read (ACC-005)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);

      const outcome = await callTool(client, 'export', { uuid: imported.uuid });

      expect(outcome.isError).toBe(false);
      const parsed = JSON.parse(outcome.text) as ExportSuccessPayload;
      expect(parsed.uuid).toBe(imported.uuid);
      expect(parsed.path).toBe(imported.path);
      expect(parsed.outOfBandReRead).toBe(false);
      expect(parsed.note).toBeUndefined();
      expect(readFileSync(parsed.path, 'utf8')).toContain('<bpmn:process id="order-process"');
    });

    it('exports to an explicit path, overwriting a pre-existing file, leaving the own file untouched (ACC-005)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      const explicitPath = join(tempDir, 'out.bpmn');
      writeFileSync(explicitPath, 'pre-existing content');
      const ownBefore = readFileSync(imported.path);

      const outcome = await callTool(client, 'export', { uuid: imported.uuid, path: explicitPath });

      expect(outcome.isError).toBe(false);
      const parsed = JSON.parse(outcome.text) as ExportSuccessPayload;
      expect(parsed.path).toBe(explicitPath);
      expect(readFileSync(explicitPath, 'utf8')).not.toBe('pre-existing content');
      expect(readFileSync(imported.path)).toEqual(ownBefore);
    });

    it('maps an unknown uuid to a single-line isError result in every directory state (ACC-009)', async () => {
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';

      // (a) the prc directory is absent.
      let outcome = await callTool(client, 'export', { uuid: unknown });
      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`process ${unknown} is not registered`);
      expect(outcome.text).not.toContain('\n');
      expect(existsSync(resolveDocsPrcDir())).toBe(false);

      // (b) the prc directory is populated, the uuid still unknown this session.
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      await importSuccess(client, source);
      outcome = await callTool(client, 'export', { uuid: unknown });
      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`process ${unknown} is not registered`);
    });

    it('rejects a malformed input shape via zod (no crash, an isError result)', async () => {
      const outcome = await callTool(client, 'export', {});

      expect(outcome.isError).toBe(true);
      expect(outcome.text.length).toBeGreaterThan(0);
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });
  });

  describe('the create tool (feat-17 REQ-001, REQ-006, ACC-001 in-process leg)', () => {
    it('creates an empty session draft: JSON with the v4 uuid, the derived identity, no file', async () => {
      const parsed = await createSuccess(client, { name: 'Order Intake' });

      expect(parsed.uuid).toMatch(UUID_V4_SHAPE);
      expect(parsed.name).toBe('Order Intake');
      expect(parsed.processId).toBe('order-intake');
      expect(parsed.slug).toBe('order-intake');
      expect(parsed.elementCount).toBe(0);
      // The draft is in memory only: no file, no prc directory.
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('creates a process with initial elements: the generated ids stay family-aware (REQ-004)', async () => {
      const parsed = await createSuccess(client, {
        name: 'Seeded',
        elements: [{ type: 'start-event' }, { type: 'task', name: 'Work' }],
      });

      expect(parsed.elementCount).toBe(2);
      const added = await changeSuccess(client, { uuid: parsed.uuid, action: 'add-element', type: 'task' });

      // The seeded task took task_1; the next generated task is task_2.
      expect(added).toMatchObject({ id: 'task_2', type: 'task', persisted: false });
    });

    it('maps a whitespace-only name to a single-line isError result, registering nothing (REQ-007)', async () => {
      const outcome = await callTool(client, 'create', { name: '   ' });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe('the process name must be a non-blank string');
      expect(outcome.text).not.toContain('\n');
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('rejects an empty name, an unknown element type, and negative coordinates via zod (single-line isError)', async () => {
      const emptyName = await callTool(client, 'create', { name: '' });
      expect(emptyName.isError).toBe(true);
      expect(emptyName.text).not.toContain('\n');
      expect(emptyName.text).toMatch(/at name/);

      const unknownType = await callTool(client, 'create', { name: 'P', elements: [{ type: 'warp-gate' }] });
      expect(unknownType.isError).toBe(true);
      expect(unknownType.text).not.toContain('\n');
      expect(unknownType.text).toMatch(/at elements\[0\]\.type/);

      const negativeCoord = await callTool(client, 'create', {
        name: 'P',
        elements: [{ type: 'task', x: -5, y: 10 }],
      });
      expect(negativeCoord.isError).toBe(true);
      expect(negativeCoord.text).not.toContain('\n');
      expect(negativeCoord.text).toMatch(/at elements\[0\]\.x/);

      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });
  });

  describe('the change tool (feat-17 REQ-002, REQ-005, REQ-007, ACC-002/ACC-005 in-process leg)', () => {
    it('adds, updates, connects, and deletes on a draft: the flattened detail JSON, persisted false (ACC-002)', async () => {
      const created = await createSuccess(client, { name: 'Draft Flow' });

      const start = await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'start-event' });
      expect(start).toMatchObject({
        uuid: created.uuid,
        action: 'add-element',
        id: 'startEvent_1',
        type: 'start-event',
        persisted: false,
        outOfBandReRead: false,
      });
      expect(start.note).toBeUndefined();

      const task = await changeSuccess(client, {
        uuid: created.uuid,
        action: 'add-element',
        type: 'task',
        name: 'First',
        x: 120,
        y: 100,
      });
      expect(task).toMatchObject({ id: 'task_1', name: 'First', x: 120, y: 100, persisted: false });

      const renamed = await changeSuccess(client, {
        uuid: created.uuid,
        action: 'update-element',
        id: 'task_1',
        name: 'Renamed',
      });
      expect(renamed).toMatchObject({ action: 'update-element', id: 'task_1', name: 'Renamed' });

      const flow = await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
        conditionExpression: 'approved == true',
      });
      expect(flow).toMatchObject({
        action: 'connect',
        flowId: 'sequenceFlow_1',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
        conditionSet: true,
      });

      const deleted = await changeSuccess(client, { uuid: created.uuid, action: 'delete-element', id: 'task_1' });
      expect(deleted).toMatchObject({
        action: 'delete-element',
        id: 'task_1',
        kind: 'element',
        removedFlows: 1,
        removedDiShapes: 1,
        removedDiEdges: 1,
      });
    });

    it('is write-through for a registered process: the own file carries the mutation (REQ-005)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);

      const changed = await changeSuccess(client, {
        uuid: imported.uuid,
        action: 'add-element',
        type: 'task',
        name: 'Extra step',
      });

      expect(changed).toMatchObject({ id: 'task_1', persisted: true, outOfBandReRead: false });
      expect(readFileSync(imported.path, 'utf8')).toContain('id="task_1"');
    });

    it('maps an unknown uuid to a single-line isError result (ACC-005)', async () => {
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';

      const outcome = await callTool(client, 'change', { uuid: unknown, action: 'delete-element', id: 'x' });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`process ${unknown} is not registered`);
      expect(outcome.text).not.toContain('\n');
    });

    it('rejects an unknown action, an unknown element type, and negative coordinates via zod (ACC-005)', async () => {
      const created = await createSuccess(client, { name: 'P' });

      const unknownAction = await callTool(client, 'change', { uuid: created.uuid, action: 'teleport' });
      expect(unknownAction.isError).toBe(true);
      expect(unknownAction.text).not.toContain('\n');
      expect(unknownAction.text).toMatch(/at action/);

      const unknownType = await callTool(client, 'change', {
        uuid: created.uuid,
        action: 'add-element',
        type: 'warp-gate',
      });
      expect(unknownType.isError).toBe(true);
      expect(unknownType.text).not.toContain('\n');
      expect(unknownType.text).toMatch(/at type/);

      const negativeCoord = await callTool(client, 'change', {
        uuid: created.uuid,
        action: 'add-element',
        type: 'task',
        x: -5,
        y: 10,
      });
      expect(negativeCoord.isError).toBe(true);
      expect(negativeCoord.text).not.toContain('\n');
      expect(negativeCoord.text).toMatch(/at x/);
    });

    it('rejects a missing per-action field with a single-line isError result (ACC-005)', async () => {
      const created = await createSuccess(client, { name: 'P' });

      const missingTarget = await callTool(client, 'change', {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'a',
      });

      expect(missingTarget.isError).toBe(true);
      expect(missingTarget.text).not.toContain('\n');
      expect(missingTarget.text).toMatch(/targetId/);
    });

    it('maps the core editing errors to single-line isError results, leaving the draft usable (ACC-005)', async () => {
      const created = await createSuccess(client, {
        name: 'P',
        elements: [{ type: 'start-event' }, { type: 'task' }],
      });

      const legs: { args: Record<string, unknown>; pattern: RegExp }[] = [
        {
          args: { uuid: created.uuid, action: 'connect', sourceId: 'ghost', targetId: 'task_1' },
          pattern: /the source element "ghost" does not exist in the process/,
        },
        {
          args: { uuid: created.uuid, action: 'connect', sourceId: 'startEvent_1', targetId: 'ghost' },
          pattern: /the target element "ghost" does not exist in the process/,
        },
        {
          args: { uuid: created.uuid, action: 'delete-element', id: 'ghost' },
          pattern: /no element with id "ghost" in the process/,
        },
        {
          args: { uuid: created.uuid, action: 'add-element', type: 'task', id: 'startEvent_1' },
          pattern: /element id "startEvent_1" already exists in the process/,
        },
        {
          args: { uuid: created.uuid, action: 'connect', sourceId: 'task_1', targetId: 'task_1' },
          pattern: /source and target are the same element \("task_1"\)/,
        },
        {
          args: { uuid: created.uuid, action: 'update-element', id: 'task_1', isInterrupting: false },
          pattern: /isInterrupting is only supported on start events/,
        },
        {
          args: { uuid: created.uuid, action: 'add-element', type: 'task', id: 'bad id' },
          pattern: /the supplied element id "bad id" is not a valid BPMN id/,
        },
      ];
      for (const { args, pattern } of legs) {
        const outcome = await callTool(client, 'change', args);
        expect(outcome.isError, JSON.stringify(args)).toBe(true);
        expect(outcome.text, JSON.stringify(args)).toMatch(pattern);
        expect(outcome.text, JSON.stringify(args)).not.toContain('\n');
      }

      // The draft state survived every failure: isInterrupting still
      // works on the start event, and the draft still changes.
      const interrupting = await changeSuccess(client, {
        uuid: created.uuid,
        action: 'update-element',
        id: 'startEvent_1',
        isInterrupting: false,
      });
      expect(interrupting).toMatchObject({ isInterrupting: false, persisted: false });

      const survived = await changeSuccess(client, {
        uuid: created.uuid,
        action: 'update-element',
        id: 'task_1',
        name: 'Still here',
      });
      expect(survived).toMatchObject({ id: 'task_1', name: 'Still here' });
    });
  });

  describe('the out-of-band re-read (REQ-004, ACC-006, in-process leg)', () => {
    it('notes the re-read in the import result and the structured log', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      writeFileSync(
        imported.path,
        readFileSync(imported.path, 'utf8').replace('name="Review order"', 'name="Second look"'),
      );

      const outcome = await callTool(client, 'import', { path: imported.path });

      expect(outcome.isError).toBe(false);
      const parsed = JSON.parse(outcome.text) as ImportSuccessPayload;
      expect(parsed.uuid).toBe(imported.uuid);
      expect(parsed.copied).toBe(false);
      expect(parsed.outOfBandReRead).toBe(true);
      expect(parsed.note).toMatch(/out of band/);
      expect(parsed.note).not.toContain('\n');
      expect(records.some((record) => record.event === 'prc-reread-out-of-band')).toBe(true);
    });

    it('notes the re-read in the export result and serializes the modification', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      writeFileSync(
        imported.path,
        readFileSync(imported.path, 'utf8').replace('name="Review order"', 'name="Second look"'),
      );
      const explicitPath = join(tempDir, 'revised.bpmn');

      const outcome = await callTool(client, 'export', { uuid: imported.uuid, path: explicitPath });

      expect(outcome.isError).toBe(false);
      const parsed = JSON.parse(outcome.text) as ExportSuccessPayload;
      expect(parsed.outOfBandReRead).toBe(true);
      expect(parsed.note).toMatch(/out of band/);
      expect(parsed.note).not.toContain('\n');
      expect(readFileSync(explicitPath, 'utf8')).toContain('Second look');
      expect(readFileSync(explicitPath, 'utf8')).not.toContain('Review order');
    });

    it('notes the re-read in the change result and writes through over the modification (feat-17)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      writeFileSync(
        imported.path,
        readFileSync(imported.path, 'utf8').replace('name="Order received"', 'name="Out of band"'),
      );

      const outcome = await callTool(client, 'change', {
        uuid: imported.uuid,
        action: 'update-element',
        id: 'review-task',
        name: 'Renamed',
      });

      expect(outcome.isError).toBe(false);
      const parsed = JSON.parse(outcome.text) as ChangeSuccessPayload;
      expect(parsed.outOfBandReRead).toBe(true);
      expect(parsed.note).toMatch(/out of band/);
      expect(parsed.note).not.toContain('\n');
      expect(parsed.persisted).toBe(true);
      // The write-through serialization carries both the modification
      // (a different element) and the applied change.
      expect(readFileSync(imported.path, 'utf8')).toContain('Out of band');
      expect(readFileSync(imported.path, 'utf8')).toContain('name="Renamed"');
    });
  });

  describe('the parse tool (feat-18 REQ-001/REQ-004, adapter leg)', () => {
    // The exact-literal, out-of-band, draft, and server-usability legs
    // live in the spawn suite (Task 110.110); this block pins only the
    // adapter mapping: the success JSON shape and the input rejections.

    it('parses an imported process: the success JSON shape, no note (REQ-001)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);

      const parsed = await parseSuccess(client, imported.uuid);

      expect(parsed.uuid).toBe(imported.uuid);
      expect(parsed.outOfBandReRead).toBe(false);
      expect(parsed.note).toBeUndefined();
      expect(parsed.elements.length).toBeGreaterThan(0);
      for (const element of parsed.elements) {
        expect(typeof element.id).toBe('string');
        expect(typeof element.type).toBe('string');
      }
      expect(parsed.flows.length).toBeGreaterThan(0);
      for (const flow of parsed.flows) {
        expect(flow.kind).toMatch(/^(sequence|message)$/);
      }
    });

    it('maps an unknown uuid to a single-line isError result (REQ-004)', async () => {
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';

      const outcome = await callTool(client, 'parse', { uuid: unknown });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`process ${unknown} is not registered`);
      expect(outcome.text).not.toContain('\n');
    });

    it('rejects a malformed uuid shape via zod (no crash, an isError result)', async () => {
      const missing = await callTool(client, 'parse', {});
      expect(missing.isError).toBe(true);
      expect(missing.text.length).toBeGreaterThan(0);

      const wrongShape = await callTool(client, 'parse', { uuid: 'not-a-uuid' });
      expect(wrongShape.isError).toBe(true);
      expect(wrongShape.text).not.toContain('\n');
      expect(wrongShape.text).toMatch(/at uuid/);

      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });
  });

  describe('the validate tool (feat-19 REQ-004, ACC-001/ACC-002, adapter leg)', () => {
    it('validates the imported flawed fixture: the five pinned findings, status the count (ACC-001)', async () => {
      const source = copyFixture(FLAWED_FIXTURE, 'flawed.bpmn');
      const imported = await importSuccess(client, source);

      const validated = await validateSuccess(client, imported.uuid);

      expect(validated.uuid).toBe(imported.uuid);
      expect(validated.status).toBe(5);
      expect(validated.findings).toEqual(FLAWED_EXPECTED);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
    });

    it('validates the imported clean reference: no-findings, an empty findings list (ACC-002)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);

      const validated = await validateSuccess(client, imported.uuid);

      expect(validated.uuid).toBe(imported.uuid);
      expect(validated.status).toBe('no-findings');
      expect(validated.findings).toEqual([]);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
    });

    it('validates a session draft (created, not exported) from the in-memory tree: no note (REQ-004)', async () => {
      const created = await createSuccess(client, { name: 'Validate Draft' });

      const validated = await validateSuccess(client, created.uuid);

      // The empty process (a create without elements) reports exactly
      // the two required-event findings on the process id.
      expect(validated.uuid).toBe(created.uuid);
      expect(validated.status).toBe(2);
      expect(validated.findings).toEqual([
        { rule: 'end-event-required', elementId: 'validate-draft', message: 'Process is missing end event' },
        { rule: 'start-event-required', elementId: 'validate-draft', message: 'Process is missing start event' },
      ]);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
      // The draft is in memory only: no file, no prc directory.
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('validates a sound seeded draft (elements + connects) from memory: no-findings (REQ-004, Phase 110 $parent backfill)', async () => {
      const created = await createSuccess(client, {
        name: 'Sound Draft',
        elements: [
          { type: 'start-event', name: 'Begin' },
          { type: 'task', name: 'Work' },
          { type: 'end-event', name: 'Done' },
        ],
      });
      await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
      });
      await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'task_1',
        targetId: 'endEvent_1',
      });

      const validated = await validateSuccess(client, created.uuid);

      // The built (in-memory) tree is sound: no findings of any kind,
      // in particular no crash-derived findings from the connectivity
      // rules (the pre-backfill defect this leg pins).
      expect(validated.status).toBe('no-findings');
      expect(validated.findings).toEqual([]);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
      expect(existsSync(resolveDocsPrcDir())).toBe(false);
    });

    it('validates a promoted seeded draft (export within the session): no-findings (REQ-004, Phase 110 $parent backfill)', async () => {
      const created = await createSuccess(client, {
        name: 'Promoted Draft',
        elements: [
          { type: 'start-event', name: 'Begin' },
          { type: 'task', name: 'Work' },
          { type: 'end-event', name: 'Done' },
        ],
      });
      await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
      });
      await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'task_1',
        targetId: 'endEvent_1',
      });
      const exported = await callTool(client, 'export', { uuid: created.uuid });
      expect(exported.isError).toBe(false);

      const validated = await validateSuccess(client, created.uuid);

      // The promotion caches the in-memory built tree (no re-parse),
      // so this leg pins the backfill on the promoted path as well.
      expect(validated.status).toBe('no-findings');
      expect(validated.findings).toEqual([]);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
    });

    it('notes the out-of-band re-read when the registered file changed (REQ-004)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      writeFileSync(
        imported.path,
        readFileSync(imported.path, 'utf8').replace('name="Review order"', 'name="Second look"'),
      );

      const validated = await validateSuccess(client, imported.uuid);

      expect(validated.outOfBandReRead).toBe(true);
      expect(validated.note).toMatch(/out of band/);
      expect(validated.note).not.toContain('\n');
      // The re-read state is lint-clean again (the rename changes no findings).
      expect(validated.status).toBe('no-findings');
      expect(validated.findings).toEqual([]);
    });

    it('maps an unknown uuid to a single-line isError result (REQ-004)', async () => {
      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';

      const outcome = await callTool(client, 'validate', { uuid: unknown });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`process ${unknown} is not registered`);
      expect(outcome.text).not.toContain('\n');
    });

    it('maps a deleted own file (path missing) to a single-line isError result (REQ-004)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      rmSync(imported.path);

      const outcome = await callTool(client, 'validate', { uuid: imported.uuid });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toBe(`${imported.path} does not exist`);
      expect(outcome.text).not.toContain('\n');
    });

    it('maps a corrupted own file (unparseable) to a single-line isError result (REQ-004)', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'src.bpmn');
      const imported = await importSuccess(client, source);
      writeFileSync(imported.path, 'this is not BPMN');

      const outcome = await callTool(client, 'validate', { uuid: imported.uuid });

      expect(outcome.isError).toBe(true);
      expect(outcome.text).toMatch(/^failed to parse BPMN 2\.0 XML: /);
      expect(outcome.text).not.toContain('\n');
    });

    it('rejects a malformed uuid shape via zod (no crash, an isError result)', async () => {
      const missing = await callTool(client, 'validate', {});
      expect(missing.isError).toBe(true);
      expect(missing.text.length).toBeGreaterThan(0);

      const wrongShape = await callTool(client, 'validate', { uuid: 'not-a-uuid' });
      expect(wrongShape.isError).toBe(true);
      expect(wrongShape.text).not.toContain('\n');
      expect(wrongShape.text).toMatch(/at uuid/);
    });
  });

  describe('the validate config legs (feat-19 ACC-004/ACC-005, injected lint root)', () => {
    // These legs point the server's lint config load at a temporary
    // package root (the createServer injectable, Task 110.120) so the
    // committed .bpmnlintrc is never touched or left modified.

    /** Connects a second in-memory server pair over the injected lint root. */
    const connectInjected = async (lintRoot: string): Promise<Client> => {
      const injectedStore = new PrcStore(resolveDocsPrcDir(), logger);
      const injectedServer = createServer(loggingConfig, injectedStore, lintRoot);
      const [injectedClientTransport, injectedServerTransport] = InMemoryTransport.createLinkedPair();
      const injectedClient = new Client({ name: 'test-client', version: '0.0.0' });
      await Promise.all([
        injectedServer.connect(injectedServerTransport),
        injectedClient.connect(injectedClientTransport),
      ]);
      return injectedClient;
    };

    it('a rules override in the config drops the corresponding finding (ACC-004)', async () => {
      const lintRoot = join(tempDir, 'lint-override');
      mkdirSync(lintRoot);
      writeFileSync(
        join(lintRoot, '.bpmnlintrc'),
        JSON.stringify({ extends: 'bpmnlint:recommended', rules: { 'no-disconnected': 'off' } }),
      );
      const injected = await connectInjected(lintRoot);

      try {
        const source = copyFixture(FLAWED_FIXTURE, 'flawed-override.bpmn');
        const imported = await importSuccess(injected, source);
        const validated = await validateSuccess(injected, imported.uuid);

        // The overridden rule (no-disconnected) no longer reports; the
        // other four findings stay -- the config drives validation.
        expect(validated.status).toBe(4);
        expect(validated.findings).toEqual(FLAWED_EXPECTED.filter((finding) => finding.rule !== 'no-disconnected'));
        // The resource still reports the extended preset.
        expect(await readBpmnlintConfigMember(injected)).toEqual({ preset: 'bpmnlint:recommended' });
      } finally {
        await injected.close();
      }
    });

    it('a missing config is a structured failure in validate and in the config resource (ACC-005)', async () => {
      const lintRoot = join(tempDir, 'lint-missing');
      mkdirSync(lintRoot);
      const injected = await connectInjected(lintRoot);

      try {
        // The resource surfaces the core's structured failure instead
        // of a preset...
        expect(await readBpmnlintConfigMember(injected)).toEqual({
          error: { code: 'config-missing', message: `bpmnlint config not found at ${join(lintRoot, '.bpmnlintrc')}` },
        });

        // ...and validate returns the same single-line message.
        const source = copyFixture(ORDER_FIXTURE, 'clean-missing-config.bpmn');
        const imported = await importSuccess(injected, source);
        const outcome = await callTool(injected, 'validate', { uuid: imported.uuid });
        expect(outcome.isError).toBe(true);
        expect(outcome.text).toBe(`bpmnlint config not found at ${join(lintRoot, '.bpmnlintrc')}`);
        expect(outcome.text).not.toContain('\n');
      } finally {
        await injected.close();
      }
    });

    it('an invalid config is a structured failure in validate and in the config resource (ACC-005)', async () => {
      const lintRoot = join(tempDir, 'lint-invalid');
      mkdirSync(lintRoot);
      writeFileSync(join(lintRoot, '.bpmnlintrc'), '{ not json');
      const injected = await connectInjected(lintRoot);

      try {
        // The resource surfaces the core's structured failure instead
        // of a preset...
        const member = await readBpmnlintConfigMember(injected);
        expect(member.error?.code).toBe('config-invalid');
        expect(member.error?.message).toContain(join(lintRoot, '.bpmnlintrc'));
        expect(member.error?.message).not.toContain('\n');

        // ...and validate returns the very same single-line message.
        const source = copyFixture(ORDER_FIXTURE, 'clean-invalid-config.bpmn');
        const imported = await importSuccess(injected, source);
        const outcome = await callTool(injected, 'validate', { uuid: imported.uuid });
        expect(outcome.isError).toBe(true);
        expect(outcome.text).toBe(member.error?.message);
        expect(outcome.text).not.toContain('\n');
      } finally {
        await injected.close();
      }
    });

    it('an array extends reports the comma-joined preset in the config resource (Phase 130 I1)', async () => {
      const lintRoot = join(tempDir, 'lint-array-extends');
      mkdirSync(lintRoot);
      writeFileSync(join(lintRoot, '.bpmnlintrc'), JSON.stringify({ extends: ['a', 'b'] }));
      const injected = await connectInjected(lintRoot);

      try {
        // The resource joins the array preset with ", " (the
        // bpmnlintResourceInfo array branch).
        expect(await readBpmnlintConfigMember(injected)).toEqual({ preset: 'a, b' });
      } finally {
        await injected.close();
      }
    });

    it('a config without any extends reports the none sentinel in the config resource (Phase 130 I1)', async () => {
      const lintRoot = join(tempDir, 'lint-no-extends');
      mkdirSync(lintRoot);
      writeFileSync(join(lintRoot, '.bpmnlintrc'), '{}');
      const injected = await connectInjected(lintRoot);

      try {
        // The resource reports the `none` sentinel (the otel member's
        // `disabled` convention) when the config extends no preset.
        expect(await readBpmnlintConfigMember(injected)).toEqual({ preset: 'none' });
      } finally {
        await injected.close();
      }
    });
  });

  describe('the 1.0070 round-trip (ACC-007, in-process leg)', () => {
    it('import + export preserves the full element/flow inventory', async () => {
      const source = copyFixture(ORDER_FIXTURE, 'my-diagram.bpmn');
      const sourceXml = readFileSync(source);
      const imported = await importSuccess(client, source);
      const exportPath = join(tempDir, 'roundtrip.bpmn');

      const outcome = await callTool(client, 'export', { uuid: imported.uuid, path: exportPath });

      expect(outcome.isError).toBe(false);
      const sourceTree = (await parseBpmn(sourceXml)).rootElement;
      const exportTree = (await parseBpmn(readFileSync(exportPath))).rootElement;

      // The production inventories stand in for the former test-local
      // walk, which was duplicated here because the production
      // `collectElementInventory` carried only id/type and was not
      // extended for the test's sake (feat-2's plan, Progress
      // 2026-11-01, Decisions Made (4)); the sibling-function decision
      // (this plan's Progress 2026-11-08, Decisions Made (1), and its
      // Phase 100) supplies the richer addressable walk instead.
      const sourceAddressable = collectAddressableInventory(sourceTree);
      const exportAddressable = collectAddressableInventory(exportTree);
      expect(sourceAddressable.elements.length).toBeGreaterThan(0);
      expect(sourceAddressable.flows.length).toBeGreaterThan(0);
      expect(exportAddressable.elements).toEqual(sourceAddressable.elements);
      expect(exportAddressable.flows).toEqual(sourceAddressable.flows);

      // The full id-set invariance, BPMNDI included (the addressable
      // inventory excludes the container and diagram interchange
      // information on purpose, so the two production walks cover
      // strictly different slices).
      const sourceFull = collectElementInventory(sourceTree);
      const exportFull = collectElementInventory(exportTree);
      expect(exportFull).toEqual(sourceFull);
      expect(sourceFull.length).toBeGreaterThan(sourceAddressable.elements.length);

      // Pin the reference shape: every flow carries its resolved
      // source and target (the walk's reference handling works).
      expect(sourceAddressable.flows).toEqual([
        { id: 'flow-1', kind: 'sequence', source: 'start-event', target: 'review-task' },
        { id: 'flow-2', kind: 'sequence', source: 'review-task', target: 'end-event' },
      ]);
    });
  });
});
