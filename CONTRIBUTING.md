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
npm run dev             # watch mode (QA 0.0050)
```

---

## 4. Coding conventions

Machine-enforced; the configs are the source of truth (QA 0.0210):
`.prettierrc` (root, the style), `eslint.config.js` (per component,
the quality rules), `tsconfig.json` (`strict: true`),
`.editorconfig` (root), the vitest configuration (coverage).

- **License header (SPDX)**: every source file starts with the
  two-line declaration header, in the file type's comment syntax
  (`#` Python/YAML/TOML/INI, `//` JS/TS) (CONSTITUTION principle 1,
  QA 0.0290):

  ```
  # SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
  # SPDX-License-Identifier: AGPL-3.0-only
  ```

  JSON cannot carry comments: `package.json` manifests declare the
  license via the `"license": "AGPL-3.0-only"` field instead, other
  JSON config is exempt. Exempt: `docs/`, the session transcript,
  the root documentation, `LICENSE` itself, and generated files
  (the full list in QA 0.0290). A vitest license-header drift gate
  (runs with `npm test`) fails on any in-scope file without a
  valid header.

- **Braces: K&R** - the opening brace on the same line, per the
  Google TypeScript Style Guide the conventions cite (QA 0.0280).
  Allman was a user preference, recorded in QA 0.0220 and withdrawn
  2026-10-24; Biome (the single-tool alternative) was considered and
  rejected - no cyclomatic-complexity rule (QA 0.0280). Prettier
  emits the style; `eslint-config-prettier` keeps ESLint from
  arguing with it.

- **Indentation: 2 spaces**, never tabs (Prettier `tabWidth: 2` +
  `.editorconfig`) (QA 0.0230).

- **Line width: 120 characters** (Prettier `printWidth: 120`;
  unbreakable lines such as long URLs are left as-is) (QA
  0.0240/0.0280).

- **Cyclomatic complexity**: measured per function by ESLint's
  `complexity` rule (the tool); the effective threshold is a value
  in `eslint.config.js` - first-draft default 10 (the ecosystem's
  common starting value, not a requirement), set or adjust it there
  (QA 0.0240). Refactor, do not waive.

- **Quotes/semicolons**: single quotes, semicolons on, trailing
  commas in multi-line constructs (Prettier `singleQuote: true`,
  `semi: true`, `trailingComma: "all"`) (QA 0.0220/0.0280).

- **Naming** (QA 0.0250, enforced via
  `@typescript-eslint/naming-convention`):

  | Construct | Convention | Example |
  |---|---|---|
  | classes, interfaces, type aliases, enums, enum members | PascalCase | `BpmnCore`, `ToolResult` |
  | functions, methods, variables, parameters, properties | camelCase | `loadDiagram` |
  | module-level constants | UPPER_SNAKE_CASE | `DEFAULT_PORT` |
  | files and directories | kebab-case | `preview-server.ts` |

- **Pre/postconditions**: in-house assertion helpers with TypeScript
  `asserts` signatures; zod validates data at tool/module boundaries
  (QA 0.0200/0.0260).

---

## 5. Logging and telemetry

- pino writes JSON lines to `logs/server.log` (daily rotation, seven
  files kept) **and** to stderr; never to stdout - it is the MCP
  protocol channel (QA 0.0070/0.0140/0.0150).
- Configuration precedence: real environment > `.env` (local machine
  values, gitignored) > `logging.json` (committed defaults) > built-in
  defaults (QA 0.0160).
- Telemetry: OpenTelemetry API from day one (no-op until configured);
  set `OTEL_EXPORTER_OTLP_ENDPOINT` in `.env` to export to a local
  collector (QA 0.0130/0.0170).

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
