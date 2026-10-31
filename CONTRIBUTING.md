# Contributing to biz.dfch.BpmnMcp

This document describes the development setup, the coding conventions,
and the procedures for this repository. The inviolable principles
live in `CONSTITUTION.md`; the rationale and decision history for
every convention live in the implementation Q&A
(`docs/qa/qa-818fac76-96fb-4e3c-acb8-e5520fab5913-*.md`, pairs
0.0210-0.0290 and 1.0070). If this document and a machine config
disagree, the config wins - it is what CI enforces (QA 0.0210).

The project is licensed under the **AGPLv3** license (GNU Affero
General Public License v3.0, only; QA 3.0020). By contributing, you
agree that your contributions will be licensed under the same license
as the project.

---

## 1. Repository layout

The repository is an npm-workspaces monorepo (QA 0.0270), currently a
single component:

- **root**: the private workspaces manifest (`package.json`,
  `workspaces: ["apps/*", "packages/*"]`), the root lock file, shared
  tooling (`.pre-commit-config.yaml`, `.editorconfig`, `.prettierrc`,
  `.github/`), the specification documents under `docs/`, and the
  unrelated Python/`uv` scaffold (left as-is).
- **`apps/mcp-server/`**: the MCP server component (the deployable
  unit): its own `package.json` (`biz.dfch.bpmnmcp`), `src/`, `test/`,
  `tsconfig.json`, `eslint.config.js`, `.bpmnlintrc`, `logging.json`.
- **`packages/`**: shared libraries - empty until code is shared
  between components.

Components in other languages may be added later in their own
top-level directories (the layout is language-agnostic; npm workspaces
manage only the JS/TS components).

---

## 2. Development setup

Prerequisites: Node.js **24** (LTS), npm **11**, `git`, and
`pre-commit` (any install method; `uvx pre-commit` works without a
global install).

```bash
git clone https://github.com/dfch/biz.dfch.BpmnMcp.git
cd biz.dfch.BpmnMcp

npm install            # installs all workspaces (root lock file)
pre-commit install     # one-time, per clone (QA 0.0190)
cp .env.example .env   # only if local overrides are wanted (QA 0.0160)
```

---

## 3. Commands

Run from the repository root (the root manifest delegates to the
workspaces):

```bash
npm run build           # tsc - type-check + compile (QA 0.0030)
npm run lint            # ESLint (QA 0.0220/0.0280)
npm run format          # Prettier --write (QA 0.0280)
npm run format:check    # Prettier --check (QA 0.0280)
npm test                # vitest (QA 0.0060)
npm test -- --coverage  # vitest + @vitest/coverage-v8 (QA 0.0260)
npm run dev             # tsc --watch (QA 0.0050; a source edit triggers an
                         # incremental rebuild without re-running the command)
```

---

## 4. Coding conventions

Machine-enforced; the configs are the source of truth (QA 0.0210):
`.prettierrc` (root, the style), `eslint.config.js` (per component,
the quality rules), `tsconfig.json` (`strict: true`),
`.editorconfig` (root), the vitest configuration (coverage). The
inviolable principles sit in `CONSTITUTION.md`; every convention is
decided and spelled out (options, templates, exemptions, rationale)
in the referenced QA pair. This section is the index, not the
specification (slimmed 2026-10-24, QA 0.0210):

- **License header** (two-line SPDX, `AGPL-3.0-only`): CONSTITUTION
  §1, QA 0.0290 - gate: the vitest drift suite running in
  `npm test`.
- **Braces** (K&R): QA 0.0280 - config: `.prettierrc`.
- **Indentation** (2 spaces, never tabs): QA 0.0230 - config:
  `.prettierrc` + `.editorconfig`.
- **Line width** (120): QA 0.0240/0.0280 - config: `.prettierrc`
  `printWidth`.
- **Cyclomatic complexity** (measured; threshold user-set in
  config): QA 0.0240 - config: `eslint.config.js` `complexity`.
- **Quotes/semicolons/trailing commas**: QA 0.0220/0.0280 - config:
  `.prettierrc`.
- **Naming** (Google TS style): QA 0.0250 - config:
  `eslint.config.js` `naming-convention`.
- **Pre/postconditions**: QA 0.0200/0.0260 - the in-house assertion
  module.
- **Architecture tests** (archunit: no cycles in `src`, no
  production-to-test dependencies, the core-vs-adapter layering):
  CONSTITUTION §4, QA 7.0030 - gate: the vitest architecture suite
  (`apps/mcp-server/test/architecture.test.ts`) running in
  `npm test`.

If this index and a machine config disagree, the config wins - it is
what CI enforces (QA 0.0210).

---

## 5. Logging and telemetry

The server expects to be started with its working directory (`cwd`)
set to the consuming repository's root: every relative path below
(`./docs`, `./logs`) resolves against that working directory, not
against the package's own install location.

- pino writes JSON lines to a rolling file under `./logs` (base name
  `server`, daily rotation by default) **and** to stderr; never to
  stdout - it is the MCP protocol channel (QA 0.0070/0.0140/0.0150,
  REQ-006/REQ-008). `pino-roll`'s actual naming scheme (confirmed by
  the feat-1 interop spike, Task 100.165): with no `dateFormat`
  configured, rotated files are named `<base>.<count>.<ext>` (e.g.
  `server.1.log`, `server.2.log`, ...) - there is no date segment by
  default. The active file plus six rotated files (seven total) are
  kept by default.
- Configuration precedence: real environment > `.env` (local machine
  values, gitignored, loaded via `process.loadEnvFile()` - a missing
  `.env` is not an error) > `logging.json`
  (`apps/mcp-server/logging.json`, committed defaults - a missing file
  is likewise not an error) > built-in defaults (QA 0.0160, REQ-009).
- Logging environment variables (feat-1-bpmn-mcp-scaffold, REQ-008):
  - `BPMN_MCP_LOG_FILE` - the rolling log file's base path (default
    `logs/server`).
  - `BPMN_MCP_LOG_LEVEL` - the minimum pino level (default `info`).
  - `BPMN_MCP_LOG_ROTATE` - the rotation frequency: `daily`, `hourly`,
    or a number of milliseconds (default `daily`).
  - `BPMN_MCP_LOG_RETAIN` - how many files to keep **in total**,
    active file included (default `7`; `pino-roll`'s own `limit.count`
    option means "rotated files in addition to the active file", so
    the server passes `BPMN_MCP_LOG_RETAIN - 1` through to it).
- The documents root (feat-1-bpmn-mcp-scaffold, REQ-010):
  `BPMN_MCP_DOCS_DIR` (default `./docs`) with the `prc` subdirectory
  hardcoded, so BPMN processes live under `<BPMN_MCP_DOCS_DIR>/prc`
  (resolved to an absolute path, reported by the `config` MCP
  resource). Resolving the path never creates a directory.
- Telemetry: OpenTelemetry API from day one (no-op until configured);
  set `OTEL_EXPORTER_OTLP_ENDPOINT` in `.env` to export to a local
  collector (QA 0.0130/0.0170). This feature's `config` MCP resource
  always reports the OTel endpoint state as `"disabled"` - OTel
  instrumentation itself is out of scope for feat-1-bpmn-mcp-scaffold.

---

## 6. Commit messages and pull requests

- Follow [Conventional Commits](https://www.conventionalcommits.org/)
  (family convention, as in biz.dfch.SpecMgr): `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`.
- Keep pull requests focused on a single change; unrelated changes
  should be separate PRs.
- Make sure `npm run lint`, `npm run format:check`, `npm run build`,
  and `npm test` pass locally before opening a pull request; CI runs
  the same gates plus coverage (QA 0.0180).
- Reference the related issue number in the PR description, if one
  exists.

---

## 7. Changing the conventions

1. Change the machine config first (`.prettierrc`,
   `eslint.config.js`, `.editorconfig`, the vitest config) - CI
   enforces it.
2. Update this document to match.
3. Record the decision (question, options considered, choice,
   rationale) in the implementation Q&A under `docs/qa/`, following
   the existing pair style (QA 0.0210).
