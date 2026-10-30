// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGE_ROOT } from './package-root.js';

/** The subset of `package.json` fields the `version` resource reports (REQ-007). */
export interface PackageMetadata {
  name: string;
  version: string;
}

/**
 * Reads this component's own `name`/`version` from `package.json` at
 * runtime (rather than a compile-time JSON import), so the compiled
 * `dist/` output never needs its own copy of `package.json` alongside
 * it -- it reads the one real source of truth next to the package
 * root, wherever that root resolves to (source or compiled layout). A
 * file that exists but is not valid JSON is a clear, diagnosable
 * error: the thrown message names the file and keeps the original
 * parse error as its `cause`.
 */
export function readPackageMetadata(packageRoot: string = PACKAGE_ROOT): PackageMetadata {
  const path = join(packageRoot, 'package.json');
  const content = readFileSync(path, 'utf8');
  let parsed: PackageMetadata;
  try {
    parsed = JSON.parse(content) as PackageMetadata;
  } catch (cause) {
    throw new Error(
      `failed to parse package.json at ${path}: ${cause instanceof Error ? cause.message : String(cause)}`,
      {
        cause,
      },
    );
  }
  return { name: parsed.name, version: parsed.version };
}
