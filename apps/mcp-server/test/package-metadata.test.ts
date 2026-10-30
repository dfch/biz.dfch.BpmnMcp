// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readPackageMetadata } from '../src/package-metadata.js';

describe('readPackageMetadata (REQ-007)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-pkgmeta-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('reads name and version from a valid package.json', () => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ name: 'biz.dfch.bpmnmcp', version: '0.1.0' }));
    const result = readPackageMetadata(tempDir);
    expect(result).toEqual({ name: 'biz.dfch.bpmnmcp', version: '0.1.0' });
  });

  it('reports a malformed package.json with a clear, file-naming error (not a bare SyntaxError)', () => {
    writeFileSync(join(tempDir, 'package.json'), '{ not valid JSON');
    let caught: unknown = null;
    try {
      readPackageMetadata(tempDir);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(Error);
    const error = caught as Error;
    expect(error.message).toContain('failed to parse package.json');
    expect(error.message).toContain(join(tempDir, 'package.json'));
    expect(error.cause).toBeInstanceOf(SyntaxError);
  });
});
