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
 * root, wherever that root resolves to (source or compiled layout).
 */
export function readPackageMetadata(packageRoot: string = PACKAGE_ROOT): PackageMetadata {
  const content = readFileSync(join(packageRoot, 'package.json'), 'utf8');
  const parsed = JSON.parse(content) as PackageMetadata;
  return { name: parsed.name, version: parsed.version };
}
