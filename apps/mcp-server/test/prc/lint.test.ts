// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ModdleElement } from 'moddle';
import { PACKAGE_ROOT } from '../../src/package-root.js';
import { connect, createProcess } from '../../src/prc/editing.js';
import { loadLintConfig, lintTree, validateTree } from '../../src/prc/lint.js';
import { parseBpmn, serializeBpmn } from '../../src/prc/moddle.js';

// Resolve the fixture directory and the committed config independent
// of the test runner's working directory (test/prc/ -> test/ ->
// fixtures/; the config lives at the package root).
const FIXTURES_DIR = resolve(fileURLToPath(new URL('../fixtures/', import.meta.url)));
const ORDER_FIXTURE = join(FIXTURES_DIR, 'order-process.bpmn');
const FLAWED_FIXTURE = join(FIXTURES_DIR, 'flawed-process.bpmn');
const EXPLICIT_FIXTURE = join(FIXTURES_DIR, 'explicit-refs.bpmn');
const COMMITTED_CONFIG = join(PACKAGE_ROOT, '.bpmnlintrc');

/**
 * The pinned findings of the flawed fixture under `bpmnlint:recommended`
 * (feat-19 Task 100.100 spike, bpmnlint 12.0.0): the two intended
 * flaws -- the disconnected `orphan-task` (`no-disconnected`) and the
 * process without an end event (`end-event-required`) -- plus the
 * connectivity consequences the recommended preset derives from the
 * same gaps (`no-implicit-start` on the orphan, `no-implicit-end` on
 * the orphan and on `review`, the chain's dead end). Deterministic
 * order: by rule, then element id (the lint core's sort).
 */
const FLAWED_EXPECTED = [
  { rule: 'end-event-required', elementId: 'flawed-process', message: 'Process is missing end event' },
  { rule: 'no-disconnected', elementId: 'orphan-task', message: 'Element is not connected' },
  { rule: 'no-implicit-end', elementId: 'orphan-task', message: 'Element is an implicit end' },
  { rule: 'no-implicit-end', elementId: 'review', message: 'Element is an implicit end' },
  { rule: 'no-implicit-start', elementId: 'orphan-task', message: 'Element is an implicit start' },
];

describe('the lint core (feat-19 REQ-001/REQ-002, Task 100.120)', () => {
  let tempDir: string;
  let foreignDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'bpmnmcp-lint-'));
    foreignDir = join(tempDir, 'foreign');
    mkdirSync(foreignDir);
    originalCwd = process.cwd();
  });

  afterEach(() => {
    // The cwd-independence legs chdir; always restore (ACC-006).
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe('loadLintConfig (REQ-001, ACC-005)', () => {
    it('loads the committed config from the package root', () => {
      const result = loadLintConfig();
      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: the committed config must load');
      }
      expect(result.path).toBe(COMMITTED_CONFIG);
      expect(result.config.extends).toBe('bpmnlint:recommended');
    });

    it('returns a structured config-missing failure for an absent config, not a throw (ACC-005)', () => {
      const result = loadLintConfig(tempDir);
      expect(result).toEqual({
        ok: false,
        error: { code: 'config-missing', message: `bpmnlint config not found at ${join(tempDir, '.bpmnlintrc')}` },
      });
    });

    it('returns a structured config-invalid failure for malformed JSON, naming the file (ACC-005)', () => {
      writeFileSync(join(tempDir, '.bpmnlintrc'), '{ not json');
      const result = loadLintConfig(tempDir);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: malformed JSON must fail');
      }
      expect(result.error.code).toBe('config-invalid');
      expect(result.error.message).toContain(join(tempDir, '.bpmnlintrc'));
      expect(result.error.message).not.toMatch(/[\r\n]/);
    });

    it('returns a structured config-invalid failure for a non-object config (ACC-005)', () => {
      writeFileSync(join(tempDir, '.bpmnlintrc'), JSON.stringify(['bpmnlint:recommended']));
      const result = loadLintConfig(tempDir);
      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: an array config must fail');
      }
      expect(result.error.code).toBe('config-invalid');
      expect(result.error.message).toContain('must be a JSON object');
    });
  });

  describe('validateTree (REQ-006 test legs)', () => {
    it('reports no findings for the clean reference (order-process.bpmn, the spike verdict)', async () => {
      const tree = (await parseBpmn(readFileSync(ORDER_FIXTURE, 'utf8'))).rootElement;

      const result = await validateTree(tree);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: validating the clean reference must succeed');
      }
      expect(result.findings).toEqual([]);
    });

    it('reports the pinned findings for the flawed fixture (rule ids, element attachment, messages)', async () => {
      const tree = (await parseBpmn(readFileSync(FLAWED_FIXTURE, 'utf8'))).rootElement;

      const result = await validateTree(tree);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: validating the flawed fixture must succeed');
      }
      expect(result.findings).toEqual(FLAWED_EXPECTED);
    });

    it('leaves the tree byte-stable: the serialization is unchanged by the validation', async () => {
      const tree = (await parseBpmn(readFileSync(FLAWED_FIXTURE, 'utf8'))).rootElement;
      const before = await serializeBpmn(tree);

      await validateTree(tree);

      // The backfilled incoming/outgoing references must not leak into
      // the tree: a subsequent export/serialization is byte-identical.
      expect(await serializeBpmn(tree)).toBe(before);
    });

    it('dedupes the explicit derived references and restores the pre-existing arrays exactly (Phase 130 I4)', async () => {
      // The explicit-refs fixture: the clean reference's graph
      // (start -> task -> end), but every flow node carries its
      // derived <incoming>/<outgoing> child elements explicitly
      // (single text refs, which the moddle parse resolves to the
      // process-level flow instances) plus a third sequence flow
      // whose sourceRef/targetRef do not resolve (raw string refs in
      // the XML, unresolvable after the parse) so the backfill's
      // endpoint-skip branch runs.
      const explicitXml = readFileSync(EXPLICIT_FIXTURE, 'utf8');
      // The semantically identical implicit-refs diagram: the same
      // XML without the explicit <incoming>/<outgoing> lines.
      const implicitXml = explicitXml
        .split('\n')
        .filter((line) => !/<(bpmn:)?(incoming|outgoing)>/.test(line))
        .join('\n');

      const explicitTree = (await parseBpmn(explicitXml)).rootElement;
      const implicitTree = (await parseBpmn(implicitXml)).rootElement;
      const process = explicitTree.rootElements.find(
        (element: ModdleElement) => element.$type === 'bpmn:Process',
      ) as ModdleElement;
      const byId = (id: string) => process.flowElements.find((element: ModdleElement) => element.id === id);
      const start = byId('start-event');
      const task = byId('review-task');
      const end = byId('end-event');
      const dangling = byId('flow-dangling');

      // The explicit text refs resolved to the pre-existing arrays,
      // and the dangling flow's refs stayed unresolvable (the
      // skip-branch precondition).
      expect(start.outgoing?.[0].id).toBe('flow-1');
      expect(task.incoming?.[0].id).toBe('flow-1');
      expect(task.outgoing?.[0].id).toBe('flow-2');
      expect(end.incoming?.[0].id).toBe('flow-2');
      expect(dangling.sourceRef).toBeUndefined();
      expect(dangling.targetRef).toBeUndefined();
      const startOutgoingBefore = start.outgoing;
      const taskIncomingBefore = task.incoming;
      const taskOutgoingBefore = task.outgoing;
      const endIncomingBefore = end.incoming;
      const before = await serializeBpmn(explicitTree);

      const explicitResult = await validateTree(explicitTree);
      const implicitResult = await validateTree(implicitTree);

      expect(explicitResult.ok).toBe(true);
      if (!explicitResult.ok) {
        throw new Error('unreachable: validating the explicit-refs fixture must succeed');
      }
      expect(implicitResult.ok).toBe(true);
      if (!implicitResult.ok) {
        throw new Error('unreachable: validating the implicit-refs diagram must succeed');
      }
      // The same findings as the semantically identical implicit-refs
      // diagram (no doubling of the derived refs, no spurious
      // connectivity findings) -- and lint-clean.
      expect(explicitResult.findings).toEqual(implicitResult.findings);
      expect(explicitResult.findings).toEqual([]);

      // The pre-existing explicit arrays were restored exactly
      // (reference identity: the backfill's dedupe left them alone
      // and the restore put the originals back), never doubled.
      expect(start.outgoing).toBe(startOutgoingBefore);
      expect(task.incoming).toBe(taskIncomingBefore);
      expect(task.outgoing).toBe(taskOutgoingBefore);
      expect(end.incoming).toBe(endIncomingBefore);
      expect(start.outgoing).toHaveLength(1);
      expect(task.incoming).toHaveLength(1);
      expect(task.outgoing).toHaveLength(1);
      expect(end.incoming).toHaveLength(1);

      // The serialization stays byte-identical before/after.
      expect(await serializeBpmn(explicitTree)).toBe(before);
    });

    it('reports no findings for a sound in-process-built draft (the $parent backfill, Phase 110)', async () => {
      // Built in-process (no file parse) with a sound start -> task ->
      // end wiring and every element named. Before the $parent
      // backfill, the connectivity rules crashed per element on the
      // unset back-reference and bpmnlint recorded the TypeError as a
      // finding -- this leg pins the zero-finding result instead.
      const created = createProcess('Sound Draft', [
        { type: 'start-event', name: 'Begin' },
        { type: 'task', name: 'Work' },
        { type: 'end-event', name: 'Done' },
      ]);
      expect(created.ok).toBe(true);
      if (!created.ok) {
        throw new Error('unreachable: the sound draft must build');
      }
      const tree = created.tree;
      const wired = connect(tree, { sourceId: 'startEvent_1', targetId: 'task_1' });
      expect(wired.ok).toBe(true);
      const wiredEnd = connect(tree, { sourceId: 'task_1', targetId: 'endEvent_1' });
      expect(wiredEnd.ok).toBe(true);
      const before = await serializeBpmn(tree);

      const result = await validateTree(tree);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: validating the sound draft must succeed');
      }
      expect(result.findings).toEqual([]);
      // The backfill's restore leaves the built tree byte-stable too:
      // neither the incoming/outgoing nor the $parent state leaks into
      // a subsequent serialization.
      expect(await serializeBpmn(tree)).toBe(before);
    });

    it('returns the config-missing failure through validateTree, not a throw (ACC-005)', async () => {
      const tree = (await parseBpmn(readFileSync(ORDER_FIXTURE, 'utf8'))).rootElement;

      const result = await validateTree(tree, tempDir);

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: a missing config must fail');
      }
      expect(result.error.code).toBe('config-missing');
    });

    it('returns a structured lint-failed failure for an unresolvable extends, not a throw (ACC-005)', async () => {
      const tree = (await parseBpmn(readFileSync(ORDER_FIXTURE, 'utf8'))).rootElement;

      const result = await lintTree(tree, { extends: 'bpmnlint:does-not-exist' });

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error('unreachable: an unknown preset must fail');
      }
      expect(result.error.code).toBe('lint-failed');
      expect(result.error.message).toContain('does-not-exist');
      expect(result.error.message).not.toMatch(/[\r\n]/);
    });
  });

  describe('cwd independence (REQ-002, ACC-006)', () => {
    it('resolves the committed config identically from a foreign working directory', () => {
      process.chdir(tempDir);

      const fromForeignCwd = loadLintConfig();
      const fromPackageRoot = loadLintConfig(PACKAGE_ROOT);

      expect(fromForeignCwd.ok).toBe(true);
      if (!fromForeignCwd.ok) {
        throw new Error('unreachable: the committed config must load from a foreign cwd');
      }
      expect(fromPackageRoot.ok).toBe(true);
      if (!fromPackageRoot.ok) {
        throw new Error('unreachable: the committed config must load');
      }
      // The same package-root-based path and the same parsed content.
      expect(fromForeignCwd.path).toBe(join(PACKAGE_ROOT, '.bpmnlintrc'));
      expect(fromForeignCwd.path).toBe(fromPackageRoot.path);
      expect(fromForeignCwd.config).toEqual(fromPackageRoot.config);
      expect(fromForeignCwd.config.extends).toBe('bpmnlint:recommended');
    });

    it('validates the fixtures with the pinned findings from a foreign working directory', async () => {
      process.chdir(foreignDir);
      const tree = (await parseBpmn(readFileSync(FLAWED_FIXTURE, 'utf8'))).rootElement;

      const result = await validateTree(tree);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error('unreachable: validating from a foreign cwd must succeed');
      }
      expect(result.findings).toEqual(FLAWED_EXPECTED);
    });
  });
});
