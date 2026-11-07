// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import type { LoggingConfig } from './config.js';
import { readPackageMetadata } from './package-metadata.js';
import { resolveDocsPrcDir } from './paths.js';
import { ELEMENT_TYPES, type PrcElementType } from './prc/editing.js';
import type { ChangeSuccess, PrcError, PrcStore } from './prc/store.js';

/** The `bpmnmcp://config` resource's reported shape (REQ-007). */
export interface EffectiveConfig {
  logging: {
    destination: string;
    level: string;
    rotation: string;
  };
  otel: {
    endpoint: string;
  };
  paths: {
    docsPrcDir: string;
  };
  bpmnlint: {
    preset: string;
  };
}

/** Builds the `config` resource's content from the resolved pieces (REQ-007, REQ-008, REQ-010). */
export function buildEffectiveConfig(loggingConfig: LoggingConfig): EffectiveConfig {
  return {
    logging: {
      destination: loggingConfig.logFile,
      level: loggingConfig.logLevel,
      rotation: loggingConfig.logRotate,
    },
    // OTel instrumentation is out of scope for this feature (Design
    // Notes); the endpoint state is always reported as "disabled".
    otel: {
      endpoint: 'disabled',
    },
    paths: {
      docsPrcDir: resolveDocsPrcDir(),
    },
    // bpmnlint is out of scope for this feature (Design Notes).
    bpmnlint: {
      preset: 'not yet configured',
    },
  };
}

/**
 * The out-of-band re-read note (REQ-004/ACC-006): carried in a tool
 * result's JSON whenever the conditional re-read detected that the
 * process's registered file changed on disk and had to be re-parsed.
 * Single-line and human-readable, per the plan's "Structured tool
 * errors" note.
 */
const RE_READ_NOTE =
  'the registered file changed out of band and was re-read; the served content reflects the modification';

/** A non-negative integer coordinate (feat-17 REQ-003: explicit x/y are honored as-is). */
const NON_NEGATIVE_INT = z.number().int().nonnegative();

/**
 * The Stage 1 element types in the tool-facing kebab-case vocabulary
 * (feat-17 REQ-002): derived from the core's `ELEMENT_TYPES` so the
 * tool and the core can never drift apart.
 */
const STAGE1_ELEMENT_TYPES = Object.keys(ELEMENT_TYPES) as PrcElementType[];

/**
 * The `create` tool input (feat-17 REQ-001): the process name
 * (non-empty at the MCP layer; a whitespace-only name is the core's
 * structured `invalid-property` error) plus the optional initial
 * elements (the Stage 1 type, an optional name, an optional caller
 * id, optional non-negative integer coordinates).
 */
const CREATE_INPUT = {
  name: z.string().min(1),
  elements: z
    .array(
      z.object({
        type: z.enum(STAGE1_ELEMENT_TYPES),
        name: z.string().optional(),
        id: z.string().optional(),
        x: NON_NEGATIVE_INT.optional(),
        y: NON_NEGATIVE_INT.optional(),
      }),
    )
    .optional(),
};

/**
 * The `change` tool's advertised input (feat-17 REQ-002, QA 1.0010's
 * top-level action parameter): `uuid` plus every action's fields at
 * the top level. The flat shape keeps each field visible in
 * `tools/list`; which of them the chosen `action` requires is
 * enforced where the core's operation is assembled (the
 * `EDITING_OPERATION` parse in the handler), so the advertised schema
 * never misreports a field as required for every action.
 */
const CHANGE_INPUT = {
  uuid: z.string(),
  action: z.enum(['add-element', 'update-element', 'connect', 'delete-element']),
  type: z.enum(STAGE1_ELEMENT_TYPES).optional(),
  name: z.string().optional(),
  id: z.string().optional(),
  x: NON_NEGATIVE_INT.optional(),
  y: NON_NEGATIVE_INT.optional(),
  isInterrupting: z.boolean().optional(),
  sourceId: z.string().optional(),
  targetId: z.string().optional(),
  conditionExpression: z.string().optional(),
};

/**
 * The discriminated union on `action` the `change` handler assembles
 * the core's `EditingOperation` from (feat-17 REQ-002): one member
 * per action, mirroring the core's operation union field for field.
 * Parsing the flat call arguments against it (the object members
 * strip the unknown `uuid` key) validates the action's required
 * fields and yields exactly the operation the store expects.
 */
const EDITING_OPERATION = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('add-element'),
    type: z.enum(STAGE1_ELEMENT_TYPES),
    name: z.string().optional(),
    id: z.string().optional(),
    x: NON_NEGATIVE_INT.optional(),
    y: NON_NEGATIVE_INT.optional(),
  }),
  z.object({
    action: z.literal('update-element'),
    id: z.string(),
    name: z.string().optional(),
    isInterrupting: z.boolean().optional(),
    x: NON_NEGATIVE_INT.optional(),
    y: NON_NEGATIVE_INT.optional(),
  }),
  z.object({
    action: z.literal('connect'),
    sourceId: z.string(),
    targetId: z.string(),
    name: z.string().optional(),
    conditionExpression: z.string().optional(),
  }),
  z.object({
    action: z.literal('delete-element'),
    id: z.string(),
  }),
]);

/**
 * Creates the `McpServer` instance and registers its resources
 * (feat-1 REQ-006, REQ-007) and tools (feat-2 REQ-005, REQ-006,
 * REQ-007; feat-17 REQ-001, REQ-002): the `version` and `config`
 * resources, plus `import` (one file path in; the registered uuid
 * and path out), `export` (a registered uuid plus an optional
 * explicit path in; the written path out), `create` (a name plus the
 * optional initial elements in; the draft uuid and the derived
 * identity out) and `change` (a uuid plus the discriminated action
 * in; the operation detail out). All four tools are thin adapters
 * over the constructed `PrcStore` (QA pair 7.0010): zod validates
 * the input shape, the store owns every filesystem touch, and the
 * store's structured results are mapped 1:1 to tool results --
 * failures become `isError: true` results carrying the store's
 * single-line message (nothing is thrown across the MCP boundary),
 * successes become JSON text content, mirroring how the resources
 * serialize theirs.
 * Transport-agnostic by design, so both the real stdio entry point
 * (`index.ts`) and the in-memory MCP-level test (`test/`) can build
 * the identical server and only differ in which transport they
 * `connect()` it to.
 *
 * @param loggingConfig - The effective logging configuration (the
 *   `config` resource's data).
 * @param store - The constructed `prc` artifact store the tools
 *   adapt (a constructed instance, not a factory -- the plan's
 *   module-layout note).
 */
export function createServer(loggingConfig: LoggingConfig, store: PrcStore): McpServer {
  const packageMetadata = readPackageMetadata();

  const server = new McpServer({
    name: packageMetadata.name,
    version: packageMetadata.version,
  });

  server.registerResource(
    'version',
    'bpmnmcp://version',
    {
      title: 'Server version',
      description: "This component's own name and version.",
      mimeType: 'application/json',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(packageMetadata),
        },
      ],
    }),
  );

  server.registerResource(
    'config',
    'bpmnmcp://config',
    {
      title: 'Effective configuration',
      description: 'The effective logging, OTel, path, and bpmnlint configuration (REQ-007).',
      mimeType: 'application/json',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(buildEffectiveConfig(loggingConfig)),
        },
      ],
    }),
  );

  server.registerTool(
    'import',
    {
      title: 'Import a BPMN process',
      description:
        'Imports a BPMN 2.0 XML file from any path as a registered process: the file is copied ' +
        'byte-identical into the prc directory as prc-<uuid>-<slug>.bpmn (the original is never ' +
        'modified or moved), a fresh v4 UUID is assigned, and the slug is derived from the ' +
        "document's process id. Re-importing the registered own path, or the same source within " +
        'this server session, reuses the process without creating a second file. Returns JSON ' +
        'with uuid, path, slug, copied, and outOfBandReRead (plus a note when an out-of-band ' +
        'change of the registered file was re-read).',
      inputSchema: {
        path: z.string(),
      },
    },
    async (args) => {
      const result = await store.importProcess(args.path);
      if (!result.ok) {
        return toolError(result.error);
      }
      return toolJson({
        uuid: result.uuid,
        path: result.path,
        slug: result.slug,
        copied: result.copied,
        outOfBandReRead: result.outOfBandReRead,
        ...(result.outOfBandReRead ? { note: RE_READ_NOTE } : {}),
      });
    },
  );

  server.registerTool(
    'export',
    {
      title: 'Export a BPMN process',
      description:
        'Exports a registered process as formatted BPMN 2.0 XML: without an explicit path, to ' +
        "the process's own prc file; with one, to that path (a pre-existing file at the " +
        'explicit path is overwritten -- the only way another file is ever overwritten). The ' +
        "process's registered file is re-read first when its checksum changed out of band. " +
        'Returns JSON with uuid, path, and outOfBandReRead (plus a note when an out-of-band ' +
        'change was re-read).',
      inputSchema: {
        uuid: z.string(),
        path: z.string().optional(),
      },
    },
    async (args) => {
      const result = await store.exportProcess(args.uuid, args.path);
      if (!result.ok) {
        return toolError(result.error);
      }
      return toolJson({
        uuid: result.uuid,
        path: result.path,
        outOfBandReRead: result.outOfBandReRead,
        ...(result.outOfBandReRead ? { note: RE_READ_NOTE } : {}),
      });
    },
  );

  server.registerTool(
    'create',
    {
      title: 'Create a BPMN process',
      description:
        'Creates a new BPMN 2.0 process as a session draft: a fresh bpmn:Definitions/bpmn:Process ' +
        'tree under a new v4 UUID, held in memory only -- no file is written until export promotes ' +
        'the draft to the prc directory. The name must be non-empty (a whitespace-only name is a ' +
        'structured error). The optional elements list the initial elements: each carries a type ' +
        'from the Stage 1 set (start-event, end-event, intermediate-catch-event, task, sub-process, ' +
        'exclusive-gateway, parallel-gateway), an optional name, an optional caller-supplied id ' +
        '(a generated <type-prefix>_<n> id, e.g. task_1, is used when omitted), and optional ' +
        'non-negative integer x/y coordinates (omitted coordinates are placed on the grid ' +
        'automatically). Returns JSON with uuid, name, processId, slug, and elementCount. This ' +
        'tool does not validate the diagram -- call the validate tool after changes you care ' +
        'about.',
      inputSchema: CREATE_INPUT,
    },
    async (args) => {
      const result = await store.createProcess(args.name, args.elements);
      if (!result.ok) {
        return toolError(result.error);
      }
      return toolJson({
        uuid: result.uuid,
        name: result.name,
        processId: result.processId,
        slug: result.slug,
        elementCount: result.elementCount,
      });
    },
  );

  server.registerTool(
    'change',
    {
      title: 'Change a BPMN process',
      description:
        'Applies exactly one change to a process addressed by its uuid (one action per call). ' +
        'add-element creates a new element: type from the Stage 1 set (start-event, end-event, ' +
        'intermediate-catch-event, task, sub-process, exclusive-gateway, parallel-gateway) plus ' +
        'an optional name, an optional caller-supplied id, and optional non-negative integer x/y ' +
        'coordinates (omitted coordinates are grid-placed). update-element changes an existing ' +
        'one: id plus an optional name (any flow element, node or sequence flow), an optional ' +
        'isInterrupting (start events only), and optional x/y repositioning the element. connect ' +
        'creates a sequence flow between two flow nodes: sourceId and targetId plus an optional ' +
        'name and an optional conditionExpression text. delete-element removes a flow node -- ' +
        'with every sequence flow referencing it -- or a sequence flow: id. For registered ' +
        'processes the change is write-through: the mutation is serialized to the process prc ' +
        'file, the single source of truth; for session drafts (created but not yet exported) it ' +
        'stays in memory until export. Returns JSON with uuid, action, the operation detail (ids, ' +
        'positions, or removal counts), persisted, and outOfBandReRead (plus a note when an ' +
        'out-of-band change was re-read). This tool does not validate the diagram -- call the ' +
        'validate tool after changes you care about.',
      inputSchema: CHANGE_INPUT,
    },
    async (args) => {
      const operation = EDITING_OPERATION.safeParse(args);
      if (!operation.success) {
        return toolErrorText(operationShapeMessage(operation.error));
      }
      const result = await store.changeProcess(args.uuid, operation.data);
      if (!result.ok) {
        return toolError(result.error);
      }
      return toolJson(changeSuccessPayload(result));
    },
  );

  return server;
}

/**
 * The `isError` tool result for a structured store failure (the
 * "Structured tool errors" note): the store's single-line,
 * human-readable message as text content, nothing thrown.
 *
 * @param error - The structured store error.
 */
function toolError(error: PrcError): CallToolResult {
  return toolErrorText(error.message);
}

/**
 * The `isError` tool result for a single-line message (the MCP-layer
 * shape rejections that the store never sees): the message as text
 * content, nothing thrown.
 *
 * @param message - The single-line, human-readable message.
 */
function toolErrorText(message: string): CallToolResult {
  return {
    content: [{ type: 'text', text: message }],
    isError: true,
  };
}

/**
 * The single-line message for a change input that does not fit the
 * chosen action (a per-action required field is missing): every zod
 * issue folded into one line, worded like the SDK's own MCP-layer
 * validation error so both layers read the same way.
 *
 * @param error - The failed `EDITING_OPERATION` parse.
 */
function operationShapeMessage(error: z.ZodError): string {
  const issues = error.issues.map((issue) =>
    issue.path.length > 0 ? `${issue.message} at ${issue.path.join('.')}` : issue.message,
  );
  return `Input validation error: Invalid arguments for tool change: ${issues.join('; ')}`;
}

/**
 * The flat success JSON for a change (feat-17 REQ-002): the
 * operation detail (ids, positions, removal counts) spread one level
 * deep, without the detail's redundant `ok` flag, plus the store's
 * `persisted` and re-read state (the note convention, REQ-004).
 *
 * @param result - The store's change success.
 */
function changeSuccessPayload(result: ChangeSuccess): Record<string, unknown> {
  const detail: Record<string, unknown> = { ...result.detail };
  delete detail.ok;
  return {
    uuid: result.uuid,
    action: result.action,
    ...detail,
    persisted: result.persisted,
    outOfBandReRead: result.outOfBandReRead,
    ...(result.outOfBandReRead ? { note: RE_READ_NOTE } : {}),
  };
}

/**
 * The JSON text tool result for a successful store operation,
 * mirroring how the resources serialize their content.
 *
 * @param payload - The success data (uuid, path, ...).
 */
function toolJson(payload: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  };
}
