// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { resolve } from 'node:path';

/** The hardcoded subdirectory BPMN processes live under (REQ-010). */
const PROCESS_SUBDIRECTORY = 'prc';

/** The default documents root, relative to `process.cwd()` (REQ-010). */
const DEFAULT_DOCS_DIR = './docs';

/**
 * Resolves the absolute path to the `prc` documents subdirectory
 * (REQ-010). This is pure path math: it never creates the directory,
 * and it never touches the filesystem at all.
 *
 * The documents root is `BPMN_MCP_DOCS_DIR` (default `./docs`),
 * resolved against `process.cwd()` so it works correctly regardless
 * of the test runner's or the host process's working directory
 * (Design Notes: "Tests run with a temporary working directory and
 * set `BPMN_MCP_DOCS_DIR`; no test-only override exists").
 *
 * @param env - The environment to read `BPMN_MCP_DOCS_DIR` from
 *   (defaults to `process.env`; injectable for tests).
 */
export function resolveDocsPrcDir(env: NodeJS.ProcessEnv = process.env): string {
  const docsDir = env.BPMN_MCP_DOCS_DIR ?? DEFAULT_DOCS_DIR;
  return resolve(process.cwd(), docsDir, PROCESS_SUBDIRECTORY);
}
