// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveDocsPrcDir } from '../src/paths.js';

describe('resolveDocsPrcDir (REQ-010)', () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-paths-'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('defaults to ./docs/prc, resolved as an absolute path', () => {
    const result = resolveDocsPrcDir({});
    expect(result).toBe(resolve(tempDir, 'docs', 'prc'));
    expect(result.startsWith(sep) || /^[a-zA-Z]:/.test(result)).toBe(true);
  });

  it('honors BPMN_MCP_DOCS_DIR and appends the hardcoded prc subdirectory', () => {
    const result = resolveDocsPrcDir({ BPMN_MCP_DOCS_DIR: './custom-docs' });
    expect(result).toBe(resolve(tempDir, 'custom-docs', 'prc'));
  });

  it('does not create the directory as a side effect of resolution', () => {
    const result = resolveDocsPrcDir({});
    expect(existsSync(result)).toBe(false);
  });

  it('resolves an absolute BPMN_MCP_DOCS_DIR unchanged, besides appending prc', () => {
    const absoluteDocsDir = join(tempDir, 'absolute-docs');
    const result = resolveDocsPrcDir({ BPMN_MCP_DOCS_DIR: absoluteDocsDir });
    expect(result).toBe(join(absoluteDocsDir, 'prc'));
  });
});
