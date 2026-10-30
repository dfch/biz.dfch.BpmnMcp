// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { LoggingConfig } from '../src/config.js';
import { createLogger } from '../src/logging.js';

describe('createLogger destinations (REQ-008)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-logging-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function waitForWrite(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 50));
  }

  it('writes a valid JSON line to the rolling file and to the injected secondary stream', async () => {
    const config: LoggingConfig = {
      logFile: join(tempDir, 'server'),
      logLevel: 'info',
      logRotate: 'daily',
      logRetain: 7,
    };
    const secondary = new PassThrough();
    let secondaryContent = '';
    secondary.on('data', (chunk: Buffer) => {
      secondaryContent += chunk.toString('utf8');
    });

    const logger = await createLogger(config, secondary);
    logger.info({ event: 'test' }, 'hello from the walking skeleton');
    await waitForWrite();

    const files = readdirSync(tempDir);
    expect(files.length).toBeGreaterThan(0);
    const fileContent = readFileSync(join(tempDir, files[0]), 'utf8');
    const fileLine = fileContent.trim().split('\n')[0];
    expect(() => JSON.parse(fileLine)).not.toThrow();
    expect(JSON.parse(fileLine).msg).toBe('hello from the walking skeleton');

    expect(() => JSON.parse(secondaryContent.trim().split('\n')[0])).not.toThrow();
  });

  it('never writes to stdout (pino writes to stdout by default unless given explicit destinations)', async () => {
    const config: LoggingConfig = {
      logFile: join(tempDir, 'server'),
      logLevel: 'info',
      logRotate: 'daily',
      logRetain: 7,
    };
    const secondary = new PassThrough();
    const originalWrite = process.stdout.write.bind(process.stdout);
    let stdoutWasWritten = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process.stdout as any).write = (...args: unknown[]) => {
      stdoutWasWritten = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (originalWrite as any)(...args);
    };

    try {
      const logger = await createLogger(config, secondary);
      logger.info('should not reach stdout');
      await waitForWrite();
    } finally {
      process.stdout.write = originalWrite;
    }

    expect(stdoutWasWritten).toBe(false);
  });

  it('confirms the pino-roll naming scheme: active file + <base>.<count>.log rotated files', async () => {
    const config: LoggingConfig = {
      logFile: join(tempDir, 'server'),
      logLevel: 'info',
      logRotate: '100',
      logRetain: 7,
    };
    const secondary = new PassThrough();
    const logger = await createLogger(config, secondary);
    for (let i = 0; i < 12; i += 1) {
      logger.info({ i }, 'rotation probe');
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const files = readdirSync(tempDir).sort();
    expect(files.length).toBeGreaterThan(0);
    expect(files.every((file) => existsSync(join(tempDir, file)))).toBe(true);
    // Rotated files follow <base>.<count>.log with no date segment,
    // since no dateFormat is configured (Task 100.165's finding).
    const rotated = files.filter((file) => /^server\.\d+\.log$/.test(file));
    expect(rotated.length).toBeGreaterThan(0);
  });
});
