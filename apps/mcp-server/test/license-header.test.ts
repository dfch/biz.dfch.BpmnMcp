// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Resolve the repository root independent of the test runner's
// working directory (QA 0.0290's enforcement paragraph; REQ-004):
// apps/mcp-server/test/ -> apps/mcp-server/ -> apps/ -> repo root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const COPYRIGHT_LINE = 'SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH';
const IDENTIFIER_LINE = 'SPDX-License-Identifier: AGPL-3.0-only';

// Paths/prefixes exempt from the header check entirely (QA 0.0290, as
// amended by feat-1-bpmn-mcp-scaffold: no `diagrams/` entry - it was
// never a committed path).
const EXEMPT_EXACT = new Set([
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'CONSTITUTION.md',
  'LICENSE',
  'session-feat-0-bpmn-ses_e9db.md',
  'uv.lock',
  'package-lock.json',
  '.python-version',
  '.node-version',
  '.prettierrc',
]);

const EXEMPT_PREFIXES = ['docs/', '.specmgr/', 'node_modules/', 'dist/', 'coverage/'];

function isExempt(path: string): boolean {
  if (EXEMPT_EXACT.has(path)) {
    return true;
  }
  return EXEMPT_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * The comment-syntax rules for the file types this gate covers
 * (REQ-004): Python, YAML, TOML, INI, and now `.gitignore` and
 * `.env.example` use `#`; JavaScript/TypeScript use `//`. `.json`
 * files cannot carry comments - `package.json` is checked separately
 * for its `"license"` field, and every other JSON config (e.g.
 * `apps/mcp-server/logging.json`, once Phase 110 adds it) is exempt
 * from the header for the same reason (QA 0.0290).
 */
const HASH_EXTENSIONS = ['.py', '.toml', '.yml', '.yaml'];
const HASH_EXACT_NAMES = new Set(['.gitignore', '.prettierignore', '.editorconfig', '.env.example']);
const SLASH_SLASH_EXTENSIONS = ['.ts', '.js', '.mjs', '.cjs'];

function commentPrefixFor(path: string): string | null {
  if (path.endsWith('.json')) {
    return null;
  }
  if (HASH_EXACT_NAMES.has(path) || HASH_EXTENSIONS.some((ext) => path.endsWith(ext))) {
    return '#';
  }
  if (SLASH_SLASH_EXTENSIONS.some((ext) => path.endsWith(ext))) {
    return '//';
  }
  return null;
}

function listInScopeFiles(): string[] {
  const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((path) => !isExempt(path));
}

describe('license-header drift gate (REQ-004)', () => {
  const files = listInScopeFiles();

  it('found at least one in-scope file to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const path of files) {
    const isPackageJson = path.endsWith('package.json');
    const prefix = commentPrefixFor(path);

    if (isPackageJson) {
      it(`${path} declares "license": "AGPL-3.0-only"`, () => {
        const content = readFileSync(resolve(REPO_ROOT, path), 'utf8');
        const parsed: { license?: string } = JSON.parse(content);
        expect(parsed.license).toBe('AGPL-3.0-only');
      });
      continue;
    }

    if (prefix === null) {
      // Other JSON config and any unrecognized file type: exempt
      // (QA 0.0290 - JSON cannot carry comments).
      continue;
    }

    it(`${path} carries the two-line SPDX header`, () => {
      const content = readFileSync(resolve(REPO_ROOT, path), 'utf8');
      const lines = content.split(/\r?\n/);
      expect(lines[0]).toBe(`${prefix} ${COPYRIGHT_LINE}`);
      expect(lines[1]).toBe(`${prefix} ${IDENTIFIER_LINE}`);
    });
  }
});
