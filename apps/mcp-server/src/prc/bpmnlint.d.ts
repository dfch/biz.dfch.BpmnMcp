// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Type declarations for the `bpmnlint` 12.x entry points (feat-19,
 * REQ-003, Task 100.110/Task 100.120).
 *
 * The npm package is CommonJS and ships no TypeScript declarations
 * for its entry points: `exports["."]` (`lib/index.js`) and the
 * subpath `./lib/resolver/node-resolver` carry no `types` condition
 * (only the types-only subpath `./lib/types` does), so the ESM
 * imports have no declarations of their own -- the same gap the
 * neighboring `bpmn-moddle.d.ts` ambient declaration closes.
 *
 * The runtime shapes were verified against the package's `lib` and
 * its internal `@bpmn-io/lint-core` dependency by the feat-19 Task
 * 100.100 interop spike (throwaway project, bpmnlint 12.0.0,
 * bpmn-moddle 10.3.1 -- the exact versions this workspace pins):
 *
 * - `lib/index.js` does `module.exports = { Linter }`, where `Linter`
 *   is `createLinter({ name: 'bpmnlint' })` from `@bpmn-io/lint-core`;
 *   the named export survives Node's CJS-to-ESM interop, so the
 *   component imports it as `import { Linter } from 'bpmnlint'`.
 * - `lib/resolver/node-resolver.js` does `module.exports =
 *   NodeResolver` (the constructor itself), so the component imports
 *   it as the default export of the subpath.
 * - `Linter` lints a parsed moddle tree (not an XML string):
 *   `linter.lint(moddleRoot, config)` returns a promise of the report
 *   map keyed by rule id. The config's `extends` presets (e.g.
 *   `bpmnlint:recommended`) resolve through the `NodeResolver`, which
 *   loads product presets package-relative to `bpmnlint` itself --
 *   never from `process.cwd()`.
 * - An unresolvable `extends` preset or rule makes `lint` throw
 *   synchronously (the resolver throws during configuration
 *   resolution, before any promise is returned) -- the caller must
 *   guard the call with `try`/`catch`, as `src/prc/lint.ts` does.
 */

declare module 'bpmnlint' {
  /** One lint report as a bpmnlint rule produces it (spike-verified). */
  export interface BpmnlintReport {
    /** The BPMN id of the element the report attaches to, when the rule reports one. */
    id?: string;
    /** The rule's report message. */
    message: string;
    /** Additional report fields (the rule's `meta`, the reporting `category`, ...). */
    [key: string]: unknown;
  }

  /** The lint results: the reports of every rule that reported, keyed by rule id. */
  export type BpmnlintResults = Record<string, BpmnlintReport[]>;

  /** A bpmnlint linter configuration (the parsed `.bpmnlintrc` shape). */
  export interface BpmnlintConfig {
    /** The preset(s) this configuration extends (e.g. `bpmnlint:recommended`). */
    extends?: string | string[];
    /** The per-rule settings (rule id to severity or `[severity, options]`). */
    rules?: Record<string, unknown>;
    /** Additional configuration fields (e.g. `moddleExtensions`). */
    [key: string]: unknown;
  }

  /** The options the `Linter` constructor requires. */
  export interface BpmnlintLinterOptions {
    /** The default configuration (the per-call `lint` argument overrides it). */
    config?: BpmnlintConfig;
    /** The rule/preset resolver (required; the component uses the `NodeResolver`). */
    resolver: unknown;
  }

  /**
   * The bpmnlint linter (the runtime value is
   * `createLinter({ name: 'bpmnlint' })` from the package's internal
   * `@bpmn-io/lint-core` dependency).
   */
  export class Linter {
    constructor(options: BpmnlintLinterOptions);

    /**
     * Lints the parsed moddle root element against the configuration.
     *
     * Throws synchronously (it does not return a rejected promise)
     * when the configuration references an unknown `extends` preset
     * or an unknown rule -- see the module header.
     *
     * @param moddleRoot - The parsed document root (a moddle element,
     *   typically `bpmn:Definitions`).
     * @param config - The linter configuration to use (defaults to
     *   the constructor's `config`).
     */
    lint(moddleRoot: unknown, config?: BpmnlintConfig): Promise<BpmnlintResults>;
  }
}

declare module 'bpmnlint/lib/resolver/node-resolver' {
  /**
   * The node module resolver for bpmnlint rule and preset lookups
   * (spike-verified): product rules and presets (`bpmnlint:recommended`,
   * the product rules) resolve package-relative to the `bpmnlint`
   * package itself through a package-scoped `require`; third-party
   * plugin packages resolve through the (by default cwd-scoped)
   * `require`, which the component never exercises (its config
   * extends the product preset only).
   */
  export default class NodeResolver {
    constructor(options?: {
      /** The require used for third-party plugin package lookups (defaults to a cwd-scoped one). */
      require?: NodeRequire;
      /** The require used for the product's own rules/presets (defaults to the package's own). */
      requireLocal?: NodeRequire;
    });

    /** Resolves a rule factory from its package and rule name. */
    resolveRule(pkg: string, ruleName: string): unknown;

    /** Resolves a preset configuration from its package and config name. */
    resolveConfig(pkg: string, configName: string): unknown;
  }
}
