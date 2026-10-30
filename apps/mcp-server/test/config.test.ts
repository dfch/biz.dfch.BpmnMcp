// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadLoggingConfig } from '../src/config.js';
import { loadDotEnv } from '../src/env.js';

describe('loadLoggingConfig precedence (REQ-009)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-config-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('falls back to built-in defaults when logging.json is missing', () => {
    const result = loadLoggingConfig({}, tempDir);
    expect(result).toEqual({
      logFile: 'logs/server',
      logLevel: 'info',
      logRotate: 'daily',
      logRetain: 7,
    });
  });

  it('uses logging.json values when present and no env override exists', () => {
    writeFileSync(
      join(tempDir, 'logging.json'),
      JSON.stringify({ logFile: 'logs/from-file', logLevel: 'debug', logRotate: 'hourly', logRetain: 4 }),
    );
    const result = loadLoggingConfig({}, tempDir);
    expect(result).toEqual({
      logFile: 'logs/from-file',
      logLevel: 'debug',
      logRotate: 'hourly',
      logRetain: 4,
    });
  });

  it('prefers a real environment variable over the same key in logging.json', () => {
    writeFileSync(join(tempDir, 'logging.json'), JSON.stringify({ logLevel: 'debug' }));
    const result = loadLoggingConfig({ BPMN_MCP_LOG_LEVEL: 'warn' }, tempDir);
    expect(result.logLevel).toBe('warn');
  });

  it('parses BPMN_MCP_LOG_RETAIN as a number', () => {
    const result = loadLoggingConfig({ BPMN_MCP_LOG_RETAIN: '3' }, tempDir);
    expect(result.logRetain).toBe(3);
  });

  it('tolerates a logging.json that is present but empty', () => {
    writeFileSync(join(tempDir, 'logging.json'), '{}');
    const result = loadLoggingConfig({}, tempDir);
    expect(result.logLevel).toBe('info');
  });

  it('reports a malformed logging.json with a clear, file-naming error (not a bare SyntaxError)', () => {
    writeFileSync(join(tempDir, 'logging.json'), '{ not valid JSON');
    let caught: unknown = null;
    try {
      loadLoggingConfig({}, tempDir);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(Error);
    const error = caught as Error;
    expect(error.message).toContain('failed to parse logging.json');
    expect(error.message).toContain(join(tempDir, 'logging.json'));
    expect(error.cause).toBeInstanceOf(SyntaxError);
  });
});

describe('.env loading and real-environment precedence (REQ-009)', () => {
  let tempDir: string;
  let originalCwd: string;
  const envKey = 'BPMN_MCP_TEST_PRECEDENCE';

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-dotenv-'));
    process.chdir(tempDir);
    delete process.env[envKey];
  });

  afterEach(() => {
    process.chdir(originalCwd);
    delete process.env[envKey];
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('loads a .env value into process.env when the key is not already set', () => {
    writeFileSync(join(tempDir, '.env'), `${envKey}=from-dotenv\n`);
    loadDotEnv();
    expect(process.env[envKey]).toBe('from-dotenv');
  });

  it('never overrides a variable the real environment already set', () => {
    process.env[envKey] = 'from-real-env';
    writeFileSync(join(tempDir, '.env'), `${envKey}=from-dotenv\n`);
    loadDotEnv();
    expect(process.env[envKey]).toBe('from-real-env');
  });

  it('does not throw and is a no-op when .env is missing', () => {
    expect(() => loadDotEnv()).not.toThrow();
    expect(process.env[envKey]).toBeUndefined();
  });
});
