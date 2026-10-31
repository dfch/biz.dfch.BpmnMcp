// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModdleElement } from 'moddle';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { LoggingConfig } from '../src/config.js';
import { readPackageMetadata } from '../src/package-metadata.js';
import { resolveDocsPrcDir } from '../src/paths.js';
import { parseBpmn } from '../src/prc/moddle.js';
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

const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

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

/** One element of the ACC-007 inventory: the BPMN id, type, and name. */
interface InventoryElement {
  id: string;
  type: string;
  name: string | undefined;
}

/** One flow of the ACC-007 inventory: the id, source, and target. */
interface InventoryFlow {
  id: string;
  source: string | undefined;
  target: string | undefined;
}

/** The ACC-007 round-trip inventory: the elements plus the flows. */
interface RoundTripInventory {
  elements: InventoryElement[];
  flows: InventoryFlow[];
}

/** Type guard: is this value a moddle element (anything carrying a string `$type`)? */
function isModdleElement(value: unknown): value is ModdleElement {
  return value !== null && typeof value === 'object' && typeof (value as ModdleElement).$type === 'string';
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

/**
 * The ACC-007 round-trip inventory (a test-local richer walk): every
 * element's BPMN id, type, and name, plus every sequence flow's id,
 * source, and target. The production `collectElementInventory`
 * carries only id/type, so the walk is duplicated here rather than
 * the production module extended for the test's sake (plan,
 * Task 110.140). Deterministically sorted, like the production one.
 *
 * @param xml - The BPMN 2.0 XML to parse and walk.
 */
async function collectRoundTripInventory(xml: string | Uint8Array): Promise<RoundTripInventory> {
  const root = (await parseBpmn(xml)).rootElement;
  const inventory: RoundTripInventory = { elements: [], flows: [] };
  const seen = new Set<object>();

  const visit = (element: ModdleElement): void => {
    if (seen.has(element)) {
      return;
    }
    seen.add(element);
    recordInventoryElement(element, inventory);
    for (const child of childReferences(element)) {
      visit(child);
    }
  };

  visit(root);
  inventory.elements.sort((a, b) => {
    const keyA = `${a.type}\u0000${a.id}`;
    const keyB = `${b.type}\u0000${b.id}`;
    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
  });
  inventory.flows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return inventory;
}

/**
 * Records the element (and, for a sequence flow, its source and
 * target) in the inventory, when it carries a non-empty `id`.
 *
 * @param element - The visited element.
 * @param inventory - The inventory being built (mutated).
 */
function recordInventoryElement(element: ModdleElement, inventory: RoundTripInventory): void {
  const id = element.id;
  if (typeof id !== 'string' || id.length === 0) {
    return;
  }
  const name = typeof element.name === 'string' ? element.name : undefined;
  inventory.elements.push({ id, type: element.$type, name });
  if (element.$type === 'bpmn:SequenceFlow') {
    inventory.flows.push({ id, source: referenceId(element.sourceRef), target: referenceId(element.targetRef) });
  }
}

/**
 * The moddle elements this element directly references: the values
 * of its many-valued element-array properties plus its single-valued
 * element-reference properties (mirroring the production walk).
 *
 * @param element - The visited element.
 */
function childReferences(element: ModdleElement): ModdleElement[] {
  const children: ModdleElement[] = [];
  const descriptor = element.$descriptor;
  if (descriptor === undefined || !Array.isArray(descriptor.properties)) {
    return children;
  }
  for (const property of descriptor.properties) {
    const value = element[property.name];
    if (property.isMany && Array.isArray(value)) {
      for (const child of value) {
        if (isModdleElement(child)) {
          children.push(child);
        }
      }
    } else if (isModdleElement(value)) {
      children.push(value);
    }
  }
  return children;
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
        bpmnlint: {
          preset: 'not yet configured',
        },
      });
    });
  });

  it('lists exactly the import and export tools (ACC-008)', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual(['export', 'import']);
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
      expect(readFileSync(explicitPath, 'utf8')).toContain('Second look');
      expect(readFileSync(explicitPath, 'utf8')).not.toContain('Review order');
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
      const sourceInventory = await collectRoundTripInventory(sourceXml);
      const exportInventory = await collectRoundTripInventory(readFileSync(exportPath));
      expect(sourceInventory.elements.length).toBeGreaterThan(0);
      expect(sourceInventory.flows.length).toBeGreaterThan(0);
      expect(exportInventory.elements).toEqual(sourceInventory.elements);
      expect(exportInventory.flows).toEqual(sourceInventory.flows);

      // Pin the reference shape: every flow carries its resolved
      // source and target (the walk's reference handling works).
      expect(sourceInventory.flows).toEqual([
        { id: 'flow-1', source: 'start-event', target: 'review-task' },
        { id: 'flow-2', source: 'review-task', target: 'end-event' },
      ]);
    });
  });
});
