// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer as createNetServer } from 'node:net';
import type { Server } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ModdleElement } from 'moddle';
import { getPlane, rectanglesOverlap } from '../src/prc/layout.js';
import { isModdleElement, parseBpmn } from '../src/prc/moddle.js';
import { DEFAULT_PORT, PREVIEW_HOST } from '../src/preview/preview-server.js';

/**
 * Spawn-based tests against the real, built artifact
 * (`node dist/index.js`) -- automating as much of feat-1's
 * ACC-006/007/008 as practical without a manual run, per Task
 * 110.140, of feat-2's ACC-006/ACC-008, and of feat-17's
 * ACC-001/ACC-002/ACC-003/ACC-004/ACC-005: a clean start is
 * implicitly exercised by every test below (none of them create a
 * `.env` or override `logging.json`), but a dedicated assertion of
 * "no .env, no logging.json" is better checked by hand against a
 * truly pristine clone (see the plan's Progress -> Updates entry for
 * this phase).
 *
 * The tool tests set `BPMN_MCP_DOCS_DIR` to a temporary directory, so
 * the spawned server's `prc` directory (and the files `import`
 * copies into it) live under the temporary `cwd` and never touch the
 * repository tree. The exported files are re-parsed here through the
 * core's parse helper (the tests are not bound by the core's
 * archunit rules) to assert on the serialized XML.
 */

const DIST_ENTRY = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/index.js');

// Resolve the fixture directory independent of the test runner's
// working directory (test/ -> fixtures/).
const FIXTURES_DIR = resolve(fileURLToPath(new URL('./fixtures/', import.meta.url)));
const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');
const FLAWED_FIXTURE = join(FIXTURES_DIR, 'flawed-process.bpmn');

const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * The pinned findings of the flawed fixture under the committed
 * config (feat-19 Task 100.100 spike): deterministic order, by rule,
 * then element id.
 */
const FLAWED_EXPECTED = [
  { rule: 'end-event-required', elementId: 'flawed-process', message: 'Process is missing end event' },
  { rule: 'no-disconnected', elementId: 'orphan-task', message: 'Element is not connected' },
  { rule: 'no-implicit-end', elementId: 'orphan-task', message: 'Element is an implicit end' },
  { rule: 'no-implicit-end', elementId: 'review', message: 'Element is an implicit end' },
  { rule: 'no-implicit-start', elementId: 'orphan-task', message: 'Element is an implicit start' },
];

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

/** The `preview` tool result's success JSON (feat-20 REQ-004, ACC-007). */
interface PreviewSuccessPayload {
  url: string;
  port: number;
  opened: boolean;
  reason?: string;
}

/** The structured port-in-use message the preview server reports (REQ-001; one wording, all consumers). */
const PORT_IN_USE_TEXT = `port ${DEFAULT_PORT} on ${PREVIEW_HOST} is already in use; the preview server did not start`;

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

/** The `create` tool result's success JSON (feat-17 REQ-001). */
interface CreateSuccessPayload {
  uuid: string;
  name: string;
  processId: string;
  slug: string;
  elementCount: number;
}

/** Calls `import` over stdio and narrows the success JSON. */
async function importSuccess(client: Client, path: string): Promise<ImportSuccessPayload> {
  const outcome = await callTool(client, 'import', { path });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ImportSuccessPayload;
}

/** Calls `create` over stdio and narrows the success JSON (the test expects success). */
async function createSuccess(
  client: Client,
  args: { name: string; elements?: Record<string, unknown>[] },
): Promise<CreateSuccessPayload> {
  const outcome = await callTool(client, 'create', args);
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as CreateSuccessPayload;
}

/** Calls `change` over stdio and narrows the success JSON (the test expects success). */
async function changeSuccess(client: Client, args: Record<string, unknown>): Promise<Record<string, unknown>> {
  const outcome = await callTool(client, 'change', args);
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as Record<string, unknown>;
}

/** Calls `parse` over stdio and narrows the success JSON (the test expects success). */
async function parseSuccess(client: Client, uuid: string): Promise<ParseSuccessPayload> {
  const outcome = await callTool(client, 'parse', { uuid });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ParseSuccessPayload;
}

/** Calls `validate` over stdio and narrows the success JSON (the test expects success). */
async function validateSuccess(client: Client, uuid: string): Promise<ValidateSuccessPayload> {
  const outcome = await callTool(client, 'validate', { uuid });
  expect(outcome.isError).toBe(false);
  return JSON.parse(outcome.text) as ValidateSuccessPayload;
}

/** The id of an element reference, whether resolved (an element) or raw (a string). */
function referenceId(reference: unknown): string | undefined {
  if (typeof reference === 'string' && reference.length > 0) {
    return reference;
  }
  if (isModdleElement(reference) && typeof reference.id === 'string' && reference.id.length > 0) {
    return reference.id;
  }
  return undefined;
}

/** One DI shape's bounds (the XML attribute values). */
interface ShapeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** One model element of an exported document: the type, the name, the flow's endpoints. */
interface ModelElement {
  type: string;
  name?: string;
  sourceId?: string;
  targetId?: string;
}

/**
 * The document's `BPMNShape` bounds keyed by the model element id
 * (test-local walk over the parsed exported XML).
 *
 * @param xml - The BPMN 2.0 XML to parse.
 */
async function shapeBoundsById(xml: string): Promise<Map<string, ShapeBounds>> {
  const root = (await parseBpmn(xml)).rootElement;
  const result = new Map<string, ShapeBounds>();
  const planeElement = getPlane(root)?.planeElement;
  if (!Array.isArray(planeElement)) {
    return result;
  }
  for (const di of planeElement) {
    if (!isModdleElement(di) || di.$type !== 'bpmndi:BPMNShape') {
      continue;
    }
    const model = di.bpmnElement;
    const bounds = di.bounds;
    if (!isModdleElement(model) || !isModdleElement(bounds)) {
      continue;
    }
    const id = referenceId(model);
    if (id !== undefined) {
      result.set(id, { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height });
    }
  }
  return result;
}

/**
 * Records one flow element of the process in the map (test-local
 * walk helper): the type, the name, and -- for a sequence flow -- the
 * resolved source and target ids.
 *
 * @param flowElement - The visited flow element (carries a string `id`).
 * @param result - The map being built (mutated).
 */
function recordFlowElement(flowElement: ModdleElement, result: Map<string, ModelElement>): void {
  const record: ModelElement = { type: flowElement.$type };
  if (typeof flowElement.name === 'string') {
    record.name = flowElement.name;
  }
  if (flowElement.$type === 'bpmn:SequenceFlow') {
    const sourceId = referenceId(flowElement.sourceRef);
    const targetId = referenceId(flowElement.targetRef);
    if (sourceId !== undefined) {
      record.sourceId = sourceId;
    }
    if (targetId !== undefined) {
      record.targetId = targetId;
    }
  }
  result.set(flowElement.id, record);
}

/**
 * The document's process flow elements keyed by id (test-local walk
 * over the parsed exported XML).
 *
 * @param xml - The BPMN 2.0 XML to parse.
 */
async function flowElementsById(xml: string): Promise<Map<string, ModelElement>> {
  const root = (await parseBpmn(xml)).rootElement;
  const result = new Map<string, ModelElement>();
  const rootElements = root.rootElements;
  if (!Array.isArray(rootElements)) {
    return result;
  }
  for (const element of rootElements) {
    if (!isModdleElement(element) || element.$type !== 'bpmn:Process') {
      continue;
    }
    const flowElements = element.flowElements;
    if (!Array.isArray(flowElements)) {
      continue;
    }
    for (const flowElement of flowElements) {
      if (isModdleElement(flowElement) && typeof flowElement.id === 'string') {
        recordFlowElement(flowElement, result);
      }
    }
  }
  return result;
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

  it('lists exactly the seven tools over real stdio: change, create, export, import, parse, preview, validate (feat-20 ACC-004)', async () => {
    // The handshake lists preview (feat-20) in addition to the six
    // store tools.
    const docsDir = join(tempCwd, 'docs');
    ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
    await client.connect(transport);

    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      'change',
      'create',
      'export',
      'import',
      'parse',
      'preview',
      'validate',
    ]);
  });

  describe('the import/export tools (feat-2, ACC-006/ACC-008, stdio leg)', () => {
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

  describe('the create/change tools (feat-17, ACC-001..ACC-003, ACC-005, stdio leg)', () => {
    it('ACC-001: create (empty), add two elements, connect, export -- re-parses, element set, grid DI', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, { name: 'Round Trip' });
      expect(created.uuid).toMatch(UUID_V4_SHAPE);
      expect(created.name).toBe('Round Trip');
      expect(created.processId).toBe('round-trip');
      expect(created.slug).toBe('round-trip');
      expect(created.elementCount).toBe(0);

      // Draft changes are in memory only (no file yet).
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'start-event' });
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'task', name: 'Work' });
      await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
      });
      expect(existsSync(join(docsDir, 'prc'))).toBe(false);

      // The export promotes the draft to its own prc path.
      const exported = await callTool(client, 'export', { uuid: created.uuid });
      expect(exported.isError).toBe(false);
      const exportParsed = JSON.parse(exported.text) as ExportSuccessPayload;
      const ownPath = join(docsDir, 'prc', `prc-${created.uuid}-round-trip.bpmn`);
      expect(exportParsed.path).toBe(ownPath);
      expect(existsSync(ownPath)).toBe(true);

      // The exported file re-parses and carries the requested element set.
      const xml = readFileSync(ownPath, 'utf8');
      const elements = await flowElementsById(xml);
      expect(elements.size).toBe(3);
      expect(elements.get('startEvent_1')).toEqual({ type: 'bpmn:StartEvent' });
      expect(elements.get('task_1')).toEqual({ type: 'bpmn:Task', name: 'Work' });
      expect(elements.get('sequenceFlow_1')).toEqual({
        type: 'bpmn:SequenceFlow',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
      });

      // The new elements carry non-overlapping grid DI.
      const shapes = await shapeBoundsById(xml);
      expect(shapes.size).toBe(2);
      const bounds = [...shapes.values()];
      for (const shape of bounds) {
        expect(shape.x % 80).toBe(0);
        expect(shape.y % 80).toBe(0);
      }
      for (let i = 0; i < bounds.length; i += 1) {
        for (let j = i + 1; j < bounds.length; j += 1) {
          expect(rectanglesOverlap(bounds[i], bounds[j]), `shape ${i} vs ${j}`).toBe(false);
        }
      }
    });

    it('ACC-002: update renames, delete removes the element and its flows, connect attaches the condition', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, { name: 'ACC Two' });
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'start-event' });
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'task', name: 'First' });
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'task', name: 'Second' });
      const connected = await changeSuccess(client, {
        uuid: created.uuid,
        action: 'connect',
        sourceId: 'startEvent_1',
        targetId: 'task_1',
        conditionExpression: 'approved == true',
      });
      expect(connected).toMatchObject({ flowId: 'sequenceFlow_1', conditionSet: true, persisted: false });
      await changeSuccess(client, { uuid: created.uuid, action: 'connect', sourceId: 'task_1', targetId: 'task_2' });
      await changeSuccess(client, { uuid: created.uuid, action: 'update-element', id: 'task_1', name: 'Renamed' });

      // The export promotes the draft; from then on the changes are write-through.
      const exported = await callTool(client, 'export', { uuid: created.uuid });
      expect(exported.isError).toBe(false);
      const ownPath = (JSON.parse(exported.text) as ExportSuccessPayload).path;
      expect(ownPath).toBe(join(docsDir, 'prc', `prc-${created.uuid}-acc-two.bpmn`));

      // The serialized XML carries the rename and the condition expression.
      let xml = readFileSync(ownPath, 'utf8');
      expect(xml).toMatch(/<bpmn:task id="task_1" name="Renamed" \/>/);
      expect(xml).toMatch(/<bpmn:conditionExpression[^>]*>approved == true<\/bpmn:conditionExpression>/);
      expect(xml).toContain('id="sequenceFlow_1"');
      expect(xml).toContain('id="sequenceFlow_2"');

      // Delete the middle task: the node, both connected flows, and their DI go with it.
      const deleted = await changeSuccess(client, { uuid: created.uuid, action: 'delete-element', id: 'task_1' });
      expect(deleted).toMatchObject({ kind: 'element', removedFlows: 2, persisted: true });
      xml = readFileSync(ownPath, 'utf8');
      expect(xml).not.toContain('id="task_1"');
      expect(xml).not.toContain('id="sequenceFlow_1"');
      expect(xml).not.toContain('id="sequenceFlow_2"');
      expect(xml).toContain('id="task_2"');
      expect(xml).toContain('id="startEvent_1"');
    });

    it('ACC-003: omitted coordinates are grid-placed at the standard sizes; explicit ones are unchanged', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, {
        name: 'ACC Three',
        elements: [
          { type: 'task', name: 'Placed', x: 120, y: 240 },
          { type: 'start-event' },
          { type: 'exclusive-gateway' },
        ],
      });
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'task', x: 400, y: 400 });
      await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'end-event' });

      const exported = await callTool(client, 'export', { uuid: created.uuid });
      expect(exported.isError).toBe(false);
      const ownPath = (JSON.parse(exported.text) as ExportSuccessPayload).path;
      const shapes = await shapeBoundsById(readFileSync(ownPath, 'utf8'));

      // Explicit coordinates appear unchanged (create and change alike).
      expect(shapes.get('task_1')).toEqual({ x: 120, y: 240, width: 100, height: 80 });
      expect(shapes.get('task_2')).toEqual({ x: 400, y: 400, width: 100, height: 80 });
      // Omitted coordinates are grid-placed at the standard sizes (first free slot).
      expect(shapes.get('startEvent_1')).toEqual({ x: 80, y: 80, width: 36, height: 36 });
      expect(shapes.get('exclusiveGateway_1')).toEqual({ x: 160, y: 80, width: 50, height: 50 });
      expect(shapes.get('endEvent_1')).toEqual({ x: 240, y: 80, width: 36, height: 36 });

      // The shapes never overlap.
      const bounds = [...shapes.values()];
      for (let i = 0; i < bounds.length; i += 1) {
        for (let j = i + 1; j < bounds.length; j += 1) {
          expect(rectanglesOverlap(bounds[i], bounds[j]), `shape ${i} vs ${j}`).toBe(false);
        }
      }
    });

    it('ACC-005: every REQ-007 error leg is a single-line isError; the server and the draft stay usable', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      // A blank create name is the core's structured error over the wire.
      const blankCreate = await callTool(client, 'create', { name: '   ' });
      expect(blankCreate.isError).toBe(true);
      expect(blankCreate.text).toBe('the process name must be a non-blank string');
      expect(blankCreate.text).not.toContain('\n');

      const created = await createSuccess(client, {
        name: 'Error Legs',
        elements: [{ type: 'start-event' }, { type: 'task' }],
      });
      const uuid = created.uuid;
      const unknownUuid = 'ffffffff-ffff-4fff-afff-ffffffffffff';

      const legs: { args: Record<string, unknown>; expect: string | RegExp }[] = [
        // unknown uuid (the random uuid exists in no directory state).
        {
          args: { uuid: unknownUuid, action: 'delete-element', id: 'task_1' },
          expect: `process ${unknownUuid} is not registered`,
        },
        // unknown action (zod rejects it at the MCP layer).
        { args: { uuid, action: 'teleport' }, expect: /at action/ },
        // unknown element type (zod rejects it at the MCP layer).
        { args: { uuid, action: 'add-element', type: 'warp-gate' }, expect: /at type/ },
        // connect to a missing source / target element (core).
        {
          args: { uuid, action: 'connect', sourceId: 'ghost', targetId: 'task_1' },
          expect: 'the source element "ghost" does not exist in the process',
        },
        {
          args: { uuid, action: 'connect', sourceId: 'startEvent_1', targetId: 'ghost' },
          expect: 'the target element "ghost" does not exist in the process',
        },
        // delete of a missing element (core).
        { args: { uuid, action: 'delete-element', id: 'ghost' }, expect: 'no element with id "ghost" in the process' },
        // duplicate element id (a caller-supplied id the draft already carries; core).
        {
          args: { uuid, action: 'add-element', type: 'task', id: 'startEvent_1' },
          expect: 'element id "startEvent_1" already exists in the process',
        },
        // invalid coordinates (zod rejects the negative value client-side).
        { args: { uuid, action: 'add-element', type: 'task', x: -5, y: 10 }, expect: /at x/ },
        // unsupported property (isInterrupting on a task; core).
        {
          args: { uuid, action: 'update-element', id: 'task_1', isInterrupting: false },
          expect: /isInterrupting is only supported on start events/,
        },
        // missing per-action field (the operation shape parse in the handler).
        { args: { uuid, action: 'connect', sourceId: 'startEvent_1' }, expect: /targetId/ },
      ];
      for (const { args, expect: expected } of legs) {
        const outcome = await callTool(client, 'change', args);
        expect(outcome.isError, JSON.stringify(args)).toBe(true);
        expect(outcome.text, JSON.stringify(args)).not.toContain('\n');
        if (typeof expected === 'string') {
          expect(outcome.text, JSON.stringify(args)).toBe(expected);
        } else {
          expect(outcome.text, JSON.stringify(args)).toMatch(expected);
        }
      }

      // The draft state survived every failure: a successful change works...
      const added = await changeSuccess(client, { uuid, action: 'add-element', type: 'end-event' });
      expect(added).toMatchObject({ id: 'endEvent_1', persisted: false });
      // ...the process exports (draft promotion)...
      const exported = await callTool(client, 'export', { uuid });
      expect(exported.isError).toBe(false);
      const ownPath = (JSON.parse(exported.text) as ExportSuccessPayload).path;
      // ...and changes keep working write-through on the registered file.
      const updated = await changeSuccess(client, {
        uuid,
        action: 'update-element',
        id: 'endEvent_1',
        name: 'The end',
      });
      expect(updated).toMatchObject({ persisted: true });
      expect(readFileSync(ownPath, 'utf8')).toContain('name="The end"');
    });

    it('ACC-005 (E1): a control-character uuid is a single-line isError; the server stays usable', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, { name: 'E1 Probe' });

      const newlineUuid = await callTool(client, 'change', {
        uuid: 'a\nb',
        action: 'delete-element',
        id: 'task_1',
      });
      expect(newlineUuid.isError).toBe(true);
      expect(newlineUuid.text).not.toContain('\n');
      expect(newlineUuid.text).toMatch(/at uuid/);

      // The server stays usable after the rejected input.
      const added = await changeSuccess(client, { uuid: created.uuid, action: 'add-element', type: 'task' });
      expect(added).toMatchObject({ id: 'task_1', persisted: false });
    });
  });

  describe('the parse tool (feat-18, ACC-001..ACC-003, REQ-003, stdio leg)', () => {
    it('ACC-001: imports the fixture, parse returns the hardcoded element/flow literals', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);

      const parsed = await parseSuccess(client, imported.uuid);

      expect(parsed.uuid).toBe(imported.uuid);
      expect(parsed.outOfBandReRead).toBe(false);
      expect(parsed.note).toBeUndefined();
      expect(parsed.elements).toEqual([
        { id: 'end-event', name: 'Order done', type: 'bpmn:EndEvent' },
        { id: 'flow-1', type: 'bpmn:SequenceFlow' },
        { id: 'flow-2', type: 'bpmn:SequenceFlow' },
        { id: 'start-event', name: 'Order received', type: 'bpmn:StartEvent' },
        { id: 'review-task', name: 'Review order', type: 'bpmn:Task' },
      ]);
      expect(parsed.flows).toEqual([
        { id: 'flow-1', kind: 'sequence', source: 'start-event', target: 'review-task' },
        { id: 'flow-2', kind: 'sequence', source: 'review-task', target: 'end-event' },
      ]);
    });

    it('ACC-002: an out-of-band edit between two parses is re-read, noted, and served', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);
      const first = await parseSuccess(client, imported.uuid);
      expect(first.outOfBandReRead).toBe(false);
      expect(first.note).toBeUndefined();

      // Edit the registered own file out of band (the test process is
      // "another instance" for the spawned server).
      writeFileSync(
        imported.path,
        readFileSync(imported.path, 'utf8').replace('name="Order received"', 'name="Out of band"'),
      );

      const second = await parseSuccess(client, imported.uuid);

      expect(second.outOfBandReRead).toBe(true);
      expect(second.note).toMatch(/out of band/);
      expect(second.note).not.toContain('\n');
      // The second result reflects the new state.
      expect(second.elements).toContainEqual({ id: 'start-event', name: 'Out of band', type: 'bpmn:StartEvent' });
      expect(second.elements).not.toContainEqual({
        id: 'start-event',
        name: 'Order received',
        type: 'bpmn:StartEvent',
      });
    });

    it('REQ-003: parsing a draft (created, not exported) serves the in-memory tree, no file, no note', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, {
        name: 'Parse Draft',
        elements: [{ type: 'start-event' }, { type: 'task', name: 'Work' }],
      });

      const parsed = await parseSuccess(client, created.uuid);

      expect(parsed.uuid).toBe(created.uuid);
      expect(parsed.outOfBandReRead).toBe(false);
      expect(parsed.note).toBeUndefined();
      expect(parsed.elements).toEqual([
        { id: 'startEvent_1', type: 'bpmn:StartEvent' },
        { id: 'task_1', name: 'Work', type: 'bpmn:Task' },
      ]);
      expect(parsed.flows).toEqual([]);
      // The draft is in memory only: the prc file does not exist.
      expect(existsSync(join(docsDir, 'prc'))).toBe(false);
    });

    it('ACC-003: an unknown uuid is a single-line isError; the server stays usable', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';
      const unknownParse = await callTool(client, 'parse', { uuid: unknown });
      expect(unknownParse.isError).toBe(true);
      expect(unknownParse.text).toBe(`process ${unknown} is not registered`);
      expect(unknownParse.text).not.toContain('\n');

      // The server stays usable: a subsequent valid call succeeds.
      const imported = await importSuccess(client, ORDER_FIXTURE);
      const parsed = await parseSuccess(client, imported.uuid);
      expect(parsed.uuid).toBe(imported.uuid);
      expect(parsed.outOfBandReRead).toBe(false);
    });

    it('ACC-003: a corrupted own file is a single-line isError; the registration and the server stay usable', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);
      const fixtureBytes = readFileSync(ORDER_FIXTURE);

      // Corrupt the own prc file out of band.
      writeFileSync(imported.path, 'this is not BPMN');
      const corrupted = await callTool(client, 'parse', { uuid: imported.uuid });
      expect(corrupted.isError).toBe(true);
      expect(corrupted.text).toMatch(/^failed to parse BPMN 2\.0 XML: /);
      expect(corrupted.text).not.toContain('\n');

      // The registration survived the failed re-read: restoring the
      // bytes is a cache hit and the server stays usable.
      writeFileSync(imported.path, fixtureBytes);
      const restored = await parseSuccess(client, imported.uuid);
      expect(restored.outOfBandReRead).toBe(false);
      expect(restored.note).toBeUndefined();
    });
  });

  describe('the validate tool (feat-19, ACC-001/ACC-002/ACC-005, REQ-004, stdio leg)', () => {
    it('ACC-001: imports the flawed fixture, validate reports the five pinned findings, status the count', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, FLAWED_FIXTURE);

      const validated = await validateSuccess(client, imported.uuid);

      expect(validated.uuid).toBe(imported.uuid);
      expect(validated.status).toBe(5);
      expect(validated.findings).toEqual(FLAWED_EXPECTED);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
    });

    it('ACC-002: validates the clean reference no-findings; the config resource reports the preset', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);

      const validated = await validateSuccess(client, imported.uuid);
      expect(validated.status).toBe('no-findings');
      expect(validated.findings).toEqual([]);
      expect(validated.outOfBandReRead).toBe(false);

      // The config resource reports the resolved preset of the
      // committed .bpmnlintrc, not the former placeholder.
      const { contents } = await client.readResource({ uri: 'bpmnmcp://config' });
      const [content] = contents;
      if (!('text' in content)) {
        throw new Error('expected a text resource content');
      }
      const config = JSON.parse(content.text) as {
        bpmnlint: { preset?: string; error?: { code: string; message: string } };
      };
      expect(config.bpmnlint).toEqual({ preset: 'bpmnlint:recommended' });
    });

    it('REQ-004: validating a draft (created, not exported) serves the in-memory tree, no note', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, { name: 'Spawn Draft' });

      const validated = await validateSuccess(client, created.uuid);

      // The empty process (a create without elements) reports exactly
      // the two required-event findings on the process id.
      expect(validated.uuid).toBe(created.uuid);
      expect(validated.status).toBe(2);
      expect(validated.findings).toEqual([
        { rule: 'end-event-required', elementId: 'spawn-draft', message: 'Process is missing end event' },
        { rule: 'start-event-required', elementId: 'spawn-draft', message: 'Process is missing start event' },
      ]);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
      // The draft is in memory only: the prc file does not exist.
      expect(existsSync(join(docsDir, 'prc'))).toBe(false);
    });

    it('REQ-004: validating a sound seeded draft (created, changed, not exported) reports no-findings', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const created = await createSuccess(client, {
        name: 'Sound Spawn Draft',
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

      expect(validated.status).toBe('no-findings');
      expect(validated.findings).toEqual([]);
      expect(validated.outOfBandReRead).toBe(false);
      expect(validated.note).toBeUndefined();
      // The draft is in memory only: the prc file does not exist.
      expect(existsSync(join(docsDir, 'prc'))).toBe(false);
    });

    it('ACC-005: an unknown uuid is a single-line isError; the server stays usable', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const unknown = 'ffffffff-ffff-4fff-afff-ffffffffffff';
      const unknownValidate = await callTool(client, 'validate', { uuid: unknown });
      expect(unknownValidate.isError).toBe(true);
      expect(unknownValidate.text).toBe(`process ${unknown} is not registered`);
      expect(unknownValidate.text).not.toContain('\n');

      // The server stays usable: a subsequent valid call succeeds.
      const imported = await importSuccess(client, ORDER_FIXTURE);
      const validated = await validateSuccess(client, imported.uuid);
      expect(validated.uuid).toBe(imported.uuid);
      expect(validated.status).toBe('no-findings');
    });

    it('ACC-005: a corrupted own file is a single-line isError; the registration and the server stay usable', async () => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);
      const fixtureBytes = readFileSync(ORDER_FIXTURE);

      // Corrupt the own prc file out of band.
      writeFileSync(imported.path, 'this is not BPMN');
      const corrupted = await callTool(client, 'validate', { uuid: imported.uuid });
      expect(corrupted.isError).toBe(true);
      expect(corrupted.text).toMatch(/^failed to parse BPMN 2\.0 XML: /);
      expect(corrupted.text).not.toContain('\n');

      // The registration survived the failed re-read: restoring the
      // bytes is a cache hit and the server stays usable.
      writeFileSync(imported.path, fixtureBytes);
      const restored = await validateSuccess(client, imported.uuid);
      expect(restored.status).toBe('no-findings');
      expect(restored.outOfBandReRead).toBe(false);
      expect(restored.note).toBeUndefined();
    });
  });

  describe('the preview tool (feat-20, ACC-001/ACC-002, REQ-001/REQ-004, stdio leg)', () => {
    /**
     * Takes the fixed Stage 1 preview port for the duration of a test
     * when the environment left it free: a `Server` blocker the test
     * releases, or `null` when an external service (e.g. a
     * container-level listener) already owns the port. The entry
     * point binds the fixed port unconditionally (a configurable
     * port is explicitly out of scope, feat-20), so the port state is
     * the test's to arrange, not to assume.
     */
    async function occupyPreviewPort(): Promise<Server | null> {
      try {
        const blocker = createNetServer();
        await new Promise<void>((resolveBlocker, rejectBlocker) => {
          blocker.once('error', rejectBlocker);
          blocker.listen(DEFAULT_PORT, PREVIEW_HOST, () => resolveBlocker());
        });
        return blocker;
      } catch {
        return null;
      }
    }

    it('ACC-001: preview on an imported process returns the view URL; page and XML are served over real HTTP', async (ctx) => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);

      const outcome = await callTool(client, 'preview', { uuid: imported.uuid });

      // In an environment where an external service already owns the
      // fixed port, the structured port-in-use error is the expected
      // result - the bind-impossible legs cannot run there and
      // report themselves as skipped (the port-in-use leg below
      // covers exactly that state over real stdio).
      if (outcome.isError && outcome.text === PORT_IN_USE_TEXT) {
        ctx.skip('the preview port is already taken by an external service in this environment');
      }
      expect(outcome.isError).toBe(false);
      const result = JSON.parse(outcome.text) as PreviewSuccessPayload;
      expect(result.url).toBe(`http://${PREVIEW_HOST}:${DEFAULT_PORT}/view/${imported.uuid}`);
      expect(result.port).toBe(DEFAULT_PORT);
      // Headless: the browser opener is not required to exist - the
      // shape is the contract (opened:false carries a single-line
      // reason, opened:true carries none; never a real browser).
      if (result.opened === true) {
        expect(result.reason).toBeUndefined();
      } else {
        const reason = result.reason;
        expect(typeof reason).toBe('string');
        if (typeof reason === 'string') {
          expect(reason.length).toBeGreaterThan(0);
          expect(reason).not.toContain('\n');
        }
      }

      // The page and the XML are served over real HTTP (ACC-001).
      const page = await fetch(`http://${PREVIEW_HOST}:${DEFAULT_PORT}/view/${imported.uuid}`);
      expect(page.status).toBe(200);
      const html = await page.text();
      expect(html).toContain('id="bpmn-canvas"');
      expect(html).toContain('new BpmnJS(');

      const xml = await fetch(`http://${PREVIEW_HOST}:${DEFAULT_PORT}/processes/${imported.uuid}`);
      expect(xml.status).toBe(200);
      expect(xml.headers.get('content-type')).toContain('application/xml');
      expect(await xml.text()).toContain('order-process');
    }, 30_000);

    it('ACC-002: a second preview call reuses the running server: no second bind, no error, same port', async (ctx) => {
      const docsDir = join(tempCwd, 'docs');
      ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
      await client.connect(transport);

      const imported = await importSuccess(client, ORDER_FIXTURE);
      const first = await callTool(client, 'preview', { uuid: imported.uuid });
      if (first.isError && first.text === PORT_IN_USE_TEXT) {
        ctx.skip('the preview port is already taken by an external service in this environment');
      }
      expect(first.isError).toBe(false);
      const firstResult = JSON.parse(first.text) as PreviewSuccessPayload;
      expect(firstResult.port).toBe(DEFAULT_PORT);
      expect(firstResult.url).toBe(`http://${PREVIEW_HOST}:${DEFAULT_PORT}/view/${imported.uuid}`);

      // A second call (any process) reuses the live server: no
      // second bind attempt, no error, the same port.
      const second = await callTool(client, 'preview', { uuid: imported.uuid });
      expect(second.isError).toBe(false);
      const secondResult = JSON.parse(second.text) as PreviewSuccessPayload;
      expect(secondResult.port).toBe(DEFAULT_PORT);
      expect(secondResult.url).toBe(firstResult.url);

      // The same server still serves (no rebind in between).
      const page = await fetch(`http://${PREVIEW_HOST}:${DEFAULT_PORT}/view/${imported.uuid}`);
      expect(page.status).toBe(200);
      await page.body?.cancel();
    }, 30_000);

    it('REQ-001: a taken preview port is a single-line isError over real stdio; the server stays usable', async () => {
      // Take the port when the environment left it free (otherwise an
      // external service already owns it - the same state this leg
      // needs).
      const blocker = await occupyPreviewPort();
      try {
        const docsDir = join(tempCwd, 'docs');
        ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
        await client.connect(transport);

        const imported = await importSuccess(client, ORDER_FIXTURE);

        const outcome = await callTool(client, 'preview', { uuid: imported.uuid });
        expect(outcome.isError).toBe(true);
        expect(outcome.text).toBe(PORT_IN_USE_TEXT);
        expect(outcome.text).not.toContain('\n');

        // The tool failure never crashes the server: another tool works.
        const parsed = await parseSuccess(client, imported.uuid);
        expect(parsed.uuid).toBe(imported.uuid);
      } finally {
        if (blocker !== null) {
          await new Promise<void>((resolveClose) => blocker.close(() => resolveClose()));
        }
      }
    }, 30_000);

    it('REQ-005: SIGTERM is a clean shutdown - the handler runs and the process exits deterministically', async () => {
      // The stdio session end a host performs is a SIGTERM to this
      // child (the SDK's own StdioClientTransport.close() grace
      // period); the entry point's shutdown hook must turn it into a
      // deterministic close (the preview server, when running) plus a
      // clean exit - not the default signal death (code null, signal
      // SIGTERM). The preview server is lazy and never starts in this
      // leg, so it exercises the wiring without the fixed port.
      const docsDir = join(tempCwd, 'docs');
      // stdin stays an OPEN pipe (never written or closed): a live MCP
      // session is exactly that - the stdio transport's stdin `data`
      // listener then keeps the child alive until the signal arrives
      // (a null stdin would drain the event loop and exit the child on
      // its own, before this test could say anything).
      const child = spawn(process.execPath, [DIST_ENTRY], {
        cwd: tempCwd,
        env: { ...process.env, BPMN_MCP_DOCS_DIR: docsDir },
        stdio: ['pipe', 'ignore', 'pipe'],
      });
      let stderr = '';
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      // Wait for the entry point to finish starting (the shutdown
      // handlers are installed before the 'started' log line).
      await new Promise<void>((resolveWait, rejectWait) => {
        let settled = false;
        const finish = (error?: Error): void => {
          if (settled) {
            return;
          }
          settled = true;
          clearInterval(interval);
          clearTimeout(timeout);
          child.off('close', onEarlyClose);
          if (error !== undefined) {
            rejectWait(error);
          } else {
            resolveWait();
          }
        };
        const interval = setInterval(() => {
          if (stderr.includes('"event":"started"')) {
            finish();
          }
        }, 50);
        const timeout = setTimeout(() => {
          child.kill('SIGKILL');
          finish(new Error(`the child did not start within 20s; stderr: ${stderr}`));
        }, 20_000);
        const onEarlyClose = (): void => {
          if (stderr.includes('"event":"started"')) {
            finish();
          } else {
            finish(new Error(`the child exited before starting; stderr: ${stderr}`));
          }
        };
        child.on('close', onEarlyClose);
        if (stderr.includes('"event":"started"')) {
          finish();
        }
      });

      child.kill('SIGTERM');
      const { code, signal } = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
        (resolveExit, rejectExit) => {
          const killTimer = setTimeout(() => {
            child.kill('SIGKILL');
            rejectExit(new Error('the child did not exit after SIGTERM (the shutdown wiring is broken)'));
          }, 10_000);
          child.on('close', (exitCode, exitSignal) => {
            clearTimeout(killTimer);
            resolveExit({ code: exitCode, signal: exitSignal });
          });
        },
      );

      // A clean exit: code 0, not a signal death.
      expect({ code, signal }).toEqual({ code: 0, signal: null });

      // The shutdown handler ran (the log file carries the event, the
      // same pino-roll flush wait as the log-leg above).
      await new Promise((resolveFlush) => setTimeout(resolveFlush, 300));
      const logsDir = join(tempCwd, 'logs');
      const logContent = readdirSync(logsDir)
        .map((file) => readFileSync(join(logsDir, file), 'utf8'))
        .join('\n');
      expect(logContent).toContain('"event":"shutting-down"');
      expect(logContent).toContain('"cause":"SIGTERM"');
    }, 40_000);
  });
});
