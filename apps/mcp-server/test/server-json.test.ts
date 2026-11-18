// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Bidirectional drift guard between the repository-root `server.json`'s
 * `environmentVariables` and the environment variables the code actually
 * reads in `src/` (feat-11 REQ-005/REQ-006, ACC-005) -- the npm/vitest
 * analog of the sibling repo biz.dfch.SpecMgr's `tests/test_server_json.py`
 * doctrine: a line-regex scan, bidirectional set equality whose failure
 * messages name the specific missing (read in `src/`, absent from the
 * manifest) and extra (in the manifest, never read in `src/`) entries,
 * structural invariants, and negative fixtures on synthetic trees.
 *
 * Vendored schema (Design Notes "Offline validation"): the fixture
 * `test/fixtures/server.schema.json` is a byte-true copy of
 * https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json
 * fetched 2026-11-17 (JSON Schema draft-07; the live document's `$id`
 * equals that URL). The guard validates against the fixture only -- the
 * gate never fetches from static.modelcontextprotocol.io -- and pins the
 * fixture's `$id` to the source URL, so a swapped or differently re-fetched
 * copy fails. ajv (classic, draft-07-capable) runs with `strict: false`:
 * the schema is a third-party artifact used to validate data, not to audit
 * the schema itself.
 *
 * Scan design: a line-regex scan over the source text of every `.ts`
 * file under `src/` with
 * the comment and string-literal regions blanked -- not a full parser (the
 * plan pins the line-regex design, with tightening as the sanctioned remedy
 * for false positives; this blanking is that tightening, pinned by the
 * negative fixtures below). The blanker is a small character state machine
 * (code, line comment, block comment, string with the three delimiters,
 * escape-aware), so `//` and `/*` inside string literals (the
 * `http://...` URLs in `prc/editing.ts` and `preview/preview-server.ts`)
 * and multi-line template literals never start a comment, and the JSDoc
 * prose mentioning `BPMN_MCP_DOCS_DIR` in `paths.ts`, `package-root.ts`,
 * and `config.ts` never reaches the name net. A code line that mentions a
 * `BPMN_MCP_*` name without reading it (an object-literal key, a constant
 * name) is a known accepted limitation: no such line exists in the corpus,
 * and one would fail the set equality visibly, naming the entry, if
 * introduced. Regex literals are not special-cased (none in the corpus
 * carries a `BPMN_MCP_*` name).
 *
 * Read-site net: every `BPMN_MCP_[A-Z0-9_]+` occurrence in the blanked
 * code counts as a read site (the corpus reads every variable through a
 * property access on an injected `env` object).
 *
 * Default-presence classifier (line-anchored; a read line counts as
 * default-bearing iff the name occurs in one of the three shapes):
 *   1. nullish-coalescing fallback -- `paths.ts` (`BPMN_MCP_DOCS_DIR`):
 *        `env.NAME ?? fallback`
 *   2. guarded parse, the default applied downstream by the returned
 *      object's `??` chain -- pinned explicitly for `BPMN_MCP_LOG_RETAIN`
 *      (`config.ts`):
 *        `env.NAME !== undefined ? Number(env.NAME) : undefined`
 *   3. explicit fallback call -- `config.ts` (the logging trio):
 *        `resolveSetting(env.NAME, fileValue, builtInFallback)`
 * Any other code line naming the variable is a bare read (no default). A
 * name has a code-side default iff at least one of its read lines matches
 * one of the three shapes; the structural invariant pins `default` present
 * on a manifest entry iff the code-side default is present (REQ-006).
 */

// ajv is CJS (no `exports` map): the named class import is the NodeNext-safe
// form here (the build sets `module.exports.Ajv = Ajv`, which Node's CJS
// named-export detection resolves; the default import instead types as the
// module namespace under `verbatimModuleSyntax`).
import { Ajv, type AnySchemaObject } from 'ajv';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Resolve the repository root independent of the test runner's working
// directory (the same convention as `license-header.test.ts`):
// apps/mcp-server/test/ -> apps/mcp-server/ -> apps/ -> repo root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const APP_DIR = join(REPO_ROOT, 'apps', 'mcp-server');
const SERVER_JSON_PATH = join(REPO_ROOT, 'server.json');
const APP_PACKAGE_JSON_PATH = join(APP_DIR, 'package.json');
const SRC_DIR = join(APP_DIR, 'src');
const SCHEMA_FIXTURE_PATH = join(APP_DIR, 'test', 'fixtures', 'server.schema.json');
const SCHEMA_SOURCE_URL = 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json';

// The corpus the guard pins (REQ-006): exactly the five variables the
// server reads, all of them default-bearing (code-point sort order, as the
// assertion compares against a sorted key list).
const EXPECTED_CORPUS = [
  'BPMN_MCP_DOCS_DIR',
  'BPMN_MCP_LOG_FILE',
  'BPMN_MCP_LOG_LEVEL',
  'BPMN_MCP_LOG_RETAIN',
  'BPMN_MCP_LOG_ROTATE',
];

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function parseJson(path: string): Json {
  return JSON.parse(readFileSync(path, 'utf8')) as Json;
}

function asRecord(value: Json, label: string): Record<string, Json> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`server.json: ${label} must be a JSON object`);
  }
  return value;
}

function asArray(value: Json, label: string): Json[] {
  if (!Array.isArray(value)) {
    throw new Error(`server.json: ${label} must be a JSON array`);
  }
  return value;
}

function asString(value: Json, label: string): string {
  if (typeof value !== 'string') {
    throw new Error(`server.json: ${label} must be a string`);
  }
  return value;
}

// ---------------------------------------------------------------------------
// The blanker: comment- and string-region removal, character state machine.
// ---------------------------------------------------------------------------

type LexerState = 'code' | 'line-comment' | 'block-comment' | 'string';

interface Lexer {
  state: LexerState;
  quote: string;
}

function openString(lexer: Lexer, ch: string, out: string[]): void {
  lexer.state = 'string';
  lexer.quote = ch;
  out.push(ch);
}

function lexCode(lexer: Lexer, ch: string, next: string, out: string[]): void {
  if (ch === "'" || ch === '"' || ch === '`') {
    openString(lexer, ch, out);
    return;
  }
  if (ch === '/' && next === '/') {
    lexer.state = 'line-comment';
    out.push('  ');
    return;
  }
  if (ch === '/' && next === '*') {
    lexer.state = 'block-comment';
    out.push('  ');
    return;
  }
  out.push(ch);
}

function lexLineComment(lexer: Lexer, ch: string, out: string[]): void {
  if (ch === '\n') {
    lexer.state = 'code';
    out.push(ch);
    return;
  }
  out.push(' ');
}

function lexBlockComment(lexer: Lexer, ch: string, next: string, out: string[]): void {
  if (ch === '*' && next === '/') {
    lexer.state = 'code';
    out.push('  ');
    return;
  }
  out.push(ch === '\n' ? '\n' : ' ');
}

function lexString(lexer: Lexer, ch: string, out: string[]): void {
  if (ch === lexer.quote) {
    lexer.state = 'code';
    out.push(ch);
    return;
  }
  out.push(ch === '\n' ? '\n' : ' ');
}

/**
 * Replaces every non-code region (line comments, block comments, and the
 * contents of the three string-literal forms, escape-aware) with spaces,
 * keeping the newlines (and thus the line numbers) intact.
 */
function blankNonCode(source: string): string {
  const lexer: Lexer = { state: 'code', quote: '' };
  const out: string[] = [];
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (lexer.state === 'string' && ch === '\\') {
      out.push('  ');
      i += 1;
      continue;
    }
    if (lexer.state === 'code') {
      lexCode(lexer, ch, source[i + 1] ?? '', out);
    } else if (lexer.state === 'line-comment') {
      lexLineComment(lexer, ch, out);
    } else if (lexer.state === 'block-comment') {
      lexBlockComment(lexer, ch, source[i + 1] ?? '', out);
    } else {
      lexString(lexer, ch, out);
    }
  }
  return out.join('');
}

// ---------------------------------------------------------------------------
// The scanner and the default-presence classifier.
// ---------------------------------------------------------------------------

const NAME_NET = /BPMN_MCP_[A-Z0-9_]+/g;

function listTypeScriptFiles(dir: string): string[] {
  const result: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listTypeScriptFiles(path));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      result.push(path);
    }
  }
  return result.sort();
}

/**
 * Scans `srcDir` for `BPMN_MCP_*` read sites (the name net over the blanked
 * code). Returns name -> the blanked, trimmed read lines, in file order.
 */
function scanEnvVarReadSites(srcDir: string): Map<string, string[]> {
  const sites = new Map<string, string[]>();
  for (const file of listTypeScriptFiles(srcDir)) {
    const blanked = blankNonCode(readFileSync(file, 'utf8'));
    for (const line of blanked.split('\n')) {
      for (const name of new Set(line.match(NAME_NET) ?? [])) {
        const lines = sites.get(name) ?? [];
        lines.push(line.trim());
        sites.set(name, lines);
      }
    }
  }
  return sites;
}

/** The three default-bearing read shapes for one name (see the header). */
function defaultShapesFor(name: string): { nullish: RegExp; guardedParse: RegExp; fallbackCall: RegExp } {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    nullish: new RegExp(`\\b${escaped}\\s*\\?\\?`),
    guardedParse: new RegExp(`\\b${escaped}\\s*!==?\\s*undefined\\s*\\?`),
    fallbackCall: new RegExp(`resolveSetting\\s*\\(\\s*env\\s*\\.\\s*${escaped}\\b`),
  };
}

/** A name is read with a default iff at least one of its read lines matches a shape. */
function codeHasDefault(
  lines: string[],
  shapes: { nullish: RegExp; guardedParse: RegExp; fallbackCall: RegExp },
): boolean {
  return lines.some(
    (line) => shapes.nullish.test(line) || shapes.guardedParse.test(line) || shapes.fallbackCall.test(line),
  );
}

// ---------------------------------------------------------------------------
// The manifest side: accessors and the shared assertion functions (the
// negative legs below run these same functions on synthetic inputs).
// ---------------------------------------------------------------------------

interface ManifestEntry {
  name: string;
  hasDefault: boolean;
  raw: Record<string, Json>;
}

function firstPackage(manifest: Json): Record<string, Json> {
  const root = asRecord(manifest, 'the manifest root');
  const packages = asArray(root['packages'], 'packages');
  if (packages.length < 1) {
    throw new Error('server.json must carry at least one package');
  }
  return asRecord(packages[0], 'packages[0]');
}

function manifestEntries(manifest: Json): ManifestEntry[] {
  const first = firstPackage(manifest);
  const variables = asArray(first['environmentVariables'], 'packages[0].environmentVariables');
  return variables.map((variable) => {
    const raw = asRecord(variable, 'an environmentVariables entry');
    const name = typeof raw['name'] === 'string' ? raw['name'].trim() : '';
    return { name, hasDefault: 'default' in raw, raw };
  });
}

/**
 * REQ-006 set equality in both directions; a failure names the specific
 * missing (read in `src/`, absent from the manifest) and extra (in the
 * manifest, never read in `src/`) entries.
 */
function checkSetEquality(entries: ManifestEntry[], sites: Map<string, string[]>): void {
  const manifestNames = new Set(entries.map((entry) => entry.name).filter((name) => name.length > 0));
  const sourceNames = new Set(sites.keys());
  const missingFromManifest = [...sourceNames].filter((name) => !manifestNames.has(name)).sort();
  const extraInManifest = [...manifestNames].filter((name) => !sourceNames.has(name)).sort();
  if (missingFromManifest.length > 0 || extraInManifest.length > 0) {
    throw new Error(
      `server.json's environmentVariables drifted from the BPMN_MCP_* read sites in src/ (feat-11 REQ-006): ` +
        `read in src/ but missing from the manifest: [${missingFromManifest.join(', ')}]; ` +
        `listed in the manifest but never read in src/: [${extraInManifest.join(', ')}]`,
    );
  }
}

/** REQ-006 structural invariant: usable, unique `name`s. */
function checkUniqueNames(entries: ManifestEntry[]): void {
  const malformed = entries.filter((entry) => entry.name.length === 0).map((entry) => JSON.stringify(entry.raw));
  const counts = new Map<string, number>();
  for (const entry of entries) {
    if (entry.name.length > 0) {
      counts.set(entry.name, (counts.get(entry.name) ?? 0) + 1);
    }
  }
  const duplicates = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([name]) => name)
    .sort();
  if (malformed.length > 0 || duplicates.length > 0) {
    throw new Error(
      `server.json environmentVariables names are not usable and unique: ` +
        `entries without a usable name: [${malformed.join('; ')}]; duplicate names: [${duplicates.join(', ')}]`,
    );
  }
}

/** REQ-006 structural invariant: every entry carries a non-empty `description`. */
function checkDescriptions(entries: ManifestEntry[]): void {
  const offenders = entries
    .filter((entry) => {
      const description = entry.raw['description'];
      return typeof description !== 'string' || description.trim().length === 0;
    })
    .map((entry) => (entry.name.length > 0 ? entry.name : '<no name>'));
  if (offenders.length > 0) {
    throw new Error(`environmentVariables entries with a missing or empty description: [${offenders.join(', ')}]`);
  }
}

/**
 * REQ-006 structural invariant: `default` present on an entry iff the code
 * reads the variable with a default (the three classifier shapes).
 */
function checkDefaultPresence(entries: ManifestEntry[], sites: Map<string, string[]>): void {
  const drift: string[] = [];
  for (const entry of entries) {
    if (entry.name.length === 0) {
      continue;
    }
    const lines = sites.get(entry.name);
    const codeDefault = lines !== undefined && codeHasDefault(lines, defaultShapesFor(entry.name));
    if (entry.hasDefault !== codeDefault) {
      drift.push(`${entry.name} (manifest default: ${entry.hasDefault}, code-side default: ${codeDefault})`);
    }
  }
  if (drift.length > 0) {
    throw new Error(
      `default presence drifted between server.json and the code-side read classification: ${drift.join('; ')}`,
    );
  }
}

/** A synthetic manifest entry for the negative legs. */
function syntheticEntry(name: string, withDefault: boolean): ManifestEntry {
  const raw: Record<string, Json> = { name, description: `Synthetic entry for ${name}.` };
  if (withDefault) {
    raw['default'] = 'synthetic-default';
  }
  return { name, hasDefault: withDefault, raw };
}

// ---------------------------------------------------------------------------
// The guard itself.
// ---------------------------------------------------------------------------

describe('server.json MCP registry manifest (feat-11 REQ-005/REQ-006, ACC-005)', () => {
  describe('schema and package equality (REQ-005)', () => {
    it('validates against the vendored 2025-12-11 schema (offline; the fixture $id pins the source URL)', () => {
      const schema = parseJson(SCHEMA_FIXTURE_PATH);
      // The fixture's `$id` must equal the source URL: a swapped or
      // differently re-fetched copy of the schema fails here.
      expect(asString(asRecord(schema, 'the schema fixture')['$id'], 'the fixture $id')).toBe(SCHEMA_SOURCE_URL);
      const manifest = parseJson(SERVER_JSON_PATH);
      const root = asRecord(manifest, 'server.json');
      expect(asString(root['$schema'], 'server.json "$schema"')).toBe(SCHEMA_SOURCE_URL);
      // `strict: false`: the schema is a third-party artifact used to
      // validate data, not audited for strict-mode schema hygiene.
      const validate = new Ajv({ allErrors: true, strict: false, logger: false }).compile(
        schema as unknown as AnySchemaObject,
      );
      if (!validate(manifest)) {
        throw new Error(`server.json failed schema validation: ${JSON.stringify(validate.errors, null, 2)}`);
      }
    });

    it('packages[0].identifier and both versions equal apps/mcp-server/package.json', () => {
      const app = asRecord(parseJson(APP_PACKAGE_JSON_PATH), 'apps/mcp-server/package.json');
      const appName = asString(app['name'], 'package.json "name"');
      const appVersion = asString(app['version'], 'package.json "version"');
      const manifest = parseJson(SERVER_JSON_PATH);
      const root = asRecord(manifest, 'server.json');
      const first = firstPackage(manifest);
      expect(root['version']).toBe(appVersion);
      expect(first['identifier']).toBe(appName);
      expect(first['version']).toBe(appVersion);
    });
  });

  describe('env-var drift against src/ (REQ-006)', () => {
    let sites: Map<string, string[]>;
    let entries: ManifestEntry[];

    beforeAll(() => {
      sites = scanEnvVarReadSites(SRC_DIR);
      entries = manifestEntries(parseJson(SERVER_JSON_PATH));
    });

    it('the corpus reads exactly the five BPMN_MCP_* variables (JSDoc prose is not a read site)', () => {
      expect([...sites.keys()].sort()).toEqual(EXPECTED_CORPUS);
    });

    it('every corpus read is default-bearing (pins the three classifier shapes, incl. the LOG_RETAIN parse shape)', () => {
      const offenders = [...sites.keys()].filter(
        (name) => !codeHasDefault(sites.get(name) ?? [], defaultShapesFor(name)),
      );
      expect(offenders).toEqual([]);
    });

    it('set equality holds in both directions (read sites <-> manifest entries)', () => {
      checkSetEquality(entries, sites);
    });

    it('the manifest names are unique', () => {
      checkUniqueNames(entries);
    });

    it('the manifest descriptions are non-empty', () => {
      checkDescriptions(entries);
    });

    it('default presence matches the code-side classification', () => {
      checkDefaultPresence(entries, sites);
    });
  });

  describe('negative legs (synthetic fixture trees, sibling doctrine)', () => {
    let tempRoot: string;

    beforeAll(() => {
      tempRoot = mkdtempSync(join(tmpdir(), 'bpmnmcp-server-json-'));
    });

    afterAll(() => {
      rmSync(tempRoot, { recursive: true, force: true });
    });

    /** Writes one synthetic `src/` tree under the temp root and returns its `src` dir. */
    function writeSyntheticSource(caseName: string, source: string): string {
      const srcDir = join(tempRoot, caseName, 'src');
      mkdirSync(srcDir, { recursive: true });
      writeFileSync(join(srcDir, 'fake.ts'), source, 'utf8');
      return srcDir;
    }

    it('fails when a read site is missing from the manifest (naming it)', () => {
      const srcDir = writeSyntheticSource(
        'missing-from-manifest',
        "const value = env.BPMN_MCP_MISSING_VAR ?? 'fallback';\n",
      );
      const sites = scanEnvVarReadSites(srcDir);
      const entries = [syntheticEntry('BPMN_MCP_UNRELATED_VAR', true)];

      expect(() => checkSetEquality(entries, sites)).toThrow(
        'read in src/ but missing from the manifest: [BPMN_MCP_MISSING_VAR]',
      );
    });

    it('fails when a manifest entry is never read in src/ (naming it)', () => {
      const srcDir = writeSyntheticSource('extra-in-manifest', "const value = env.BPMN_MCP_REAL_VAR ?? 'fallback';\n");
      const sites = scanEnvVarReadSites(srcDir);
      const entries = [syntheticEntry('BPMN_MCP_REAL_VAR', true), syntheticEntry('BPMN_MCP_GHOST_VAR', true)];

      expect(() => checkSetEquality(entries, sites)).toThrow(
        'listed in the manifest but never read in src/: [BPMN_MCP_GHOST_VAR]',
      );
    });

    it('fails when a bare read (no default shape) meets a manifest default', () => {
      const srcDir = writeSyntheticSource('bare-read', 'const value = env.BPMN_MCP_BARE_VAR;\n');
      const sites = scanEnvVarReadSites(srcDir);
      const entries = [syntheticEntry('BPMN_MCP_BARE_VAR', true)];

      expect(() => checkSetEquality(entries, sites)).not.toThrow();
      expect(() => checkDefaultPresence(entries, sites)).toThrow(
        'BPMN_MCP_BARE_VAR (manifest default: true, code-side default: false)',
      );
    });

    it('fails when a default-bearing read meets a manifest entry without a default', () => {
      const srcDir = writeSyntheticSource(
        'defaultless-manifest',
        "const value = env.BPMN_MCP_DEFAULTED_VAR ?? 'fallback';\n",
      );
      const sites = scanEnvVarReadSites(srcDir);
      const entries = [syntheticEntry('BPMN_MCP_DEFAULTED_VAR', false)];

      expect(() => checkSetEquality(entries, sites)).not.toThrow();
      expect(() => checkDefaultPresence(entries, sites)).toThrow(
        'BPMN_MCP_DEFAULTED_VAR (manifest default: false, code-side default: true)',
      );
    });

    it('fails on duplicate manifest names (naming them)', () => {
      const entries = [syntheticEntry('BPMN_MCP_DUP_VAR', true), syntheticEntry('BPMN_MCP_DUP_VAR', true)];

      expect(() => checkUniqueNames(entries)).toThrow('duplicate names: [BPMN_MCP_DUP_VAR]');
    });

    it('does not report JSDoc prose, comment mentions, or quoted read shapes (the blanking pin)', () => {
      const srcDir = writeSyntheticSource(
        'prose',
        [
          '/**',
          ' * Prose naming `BPMN_MCP_PROSE_VAR` the way the corpus JSDoc does.',
          ' *',
          " * const value = env.BPMN_MCP_QUOTED_VAR ?? 'fallback';",
          ' */',
          '// A line comment mentioning BPMN_MCP_COMMENT_VAR.',
          "const value = env.BPMN_MCP_REAL_VAR ?? 'fallback';",
          '',
        ].join('\n'),
      );
      const sites = scanEnvVarReadSites(srcDir);

      expect([...sites.keys()]).toEqual(['BPMN_MCP_REAL_VAR']);
      expect(codeHasDefault(sites.get('BPMN_MCP_REAL_VAR') ?? [], defaultShapesFor('BPMN_MCP_REAL_VAR'))).toBe(true);
    });
  });
});
