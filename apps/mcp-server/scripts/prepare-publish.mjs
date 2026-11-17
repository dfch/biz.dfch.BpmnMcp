// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The `prepack` pipeline (feat-11 REQ-002, Task 100.110): builds the
 * package, then post-processes the build output only.
 *
 * 1. `npm run build` (type-check + emit to `dist/`).
 * 2. Prepend `#!/usr/bin/env node` to `dist/index.js` when absent
 *    (the bin needs a shebang for direct exec on Unix, where npm's bin
 *    links are symlinks) and set its exec bit. The shebang is added to
 *    the _built_ entry point, never to `src/index.ts`: the license
 *    drift gate pins lines 0/1 of every in-scope source file to the
 *    two-line SPDX header with no shebang tolerance, and `dist/` is
 *    exempt from the gate, which is what makes this safe (Design
 *    Notes: "Shebang in build output, never in source").
 * 3. Copy the repository-root `LICENSE` into the package directory:
 *    npm auto-includes a `LICENSE` file only from the package
 *    directory, and AGPL requires the license text to travel with the
 *    distributed package.
 *
 * No source file is ever touched by this script.
 */

import { chmodSync, copyFileSync, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The shebang line the packed bin carries (the `npx`/direct-exec requirement on Unix). */
export const SHEBANG = '#!/usr/bin/env node';

/** The package directory this script ships in (`scripts/` -> `apps/mcp-server`). */
export const DEFAULT_PACKAGE_DIR = dirname(dirname(fileURLToPath(import.meta.url)));

/**
 * Prepends the shebang line to the file when it is absent.
 * Idempotent: a file whose first line is already the shebang is left
 * byte-identical (a second `prepack` over the same build output adds
 * no second line).
 *
 * @param {string} targetPath - The file to shebang (the built `dist/index.js`).
 */
export function ensureShebang(targetPath) {
  const content = readFileSync(targetPath, 'utf8');
  if (content.split('\n')[0] === SHEBANG) {
    return;
  }
  writeFileSync(targetPath, `${SHEBANG}\n${content}`);
}

/**
 * Adds the exec bit (user, group, other) to the file, keeping every
 * other mode bit unchanged.
 *
 * @param {string} targetPath - The file to make executable (the built `dist/index.js`).
 */
export function ensureExecutable(targetPath) {
  chmodSync(targetPath, statSync(targetPath).mode | 0o111);
}

/**
 * Copies the repository-root `LICENSE` (two levels above the package
 * directory: `apps/mcp-server` -> repository root) into the package
 * directory. A raw byte copy: the package-directory file is
 * byte-identical to the root's. A missing root file is an error --
 * the license text must travel with the distributed package.
 *
 * @param {string} packageDir - The package directory receiving the copy.
 */
export function copyRootLicense(packageDir) {
  const rootLicense = join(resolve(packageDir, '../..'), 'LICENSE');
  if (!existsSync(rootLicense)) {
    throw new Error(`repository root LICENSE not found at ${rootLicense}`);
  }
  copyFileSync(rootLicense, join(packageDir, 'LICENSE'));
}

/**
 * Runs the package build (`npm run build` in the package directory),
 * inheriting stdio so the type-check/emit output stays visible.
 *
 * @param {string} packageDir - The package directory to build.
 */
export function runBuild(packageDir) {
  execFileSync('npm', ['run', 'build'], { cwd: packageDir, stdio: 'inherit' });
}

/**
 * The full prepack pipeline: build -> shebang + exec bit on
 * `dist/index.js` -> root `LICENSE` copied into the package directory.
 *
 * @param {string} [packageDir=DEFAULT_PACKAGE_DIR] - The package directory to prepare.
 * @param {{ build?: (packageDir: string) => void }} [steps] - Injectable lifecycle
 *   steps (tests stub `build` to skip the real `npm run build`).
 */
export function preparePublish(packageDir = DEFAULT_PACKAGE_DIR, steps = {}) {
  const build = steps.build ?? runBuild;
  build(packageDir);
  const entryPoint = join(packageDir, 'dist', 'index.js');
  ensureShebang(entryPoint);
  ensureExecutable(entryPoint);
  copyRootLicense(packageDir);
}

// Run the pipeline when invoked directly (`node scripts/prepare-publish.mjs`,
// i.e. from the `prepack` script); importing the module (tests) runs nothing.
const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  preparePublish();
}
