// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Finds the `apps/mcp-server` package root -- the directory holding
 * this component's own `package.json` -- by walking up from a given
 * starting directory. This works identically whether the caller runs
 * from TypeScript source (`src/`) or from the compiled output
 * (`dist/src/`), since both sit under the same package root at a
 * different, but still shallow, depth; a directory walk removes the
 * need to hardcode an up-count that would otherwise have to differ
 * between the two layouts.
 *
 * Deliberately independent of `process.cwd()`: `logging.json` is a
 * committed component config shipped alongside the code (unlike
 * `BPMN_MCP_DOCS_DIR`, which is always resolved against the working
 * directory -- see `paths.ts`).
 */
export function findPackageRoot(startDir: string): string {
  let current = resolve(startDir);
  for (;;) {
    if (existsSync(join(current, 'package.json'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`Could not locate a package.json above ${startDir}`);
    }
    current = parent;
  }
}

/** The `apps/mcp-server` package root, resolved from this module's own location. */
export const PACKAGE_ROOT = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
