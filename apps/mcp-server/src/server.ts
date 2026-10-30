// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { LoggingConfig } from './config.js';
import { readPackageMetadata } from './package-metadata.js';
import { resolveDocsPrcDir } from './paths.js';

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
 * Creates the `McpServer` instance and registers its resources
 * (REQ-006, REQ-007): `version` (this component's own name/version)
 * and `config` (the effective logging/OTel/paths/bpmnlint settings).
 * Transport-agnostic by design, so both the real stdio entry point
 * (`index.ts`) and the in-memory MCP-level test (`test/`) can build
 * the identical server and only differ in which transport they
 * `connect()` it to.
 */
export function createServer(loggingConfig: LoggingConfig): McpServer {
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

  return server;
}
