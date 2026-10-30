// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadLoggingConfig } from './config.js';
import { loadDotEnv } from './env.js';
import { createLogger } from './logging.js';
import { createServer } from './server.js';

/**
 * Process entry point (REQ-006, REQ-007): loads `.env` (REQ-009),
 * resolves the effective logging configuration, builds the logger
 * (REQ-008), builds the MCP server and its resources (`server.ts`),
 * and connects it over the stdio transport. Nothing here writes to
 * stdout: the logger's destinations are the rolling file and stderr
 * only (REQ-006), and the stdio transport itself owns stdout for MCP
 * protocol frames.
 */
async function main(): Promise<void> {
  loadDotEnv();
  const loggingConfig = loadLoggingConfig();
  const logger = await createLogger(loggingConfig);

  const server = createServer(loggingConfig);
  const transport = new StdioServerTransport();

  logger.info({ event: 'starting' }, 'biz.dfch.bpmnmcp starting over stdio');
  await server.connect(transport);
  logger.info({ event: 'started' }, 'biz.dfch.bpmnmcp started');
}

main().catch((error: unknown) => {
  // No logger may be available yet if main() failed before
  // createLogger(); stderr is still a safe fallback here (never
  // stdout - REQ-006).
  process.stderr.write(`biz.dfch.bpmnmcp failed to start: ${String(error)}\n`);
  process.exitCode = 1;
});
