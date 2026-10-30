// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGE_ROOT } from './package-root.js';

/** The effective logging configuration (REQ-008, REQ-009). */
export interface LoggingConfig {
  /** Rolling log file base path (no extension), e.g. `logs/server`. */
  logFile: string;
  /** Minimum pino log level. */
  logLevel: string;
  /**
   * Rotation mode/frequency: `'daily'`, `'hourly'`, or a
   * numeric-looking string interpreted as a number of milliseconds
   * (`logging.ts` converts it before passing it to `pino-roll`, which
   * itself only accepts `'daily'`/`'hourly'`/a real `number`).
   */
  logRotate: string;
  /**
   * How many files to keep **in total**, active file included
   * (REQ-008's "seven files kept" default). `pino-roll`'s own
   * `limit.count` option means "rotated files in addition to the
   * active file", so the logging module subtracts one from this
   * value before passing it to `pino-roll` (see `logging.ts`).
   */
  logRetain: number;
}

/** Built-in defaults (the lowest-precedence tier of REQ-009). */
const BUILT_IN_DEFAULTS: LoggingConfig = {
  logFile: 'logs/server',
  logLevel: 'info',
  logRotate: 'daily',
  logRetain: 7,
};

/** The shape of a parsed `logging.json`; every field is optional (REQ-009). */
interface LoggingConfigFile {
  logFile?: string;
  logLevel?: string;
  logRotate?: string;
  logRetain?: number;
}

/**
 * Reads `logging.json` (the middle tier of REQ-009's precedence), a
 * committed component config living next to this package's own
 * `package.json` -- not resolved against `process.cwd()`, since it
 * ships with the code rather than with the consuming repository (see
 * `paths.ts` for the `BPMN_MCP_DOCS_DIR` contrast). A missing file is
 * not an error: it falls through to an empty object, so every field
 * resolves to its built-in default.
 */
function readLoggingConfigFile(packageRoot: string = PACKAGE_ROOT): LoggingConfigFile {
  const path = join(packageRoot, 'logging.json');
  if (!existsSync(path)) {
    return {};
  }
  const content = readFileSync(path, 'utf8');
  return JSON.parse(content) as LoggingConfigFile;
}

/**
 * Resolves the effective logging configuration with REQ-009's
 * precedence: real environment (highest) > `logging.json` > built-in
 * defaults (lowest). `.env` is loaded into `process.env` beforehand
 * (see `env.ts`), so it participates as part of the "real
 * environment" tier here, not as a separate tier.
 *
 * @param env - The environment to read overrides from (defaults to
 *   `process.env`; injectable for tests).
 * @param packageRoot - Where to look for `logging.json` (defaults to
 *   this package's own root; injectable for tests).
 */
/** Resolves a single string setting through REQ-009's three-tier precedence. */
function resolveSetting(envValue: string | undefined, fileValue: string | undefined, fallback: string): string {
  return envValue ?? fileValue ?? fallback;
}

export function loadLoggingConfig(
  env: NodeJS.ProcessEnv = process.env,
  packageRoot: string = PACKAGE_ROOT,
): LoggingConfig {
  const fileConfig = readLoggingConfigFile(packageRoot);
  const retainFromEnv = env.BPMN_MCP_LOG_RETAIN !== undefined ? Number(env.BPMN_MCP_LOG_RETAIN) : undefined;

  return {
    logFile: resolveSetting(env.BPMN_MCP_LOG_FILE, fileConfig.logFile, BUILT_IN_DEFAULTS.logFile),
    logLevel: resolveSetting(env.BPMN_MCP_LOG_LEVEL, fileConfig.logLevel, BUILT_IN_DEFAULTS.logLevel),
    logRotate: resolveSetting(env.BPMN_MCP_LOG_ROTATE, fileConfig.logRotate, BUILT_IN_DEFAULTS.logRotate),
    logRetain: retainFromEnv ?? fileConfig.logRetain ?? BUILT_IN_DEFAULTS.logRetain,
  };
}
