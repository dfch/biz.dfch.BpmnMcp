// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import pino from 'pino';
import type { Logger } from 'pino';
import buildRollingStream from 'pino-roll';
import type { Writable } from 'node:stream';
import type { LoggingConfig } from './config.js';

/**
 * Converts the configured rotation setting into the shape
 * `pino-roll`'s own `frequency` option accepts: `'daily'`/`'hourly'`
 * pass through unchanged, and any other (numeric-looking) string is
 * parsed as a number of milliseconds.
 */
function parseRotationFrequency(logRotate: string): string | number {
  if (logRotate === 'daily' || logRotate === 'hourly') {
    return logRotate;
  }
  const asNumber = Number(logRotate);
  return Number.isFinite(asNumber) ? asNumber : logRotate;
}

/**
 * Builds the rolling-file destination stream for `./logs` (REQ-008),
 * using the `pino-roll` naming/retention scheme the Task 100.165
 * interop spike confirmed: with no `dateFormat` set, rotated files are
 * named `<base>.<count>.<ext>` (e.g. `server.1.log`, `server.2.log`,
 * ...), and `limit.count` is the number of rotated files kept **in
 * addition to** the active file -- so `logRetain` (REQ-008's "seven
 * files total, active file included") is passed through as
 * `logRetain - 1`.
 */
async function buildFileStream(config: LoggingConfig): Promise<Writable> {
  const rotatedFilesToKeep = Math.max(config.logRetain - 1, 0);
  const stream = (await buildRollingStream({
    file: config.logFile,
    frequency: parseRotationFrequency(config.logRotate),
    mkdir: true,
    limit: { count: rotatedFilesToKeep },
  })) as Writable;
  return stream;
}

/**
 * Builds the pino logger (REQ-008): JSON lines to the rolling file
 * under `./logs` and to a second destination simultaneously, via
 * `pino.multistream`. pino writes to stdout by default, which would
 * violate REQ-006 (nothing but MCP protocol frames on stdout), so
 * every destination is explicit here -- the second destination
 * defaults to `process.stderr` but is injectable so unit tests never
 * have to assert against real stderr capture.
 *
 * @param config - The effective logging configuration (`config.ts`).
 * @param secondaryStream - The second multistream destination
 *   (defaults to `process.stderr`; injectable for tests).
 */
export async function createLogger(config: LoggingConfig, secondaryStream: Writable = process.stderr): Promise<Logger> {
  const fileStream = await buildFileStream(config);
  const streams = pino.multistream([{ stream: fileStream }, { stream: secondaryStream }]);
  return pino({ level: config.logLevel }, streams);
}
