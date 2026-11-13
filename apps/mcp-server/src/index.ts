// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Logger } from 'pino';
import { loadLoggingConfig } from './config.js';
import { loadDotEnv } from './env.js';
import { createLogger } from './logging.js';
import { resolveDocsPrcDir } from './paths.js';
import { PrcStore } from './prc/store.js';
import { PreviewServer } from './preview/preview-server.js';
import { createServer } from './server.js';

/**
 * Process entry point (feat-1 REQ-006, REQ-007, feat-2 REQ-005/
 * REQ-006, feat-20 REQ-004/REQ-005): loads `.env` (REQ-009),
 * resolves the effective logging configuration, builds the logger
 * (REQ-008), constructs the `prc` artifact store over the resolved
 * `prc` directory, constructs the single preview server for the
 * process lifetime (feat-20 REQ-005: the `preview` tool starts it
 * lazily on its first call), builds the MCP server with its
 * resources and tools (`server.ts`), wires the clean shutdown, and
 * connects it over the stdio transport. Nothing here writes to
 * stdout: the logger's destinations are the rolling file and stderr
 * only (REQ-006), and the stdio transport itself owns stdout for MCP
 * protocol frames.
 */
async function main(): Promise<void> {
  loadDotEnv();
  const loggingConfig = loadLoggingConfig();
  const logger = await createLogger(loggingConfig);
  const store = new PrcStore(resolveDocsPrcDir(), logger);
  // One preview server for the process lifetime (feat-20 REQ-005,
  // the Phase 100 `closeServer` WIRING POINT): the `preview` tool
  // starts it lazily on its first call, and the fixed default port
  // (8080) plus host (127.0.0.1) are the Stage 1 contract (QA
  // 4.0010/6.0010 - a configurable port is explicitly out of scope).
  const previewServer = new PreviewServer(store, logger);
  const server = createServer(loggingConfig, store, previewServer);
  const transport = new StdioServerTransport();

  installShutdownHooks(server, previewServer, logger);

  logger.info({ event: 'starting' }, 'biz.dfch.bpmnmcp starting over stdio');
  await server.connect(transport);
  logger.info({ event: 'started' }, 'biz.dfch.bpmnmcp started');
}

/**
 * The clean-shutdown wiring (feat-20 REQ-005, plan fix E1, the Phase
 * 100 `closeServer` WIRING POINT): on MCP session end, the preview
 * server is closed deterministically (port release, keep-alive
 * teardown) and the process exits.
 *
 * The hooks, verified against the installed
 * `@modelcontextprotocol/sdk` (1.32.x): the SDK `Server` is NOT an
 * EventEmitter - the plan's "'close' event" candidate does not exist
 * on it. Its base class `Protocol` instead exposes a public `onclose`
 * callback ("invoked when the connection is closed for any reason",
 * also on an explicit `close()`), reachable here as
 * `server.server.onclose`. For stdio, however, that callback fires
 * only on an explicit or error-driven close: `StdioServerTransport`
 * never listens for stdin `end`, and the session end a host performs
 * is its own `StdioClientTransport.close()`, which waits a grace
 * period and then signals this child process with `SIGTERM`
 * (escalating to `SIGKILL`). The deterministic hooks are therefore
 * both: `server.server.onclose` (the transport-level session end on
 * the in-memory/HTTP transports, and any explicit `close()`) and
 * `SIGINT`/`SIGTERM` (the stdio session end). Both funnel into one
 * idempotent routine. The Phase 100 listener `unref()` (E1a) already
 * guarantees the process can exit even if this routine is never
 * reached - this routine is the deterministic leg that releases the
 * port (E1b).
 *
 * `process.exit(0)` after the close: the stdio transport's stdin
 * `data` listener keeps the event loop alive, so the process would
 * not exit on its own once a signal handler has run.
 *
 * @param server - The built MCP server (its base `Server` carries the `onclose` hook).
 * @param previewServer - The single preview server to close (idempotent close, Phase 100).
 * @param logger - The pino logger (stderr and the rolling file, never stdout).
 */
function installShutdownHooks(server: McpServer, previewServer: PreviewServer, logger: Logger): void {
  let shuttingDown = false;
  const shutdown = (cause: string): void => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    logger.info({ event: 'shutting-down', cause }, 'shutting down: closing the preview server');
    void previewServer
      .closeServer()
      .catch((error: unknown) => {
        logger.error(
          {
            event: 'shutdown-preview-close-failed',
            error: error instanceof Error ? error.message : String(error),
          },
          'the preview server close failed during shutdown',
        );
      })
      .finally(() => {
        process.exit(0);
      });
  };
  server.server.onclose = () => shutdown('mcp-session-close');
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error: unknown) => {
  // No logger may be available yet if main() failed before
  // createLogger(); stderr is still a safe fallback here (never
  // stdout - REQ-006).
  process.stderr.write(`biz.dfch.bpmnmcp failed to start: ${String(error)}\n`);
  process.exitCode = 1;
});
