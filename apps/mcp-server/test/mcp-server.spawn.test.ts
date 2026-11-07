// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ModdleElement } from 'moddle';
import { getPlane, rectanglesOverlap } from '../src/prc/layout.js';
import { isModdleElement, parseBpmn } from '../src/prc/moddle.js';

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

  it('lists exactly the four tools over real stdio: change, create, export, import (feat-17 ACC-004)', async () => {
    // The handshake lists create and change in addition to the existing tools.
    const docsDir = join(tempCwd, 'docs');
    ({ client, transport } = connectSpawnedServer(tempCwd, docsDir));
    await client.connect(transport);

    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual(['change', 'create', 'export', 'import']);
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
  });
});
