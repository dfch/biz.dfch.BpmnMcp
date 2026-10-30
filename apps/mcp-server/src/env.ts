// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Loads `.env` into `process.env` using Node's built-in
 * `process.loadEnvFile()` (REQ-009). A missing `.env` file is not an
 * error -- it is simply skipped, so a clean clone with no `.env`
 * still starts using only `logging.json`/built-in defaults.
 *
 * `process.loadEnvFile()` never overwrites a key already present in
 * `process.env` (confirmed against Node 24.22.1 -- the real
 * environment always wins over the same key loaded from `.env`), so
 * no snapshot/restore dance is needed here to honor REQ-009's
 * precedence.
 *
 * @param path - The `.env` file path to load, relative to
 *   `process.cwd()` by default (Node resolves a relative path against
 *   the current working directory).
 */
export function loadDotEnv(path = '.env'): void {
  try {
    process.loadEnvFile(path);
  } catch (error) {
    if (isFileNotFoundError(error)) {
      return;
    }
    throw error;
  }
}

function isFileNotFoundError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}
