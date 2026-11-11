// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ModdleElement } from 'moddle';
import type { BpmnlintConfig, BpmnlintResults } from 'bpmnlint';
import { Linter } from 'bpmnlint';
import NodeResolver from 'bpmnlint/lib/resolver/node-resolver';
import { PACKAGE_ROOT } from '../package-root.js';
import { isModdleElement, oneLine, walkElements, type BpmnRootElement } from './moddle.js';

/**
 * The bpmnlint validation core (feat-19, REQ-001/REQ-002, Task
 * 100.120): the committed `.bpmnlintrc` load with structured failure,
 * the validation of a parsed moddle tree against a loaded config, and
 * the normalization of the linter's reports to the finding shape the
 * `validate` tool will report (Phase 110).
 *
 * This module owns the `bpmnlint` touch point, the way `moddle.ts`
 * owns `bpmn-moddle`: the rest of the core and the adapter layer never
 * see the library's raw API. All filesystem access (the config read)
 * happens here, keeping the MCP adapters free of `node:fs`
 * (CONSTITUTION §4, QA 7.0030).
 *
 * The config resolves package-relative (REQ-002): `.bpmnlintrc` is
 * committed next to this package's `package.json` and `logging.json`
 * and is found from `PACKAGE_ROOT` -- the directory walk from this
 * module's own location, never `process.cwd()` (the cwd-independence
 * unit leg, ACC-006, pins it). Unlike `logging.json` (where a missing
 * file falls through to defaults), a missing or invalid `.bpmnlintrc`
 * is a structured failure (ACC-005): the config is the single source
 * for the rules, so there is no sensible default to fall back to.
 */

/** The parsed `.bpmnlintrc` (feat-19 REQ-001): the library's config shape. */
export type LintConfig = BpmnlintConfig;

/** One normalized lint finding (the `validate` tool's `findings` element, feat-19 REQ-004). */
export interface LintFinding {
  /** The rule id that reported the finding (e.g. `no-disconnected`). */
  rule: string;
  /**
   * The BPMN id of the element the finding attaches to; absent when
   * the report carries no element id (a process-level finding).
   */
  elementId?: string;
  /** The rule's report message, collapsed to a single line. */
  message: string;
}

/** The structured failure codes the lint module returns (feat-19 ACC-005). */
export type LintErrorCode = 'config-missing' | 'config-invalid' | 'lint-failed';

/** A structured lint error: a code plus a single-line message. */
export interface LintError {
  code: LintErrorCode;
  message: string;
}

/** The `loadLintConfig` success result. */
export interface LintConfigSuccess {
  ok: true;
  /** The resolved absolute path of the loaded `.bpmnlintrc`. */
  path: string;
  /** The parsed config (the `extends` block and any rule overrides). */
  config: LintConfig;
}

/** The `loadLintConfig` failure result (feat-19 ACC-005). */
export interface LintConfigFailure {
  ok: false;
  error: LintError;
}

export type LintConfigResult = LintConfigSuccess | LintConfigFailure;

/** The `lintTree`/`validateTree` success result. */
export interface LintSuccess {
  ok: true;
  /** The normalized findings, in deterministic order (by rule, then element id). */
  findings: LintFinding[];
}

/** The `lintTree`/`validateTree` failure result (feat-19 ACC-005). */
export interface LintFailure {
  ok: false;
  error: LintError;
}

export type LintResult = LintSuccess | LintFailure;

/** The name of the committed bpmnlint config file (feat-19 REQ-001). */
const LINT_CONFIG_FILENAME = '.bpmnlintrc';

/**
 * Loads the committed `.bpmnlintrc` (feat-19 REQ-001/REQ-002/ACC-005)
 * from the package root: a missing file is a structured
 * `config-missing` failure, a file that is not a JSON object (not
 * parseable, an array, a scalar, a directory) is a structured
 * `config-invalid` failure -- nothing is ever thrown, and no default
 * is substituted (the config is the single source for the rules).
 *
 * @param packageRoot - Where to look for `.bpmnlintrc` (defaults to
 *   this package's own root; injectable for tests).
 */
export function loadLintConfig(packageRoot: string = PACKAGE_ROOT): LintConfigResult {
  const path = join(packageRoot, LINT_CONFIG_FILENAME);
  if (!existsSync(path)) {
    return configFailure('config-missing', `bpmnlint config not found at ${path}`);
  }
  let content: string;
  try {
    content = readFileSync(path, 'utf8');
  } catch (cause) {
    return configFailure('config-invalid', `failed to read bpmnlint config at ${path}: ${causeMessage(cause)}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (cause) {
    return configFailure(
      'config-invalid',
      `failed to parse bpmnlint config at ${path} as JSON: ${causeMessage(cause)}`,
    );
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return configFailure('config-invalid', `bpmnlint config at ${path} must be a JSON object`);
  }
  return { ok: true, path, config: parsed as LintConfig };
}

/**
 * Validates a parsed moddle tree against a loaded bpmnlint config
 * (feat-19 Task 100.120): a fresh `Linter` with the node resolver
 * lints the tree and the reports normalize to the finding shape.
 *
 * Before linting, the derived references the rules read are
 * backfilled -- the BPMN 2.0 attributes `incoming`/`outgoing` from
 * every sequence flow's resolved `sourceRef`/`targetRef`, and the
 * `$parent` back-reference on in-process-built trees (Phase 110) --
 * and the original property state is restored in a `finally`; see
 * `backfillDerivedReferences` for the reasons (the connectivity
 * rules misfire on a plain parse and crash on built trees) and the
 * byte-stability guarantee for the caller's tree.
 *
 * An unresolvable config (an unknown `extends` preset or rule) is a
 * structured `lint-failed` result: bpmnlint throws it synchronously
 * from `lint` rather than rejecting, so the call is guarded with
 * `try`/`catch`.
 *
 * @param rootElement - The document root to validate.
 * @param config - The loaded `.bpmnlintrc` content.
 */
export async function lintTree(rootElement: BpmnRootElement, config: LintConfig): Promise<LintResult> {
  const linter = new Linter({ resolver: new NodeResolver() });
  const restore = backfillDerivedReferences(rootElement);
  try {
    const results = await linter.lint(rootElement, config);
    return { ok: true, findings: normalizeFindings(results) };
  } catch (cause) {
    return lintFailure(`bpmnlint failed: ${causeMessage(cause)}`);
  } finally {
    restore();
  }
}

/**
 * Loads the committed `.bpmnlintrc` and validates the tree against it
 * in one step (feat-19 Task 100.120): the composition of
 * `loadLintConfig` and `lintTree`, so the `validate` tool (Phase 110)
 * and the tests share a single entry point. A config load failure
 * short-circuits to the same structured failure result.
 *
 * @param rootElement - The parsed document root to validate.
 * @param packageRoot - Where to look for `.bpmnlintrc` (defaults to
 *   this package's own root; injectable for tests).
 */
export async function validateTree(
  rootElement: BpmnRootElement,
  packageRoot: string = PACKAGE_ROOT,
): Promise<LintResult> {
  const loaded = loadLintConfig(packageRoot);
  if (!loaded.ok) {
    return loaded;
  }
  return lintTree(rootElement, loaded.config);
}

/** The `loadLintConfig` failure result for a code and a (multi-line) message. */
function configFailure(code: LintErrorCode, message: string): LintConfigFailure {
  return { ok: false, error: { code, message: oneLine(message) } };
}

/** The `lintTree` failure result for a (multi-line) message. */
function lintFailure(message: string): LintFailure {
  return { ok: false, error: { code: 'lint-failed', message: oneLine(message) } };
}

/** The original (pre-backfill) state of one flow node's derived attributes. */
interface OriginalFlowRefs {
  incoming?: unknown;
  outgoing?: unknown;
}

/**
 * Backfills the derived references the linter's rules read, and
 * returns a function that restores the original property state
 * (feat-19 Task 100.100 spike finding, extended in Phase 110 for
 * the `$parent` back-reference):
 *
 * (1) The derived BPMN 2.0 attributes `incoming`/`outgoing` on
 * every flow node, from the resolved `sourceRef`/`targetRef` of the
 * tree's sequence flows. BPMN 2.0 declares them as derived values
 * computed from the sequence flows; the XSD carries them as optional
 * child elements, but the diagrams this server reads and writes
 * omit them, and the bpmn-moddle parse therefore leaves the
 * properties unset. The connectivity rules of
 * `bpmnlint:recommended` (`no-disconnected`, `no-implicit-start`,
 * `no-implicit-end`) read them directly -- without the backfill,
 * every connected diagram reports spurious findings (the spike
 * linted the clean fixture with seven false errors on a plain
 * parse, and zero on the backfilled parse). bpmnlint's own
 * rule-test fixtures work around the gap by writing the derived
 * elements into the XML explicitly.
 *
 * (2) The moddle `$parent` back-reference on every child element
 * (first-write-wins, in walk order from the root; the root itself
 * keeps `$parent` undefined). Parsed trees carry it (the parser
 * sets it on every flow node, flow, and DI element), but
 * in-process-built trees (the editing module's `createBpmnElement`
 * + array pushes -- session drafts, and drafts promoted within the
 * same session, whose built tree the store caches without a
 * re-parse) never set it. The same three connectivity rules read
 * `node.$parent` unguarded (`is(node.$parent, 'bpmn:AdHocSubProcess')`);
 * without this pass they crash per element on built trees: the
 * linter aborts that rule's walk on the first exception and records
 * exactly one `rule-error` finding per affected rule (plus a
 * `console.error` to stderr -- the MCP protocol owns stdout only)
 * (Phase 110 verification: a sound seeded draft reported three
 * crash-derived findings, one per affected rule).
 *
 * The backfill is temporary by design: the caller's tree -- in
 * particular the store's cached tree, whose serialization must stay
 * byte-stable across a validation (an `export` right after a
 * `validate` must not re-read out of band) -- is restored exactly:
 * `incoming`/`outgoing` reset to the recorded original value (or
 * deleted when it was absent), `$parent` deleted when it was not an
 * own property, reset to `undefined` when it was. The restore runs
 * in the caller's `finally`; the lint itself is a microtask-only
 * chain (no I/O), so the backfilled state is never observed by any
 * concurrent operation.
 *
 * @param rootElement - The document root to prepare.
 * @returns The restore function (idempotent, side-effect free once
 *   the backfilled state is gone).
 */
function backfillDerivedReferences(rootElement: BpmnRootElement): () => void {
  const sequenceFlows: ModdleElement[] = [];
  // child -> whether `$parent` was an own property before the set
  // (the restore deletes it when it was absent, resets it when present).
  const parentSet = new Map<ModdleElement, boolean>();
  walkElements(
    rootElement,
    (element) => {
      if (element.$type === 'bpmn:SequenceFlow') {
        sequenceFlows.push(element);
      }
    },
    (parent, child) => {
      // First-write-wins: the earliest-visited parent (walk order
      // from the root) matches the parser's container semantics; a
      // child that already carries `$parent` is never touched.
      if (child.$parent !== undefined) {
        return;
      }
      parentSet.set(child, '$parent' in child);
      child.$parent = parent;
    },
  );

  const original = new Map<ModdleElement, OriginalFlowRefs>();
  const record = (node: ModdleElement, property: 'incoming' | 'outgoing'): void => {
    const state = original.get(node) ?? {};
    if (property in state) {
      return;
    }
    state[property] = node[property];
    original.set(node, state);
  };

  for (const flow of sequenceFlows) {
    const endpoints: Array<[unknown, 'incoming' | 'outgoing']> = [
      [flow.sourceRef, 'outgoing'],
      [flow.targetRef, 'incoming'],
    ];
    for (const [node, property] of endpoints) {
      if (!isModdleElement(node)) {
        continue;
      }
      record(node, property);
      const current = Array.isArray(node[property]) ? [...(node[property] as ModdleElement[])] : [];
      if (!current.includes(flow)) {
        current.push(flow);
      }
      node[property] = current;
    }
  }

  return () => {
    for (const [node, state] of original) {
      for (const property of ['incoming', 'outgoing'] as const) {
        if (!(property in state)) {
          continue;
        }
        if (state[property] === undefined) {
          delete node[property];
        } else {
          node[property] = state[property];
        }
      }
    }
    for (const [child, hadOwnProperty] of parentSet) {
      if (hadOwnProperty) {
        child.$parent = undefined;
      } else {
        delete child.$parent;
      }
    }
  };
}

/**
 * Normalizes bpmnlint's report map (reports keyed by rule id) to the
 * finding list (feat-19 Task 100.120, the Design Notes' finding
 * normalization): each report maps to `{ rule, elementId?, message }`
 * -- the rule id, the attached element's BPMN id where the report
 * carries one (a process-level finding carries no `elementId`), and
 * the report message. The list is sorted by rule id, then element id
 * (an absent element id first), so the result is deterministic
 * regardless of the linter's rule resolution order.
 *
 * @param results - The linter's report map.
 */
function normalizeFindings(results: BpmnlintResults): LintFinding[] {
  const findings: LintFinding[] = [];
  for (const [rule, reports] of Object.entries(results)) {
    for (const report of reports) {
      const finding: LintFinding = { rule, message: oneLine(report.message) };
      if (typeof report.id === 'string' && report.id.length > 0) {
        finding.elementId = report.id;
      }
      findings.push(finding);
    }
  }
  return findings.sort(compareFindings);
}

/** The deterministic finding order: by rule id, then element id (absent first). */
function compareFindings(a: LintFinding, b: LintFinding): number {
  if (a.rule !== b.rule) {
    return a.rule < b.rule ? -1 : 1;
  }
  const aId = a.elementId ?? '';
  const bId = b.elementId ?? '';
  if (aId !== bId) {
    return aId < bId ? -1 : 1;
  }
  return 0;
}

/** The single-line message of a cause: its `message` (or its string form). */
function causeMessage(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : String(cause);
  return oneLine(message);
}
