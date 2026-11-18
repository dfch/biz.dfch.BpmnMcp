// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import {
  SHEBANG,
  copyRootLicense,
  ensureExecutable,
  ensureShebang,
  preparePublish,
} from '../scripts/prepare-publish.mjs';

/**
 * Unit tests of the `prepack` pipeline (feat-11 REQ-002, Task
 * 100.110): the shebang is idempotent on the build output, the
 * package-directory `LICENSE` is byte-identical to the repository
 * root's, and no source file is ever touched (the license drift gate
 * keeps asserting the SPDX header on lines 0/1 of every in-scope
 * source -- `dist/` is exempt, which is what makes the shebang safe).
 *
 * The tests run against a temporary repository-shaped layout
 * (`<tmp>/LICENSE` + `<tmp>/apps/mcp-server/{src,dist}`) with the
 * build step stubbed, so neither the real `dist/` nor the real
 * `src/` is read or written.
 */

const SPDX_HEADER = [
  '// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH',
  '// SPDX-License-Identifier: AGPL-3.0-only',
];

const LICENSE_TEXT = 'AGPL-3.0 license text (fixture, with a trailing newline)\n';

/** A source file carrying the two-line SPDX header and no shebang. */
const SOURCE_TEXT = `${SPDX_HEADER.join('\n')}\n\nasync function main() {}\n\nmain();\n`;

const ENTRY_TEXT =
  'import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";\n\n// built entry point (fixture)\n';

describe('prepare-publish pipeline (feat-11 REQ-002, Task 100.110)', () => {
  const tempRoots: string[] = [];
  let packageDir: string;
  let rootLicense: string;
  let distEntry: string;
  let sourceEntry: string;

  beforeEach(() => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'bpmnmcp-prepare-'));
    tempRoots.push(tempRoot);
    packageDir = join(tempRoot, 'apps', 'mcp-server');
    mkdirSync(join(packageDir, 'src'), { recursive: true });
    mkdirSync(join(packageDir, 'dist'), { recursive: true });
    rootLicense = join(tempRoot, 'LICENSE');
    distEntry = join(packageDir, 'dist', 'index.js');
    sourceEntry = join(packageDir, 'src', 'index.ts');
    writeFileSync(rootLicense, LICENSE_TEXT);
    writeFileSync(sourceEntry, SOURCE_TEXT);
  });

  afterAll(() => {
    for (const tempRoot of tempRoots) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  describe('ensureShebang (build output only)', () => {
    it('prepends the shebang to a file that lacks it, leaving the rest intact', () => {
      writeFileSync(distEntry, ENTRY_TEXT);

      ensureShebang(distEntry);

      const content = readFileSync(distEntry, 'utf8');
      expect(content).toBe(`${SHEBANG}\n${ENTRY_TEXT}`);
      const lines = content.split('\n');
      expect(lines[0]).toBe(SHEBANG);
      expect(lines[1]).toBe(ENTRY_TEXT.split('\n')[0]);
    });

    it('is idempotent: a second run leaves the file byte-identical (no double shebang)', () => {
      writeFileSync(distEntry, ENTRY_TEXT);

      ensureShebang(distEntry);
      const once = readFileSync(distEntry);
      ensureShebang(distEntry);

      expect(readFileSync(distEntry)).toEqual(once);
      expect(
        readFileSync(distEntry, 'utf8')
          .split('\n')
          .filter((line) => line === SHEBANG),
      ).toHaveLength(1);
    });

    it('leaves an already-shebanged file byte-identical', () => {
      writeFileSync(distEntry, `${SHEBANG}\n${ENTRY_TEXT}`);
      const before = readFileSync(distEntry);

      ensureShebang(distEntry);

      expect(readFileSync(distEntry)).toEqual(before);
    });
  });

  describe('ensureExecutable', () => {
    it('adds the exec bit (user, group, other) and keeps the other mode bits', () => {
      writeFileSync(distEntry, ENTRY_TEXT);
      chmodSync(distEntry, 0o644);

      ensureExecutable(distEntry);

      const mode = statSync(distEntry).mode;
      expect(mode & 0o111).toBe(0o111);
      expect(mode & 0o600).toBe(0o600); // owner read/write kept
      expect(mode & 0o044).toBe(0o044); // group/other read kept
    });
  });

  describe('copyRootLicense', () => {
    it('copies the repository-root LICENSE into the package directory byte-identically', () => {
      copyRootLicense(packageDir);

      expect(readFileSync(join(packageDir, 'LICENSE'))).toEqual(readFileSync(rootLicense));
    });

    it('is stable across re-runs (a second prepack does not drift the copy)', () => {
      copyRootLicense(packageDir);
      const once = readFileSync(join(packageDir, 'LICENSE'));
      copyRootLicense(packageDir);

      expect(readFileSync(join(packageDir, 'LICENSE'))).toEqual(once);
    });

    it('throws when the repository-root LICENSE is missing (the text must travel with the package)', () => {
      rmSync(rootLicense);
      const orphanPackage = join(packageDir, 'orphan'); // its `../..` root has no LICENSE
      mkdirSync(orphanPackage, { recursive: true });

      expect(() => copyRootLicense(orphanPackage)).toThrow(/repository root LICENSE not found/);
      expect(existsSync(rootLicense)).toBe(false);
    });
  });

  describe('preparePublish (the full pipeline, stubbed build)', () => {
    it('shebangs and exec-bits the built entry, copies the LICENSE, and touches no source file', () => {
      writeFileSync(distEntry, ENTRY_TEXT);
      chmodSync(distEntry, 0o644);
      const sourceBefore = readFileSync(sourceEntry);

      preparePublish(packageDir, { build: () => {} });

      // The built entry: shebang on line 0, exec bit set.
      const entryContent = readFileSync(distEntry, 'utf8');
      expect(entryContent.split('\n')[0]).toBe(SHEBANG);
      expect(entryContent).toBe(`${SHEBANG}\n${ENTRY_TEXT}`);
      expect(statSync(distEntry).mode & 0o111).toBe(0o111);
      // The package-directory LICENSE: byte-identical to the root's.
      expect(readFileSync(join(packageDir, 'LICENSE'))).toEqual(readFileSync(rootLicense));
      // The source: byte-unchanged, and its SPDX header intact (the
      // license drift gate's invariant -- the shebang never leaks
      // into `src/`).
      expect(readFileSync(sourceEntry)).toEqual(sourceBefore);
      const sourceLines = readFileSync(sourceEntry, 'utf8').split('\n');
      expect(sourceLines[0]).toBe(SPDX_HEADER[0]);
      expect(sourceLines[1]).toBe(SPDX_HEADER[1]);
    });

    it('stays idempotent across a second full run over the same output', () => {
      writeFileSync(distEntry, ENTRY_TEXT);
      chmodSync(distEntry, 0o644);
      const sourceBefore = readFileSync(sourceEntry);

      preparePublish(packageDir, { build: () => {} });
      const once = readFileSync(distEntry);
      preparePublish(packageDir, { build: () => {} });

      expect(readFileSync(distEntry)).toEqual(once);
      expect(
        readFileSync(distEntry, 'utf8')
          .split('\n')
          .filter((line) => line === SHEBANG),
      ).toHaveLength(1);
      expect(readFileSync(sourceEntry)).toEqual(sourceBefore);
      expect(readFileSync(join(packageDir, 'LICENSE'))).toEqual(readFileSync(rootLicense));
    });
  });
});
