// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import type { LoggingConfig } from './config.js';
import { readPackageMetadata } from './package-metadata.js';
import { resolveDocsPrcDir } from './paths.js';
import type { PrcError, PrcStore } from './prc/store.js';

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

/**
 * Creates the `McpServer` instance and registers its resources
 * (feat-1 REQ-006, REQ-007) and tools (feat-2 REQ-005, REQ-006,
 * REQ-007): the `version` and `config` resources, plus `import`
 * (one file path in; the registered uuid and path out) and `export`
 * (a registered uuid plus an optional explicit path in; the written
 * path out). Both tools are thin adapters over the constructed
 * `PrcStore` (QA pair 7.0010): zod validates the input shape, the
 * store owns every filesystem touch, and the store's structured
 * results are mapped 1:1 to tool results -- failures become
 * `isError: true` results carrying the store's single-line message
 * (nothing is thrown across the MCP boundary), successes become JSON
 * text content, mirroring how the resources serialize theirs.
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
  return {
    content: [{ type: 'text', text: error.message }],
    isError: true,
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
