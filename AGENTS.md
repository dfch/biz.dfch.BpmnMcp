# biz.dfch.BpmnMcp — Agent Instructions

## What this project is

A Model Context Protocol (MCP) server that lets an AI agent and a human
create, change, import, export, validate, and parse BPMN 2.0 process
diagrams. It must be Free and Open Source Software (FOSS) and must run
entirely locally / on-premises, with no mandatory cloud dependency.

## Start here

Before writing any code, read the specification artifacts in this
repository. They are standard Markdown files with YAML frontmatter
(the `specmgr` document format — plain-readable even without specmgr
tooling configured in this repo), with filenames starting with `dec-`,
`req-`, or `qa-`. Locate them with a repository-wide search for those
prefixes if they are not in an obvious `docs/` folder.

- **1 constitution** (`CONSTITUTION.md`): the inviolable principles
  (AGPL-3.0-only licensing with a two-line SPDX header in every
  source file, FOSS + local-only, the machine-gate culture). It
  outranks every other document here where they conflict.
- **1 decision record** (`dec-*.md`): the chosen architecture and why,
  including the options that were rejected and why.
- **10 requirement documents** (`req-*.md`): one testable requirement
  each (FOSS, local-only, create, change, import, export, validate,
  parse, MCP exposure, browser preview).
- **1 research Q&A document** (`qa-*.md`, 2026-10-22): the full
  research/elicitation record — the BPMN tooling landscape that was
  surveyed, why both bpmn-moddle and bpmnlint are needed, the
  MCP-vs-OpenCode-plugin tradeoff, the Python-vs-Node.js resolution,
  and the bpmn-js licensing note.
- **1 implementation Q&A document** (`qa-*.md`, 2026-10-23): the
  first-draft implementation decisions for GitHub issue #1 — the seven
  MCP tools (create, change, import, export, validate, parse,
  preview), the file-backed source of truth under `docs/prc/`
  (`BPMN_MCP_DOCS_DIR`'s hardcoded `prc` subdirectory, each process
  named `prc-<uuid>-<slug>.bpmn`, matching this repository's own
  `<type>-<uuid>-<slug>` document convention), grid-placed BPMN DI,
  the localhost:8080 read-only bpmn-js Viewer preview, `.bpmnlintrc`
  with `bpmnlint:recommended`, the npm/tsc/vitest toolchain, and the
  AGPLv3 license.

These came out of two interactive sessions with an AI coding agent:
the research and planning session (2026-10-22) behind the decision
record, the requirements, and the research Q&A, and the follow-up
implementation session (2026-10-23) behind the implementation Q&A.
They are the single source of truth for scope and rationale. Read
the constitution first (it is short), then the decision record,
then the requirements, then the research Q&A for background, and
the implementation Q&A before starting the first draft. Do not
re-derive this research from scratch — it is already captured
there.

## Chosen architecture (full rationale in the decision record)

- **Implementation language: Node.js / TypeScript** — not Python,
  despite the `pyproject.toml` / `uv.lock` / `.venv` already present in
  this repository. That scaffold was created only as a placeholder for
  incidental scripting and is not the project's implementation
  language; it can remain untouched and unrelated to the MCP server
  itself (its files still carry the SPDX license header per
  CONSTITUTION principle 1, QA 0.0290).
- **Protocol: a Model Context Protocol (MCP) server**, not an
  OpenCode-specific plugin — chosen specifically to stay usable from
  any MCP-compatible agent host, not locked to one editor/agent.
- **BPMN engine: the bpmn.io toolkit**, used as a library, not
  reimplemented:
  - `bpmn-moddle` — parses/serializes BPMN 2.0 XML (backs create,
    change, import, export, parse).
  - `bpmnlint` — a _separate_ library from bpmn-moddle, providing
    configurable, rule-based modeling validation (backs validate).
    bpmn-moddle alone only guarantees well-formed XML, not a
    sound diagram; see the Q&A for the full explanation.
  - `bpmn-js` — a Viewer (not the full Modeler, for this stage) for
    the human-facing browser preview.

## Scope: Stage 1 only

This project currently targets **Stage 1**: an agent creates or
changes a diagram via MCP tools, and a human can open a local browser
to see the current state. This is a turn-based preview (an explicit
preview step reloads the current diagram), not a continuously live
canvas.

**Explicitly deferred (Stage 2, not in scope yet):** a live,
two-way-synchronized browser canvas where both the agent and a human
edit the same diagram in real time, using bpmn-js's full Modeler
(drag/drop, connect, delete — all built in; `bpmn-js-properties-panel`
optionally added later for editing names/ids/attributes through the
UI). If this is undertaken later, follow the `yctimlin/mcp_excalidraw`
architecture referenced in the decision record's "More Information"
section (a separate canvas-server process — web UI + REST + WebSocket
sync — driven by a thin MCP client) rather than starting from scratch.

## Licensing note

`bpmn-js` ships under the "bpmn.io License" (MIT plus a clause
requiring its small attribution watermark to remain visible and
unmodified on any rendered canvas). This has already been reviewed and
accepted as compliant with the FOSS requirement — no action needed,
just do not strip, hide, or cover that watermark.

## Coding conventions

Conventions and procedures: `CONTRIBUTING.md` (setup, commands, the
convention index). Machine enforcement: Prettier (the formatter:
K&R braces, 2-space indent, 120-char lines, single quotes) +
ESLint/typescript-eslint (the linter: naming,
cyclomatic-complexity measurement) + `eslint-config-prettier` +
`.editorconfig` + `tsconfig` (`strict`) + `archunit` (the
architecture test suite: no cycles, the core-vs-adapter layering --
CONSTITUTION §4, QA 7.0030). Every source file starts
with the two-line SPDX header (`SPDX-FileCopyrightText` +
`SPDX-License-Identifier: AGPL-3.0-only`); write it in every new
file — a license-header drift gate (vitest) fails on any in-scope
file without it (CONSTITUTION principle 1, QA 0.0290). Allman was
considered and dropped 2026-10-24 (it contradicted the Google
style the conventions cite); the complexity threshold is a user-set
config value, not a fixed requirement. Decision record and
rationale: the implementation Q&A (`docs/qa/qa-818fac76-...`,
pairs 0.0210-0.0290).

## Suggested next steps for implementation

1. Scaffold the npm-workspaces monorepo root manifest plus the
   `apps/mcp-server/` component (e.g. the official MCP SDK for
   TypeScript) alongside the existing, unrelated `uv` scaffold
   (layout: CONTRIBUTING.md §1).
2. Implement one MCP tool per functional requirement (create, change,
   import, export, validate, parse), backed by `bpmn-moddle` and
   `bpmnlint`.
3. Implement the Stage 1 browser preview: a small local static server
   hosting a `bpmn-js` Viewer page, opened in the user's default
   browser after an agent-driven change.
4. Check the result against each requirement document's "Description"
   and against the decision record's "Confirmation" section before
   considering Stage 1 done.
