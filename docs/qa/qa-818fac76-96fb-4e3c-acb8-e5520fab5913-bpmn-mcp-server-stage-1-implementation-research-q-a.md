---
classification: null
created: '2026-10-23T10:42:55.525+02:00'
id: 818fac76-96fb-4e3c-acb8-e5520fab5913
status: draft
type: qa
updated: '2026-10-24T14:53:09.961+02:00'
version: 1.0.0
---

# BPMN MCP Server Stage 1 — Implementation Research Q&A

## General

### Introduction

Interactive implementation-level elicitation session with an AI coding
agent (OpenCode), conducted 2026-10-23, backing the first draft of the
Node/TypeScript BPMN MCP server requested by GitHub issue
`dfch/biz.dfch.BpmnMcp#1` ("Create an MCP server for BPMN 2.0 modeling
with a local browser viewer interface"). The architecture itself —
language, protocol, BPMN engine, and stage scope — was settled in the
earlier 2026-10-22 session and is recorded in the companion decision
record, the ten requirement documents, and the companion research Q&A;
this Q&A covers only the implementation-level questions that remained
open: the MCP tool surface, diagram state and storage, preview
mechanics, lint configuration, and the development toolchain.

### Raw Requirements

> This issue is for creating the first draft of a Node.js MCP server
> that provides BPMN 2.0 diagram operations (create, change, import,
> export, validate, parse) and includes a local browser viewer
> interface.
>
> — GitHub issue `dfch/biz.dfch.BpmnMcp#1`, opened 2026-10-22, label
> `enhancement`

Pre-existing constraints carried over from the 2026-10-22 session
(recorded verbatim in the companion research Q&A): the tool must be
FOSS and must run entirely locally / on-premises on the same system as
the agent host, with no mandatory cloud dependency; Stage 2 (a live,
two-way-synchronized canvas) is explicitly deferred.

## Elicitation Context

<!-- Elicited 2026-10-23 by dfch and an AI coding agent (OpenCode), with the architecture decision and the ten requirements already in place, immediately before the first implementation pass on GitHub issue dfch/biz.dfch.BpmnMcp#1. -->

> **0.0010**: What prompted this elicitation, and which questions does
> it deliberately not cover?

GitHub issue #1 asks for the first draft of the server. The 2026-10-22
research session already settled the "what" and the "with what": a
Node/TypeScript MCP server (not an OpenCode plugin, not Python), built
on bpmn-moddle (parse/serialize), bpmnlint (validation), and bpmn-js
Viewer (preview), scoped to Stage 1 (turn-based preview). This session
settles only the remaining implementation-level "how" questions — tool
surface, state model, storage, preview mechanics, lint configuration,
toolchain, and licensing — so that a fresh agent can implement the
first draft without re-eliciting the architecture.

> **0.0020**: How does this Q&A relate to the companion artifacts?

It complements the companion research Q&A (BPMN Modeling Tool for
Agent and Human Use — Research Q&A) and the decision record (Use a
Node/TypeScript MCP Server for Agent-Driven BPMN Modeling): those
record the tooling landscape, the license review, and the
protocol/language choice; this one records the first-draft
implementation decisions. The ten requirement documents remain the
normative scope; nothing in this Q&A widens or narrows them. A
dedicated feature (FEAT) document for issue #1 is to be created
separately and will reference this Q&A; this document is not gated on
it.

<!-- Elicited 2026-10-23 from the implementer's own note (dfch, a Python/pip background): no prior experience with JavaScript/TypeScript projects or MCP servers in those languages. Pairs 0.0030-0.0080 answer the resulting "how do JS/TS projects even work" questions, each with the considered options and the choice made for the first draft. -->

> **0.0030**: Is the server written in TypeScript or plain
> JavaScript, and what does the "bare minimum with logging" goal mean
> for the first implementation step?

TypeScript. Considered options: (a) TypeScript compiled with `tsc`
to a `dist/` directory (chosen); (b) plain JavaScript (ES modules) -
no build step, but loses static type checking, and both the official
MCP SDK and the bpmn.io libraries are TypeScript-first with bundled
type declarations; (c) TypeScript executed natively by Node.js 24's
type-stripping - no build step, but an evolving feature and not the
ecosystem standard. The decision record had already settled
Node/TypeScript; this pair pins the build mode. The "bare minimum"
goal is read as the first implementation milestone: scaffold the
package, get the official MCP SDK server running over stdio with
structured logging and a trivial placeholder tool, verify it with the
MCP inspector, and only then wire in the seven BPMN tools (1.0010)
one at a time.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** the "bare minimum" milestone ships no placeholder tool.
1.0070 phases the first increment as the `version`/`config`
**resources** plus the `import`/`export` **tools** - never a trivial
placeholder tool - so the walking-skeleton milestone this pair
describes is corrected to: scaffold the package, get the official MCP
SDK server running over stdio with structured logging and the two
resources, verify it with the MCP inspector, and only then wire in
`import`/`export` and the rest of the 1.0010 surface.

> **0.0040**: What does the project layout look like - is there a
> `src/` directory?

Superseded as the layout decision by 0.0270 (monorepo adopted from
day one, user 2026-10-24). Layout as revised:

The repository root holds a **private workspaces manifest**
(`package.json` declaring `"workspaces": ["apps/*", "packages/*"]`,
the root `package-lock.json`, and the delegating `build`/`lint`/
`format`/`format:check`/`dev`/`test` scripts), the shared tooling
(`.pre-commit-config.yaml`, `.editorconfig`, `.prettierrc`,
`.github/`, `CONTRIBUTING.md`), the specification documents under
`docs/`, and the unrelated Python scaffold (untouched, as
`AGENTS.md` declares).
The single component lives in **`apps/mcp-server/`** with the
standard npm/TypeScript package layout inside it:

- `package.json` - the component manifest (name `biz.dfch.bpmnmcp`,
  version, dependencies, the `bin` entry, npm scripts);
- `tsconfig.json` - the TypeScript compiler configuration;
- `eslint.config.js` - the ESLint flat config (per 0.0220, as
  amended by 0.0280);
- `src/` - the TypeScript sources (a `core/` module with the BPMN
  operations, plus the MCP server and the preview server as thin
  adapters over it, per 7.0010);
- `dist/` - the compiled JavaScript output (generated, gitignored);
- `test/` - the vitest test files (per 0.0060);
- `.bpmnlintrc` - the bpmnlint rule configuration (per 7.0020);
- `logging.json` - the logging configuration (per 0.0160).

Runtime artifacts (`logs/`) are created in the process working
directory (the repository root when the host starts the server) and
are gitignored (0.0120); dependencies are hoisted to a single root
`node_modules/` by the workspaces.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** there is no `diagrams/` runtime directory. Processes
live under `BPMN_MCP_DOCS_DIR`'s hardcoded `prc` subdirectory
(`docs/prc/`, REQ-010), following the SpecMgr-model path convention
and the `prc-<uuid>-<slug>.bpmn` filename scheme recorded in the new
pair 0.0300; that path is committed documentation content, not a
gitignored runtime artifact, so it is not listed alongside `logs/`
above. The original position

- a root-level single package, with a dedicated subdirectory (e.g.
  `server/`) as the rejected alternative - is superseded by 0.0270;
  coexistence with the Python scaffold is unchanged (the scaffold stays
  at the root, untouched).

> **0.0050**: How does the server run - with `node`?

Yes. An MCP stdio server is just a long-running Node.js process that
reads JSON-RPC from stdin and writes it to stdout. The flow: `npm install` (fetch dependencies), `npm run build` (`tsc`, emits
`dist/`), and the entry point is `node dist/index.js`. The agent host
is configured to launch exactly that command (in OpenCode: a local
MCP server entry whose command is `node` with the argument
`<repo>/apps/mcp-server/dist/index.js`) and speaks the MCP
protocol over the
process's stdio pipes - no port, no daemon, no service manager.
During development, `npm run dev` (a `tsc --watch` loop) keeps the
compiled output fresh. One critical constraint: **stdout is the
protocol channel** - anything written there that is not valid MCP
JSON-RPC corrupts the connection, so all logging must go to stderr
(see 0.0070). The only other listener the process opens is the
localhost preview HTTP server (4.0010).

> **0.0060**: How do I write tests?

Considered options: (a) vitest (chosen) - the current de-facto
standard test runner for TypeScript projects, near-zero
configuration, runs `.ts` files directly; (b) jest - the older
standard, heavier configuration for a project of this size; (c)
`node:test` - the built-in runner, zero-dependency, but with a
smaller TypeScript ecosystem. Test files live in `test/` as
`*.test.ts` and run with `npm test` (wired to `vitest run` in
`package.json` scripts). Two levels: unit tests for the core BPMN
modules (building the moddle tree, import/export round-trips, the
grid placement of 1.0050, the lint finding format of 7.0020), and
MCP-level tests that drive the server through the official SDK's
`Client` over an in-memory transport - no process spawn, no stdio
plumbing - to assert the tool surface end to end (list tools, call
`create`, call `parse`, ...).

> **0.0070**: What are the standard logging libraries for
> TypeScript/Node?

Considered options: (a) pino (chosen) - the de-facto standard
structured logger for Node services: fast, minimal, emits JSON
lines; (b) winston - popular and more batteries-included (transports,
formatters), but slower and less common as the standard for new Node
services (the long-run options are compared in 0.0110); (c) consola -
friendly pretty output, more front-end oriented; (d) zero-dependency
`process.stderr.write(JSON.stringify(...))` lines - the absolute
minimum, but without child loggers or context propagation, so not the
long-run answer (0.0110). pino is the logger for the life of this
project, not a first-draft stopgap (enterprise-grade justification in
0.0110), configured to write JSON lines to **a log file and stderr**
(file + stderr dual output, 0.0160), never stdout (pino's own
default is stdout, which would violate 0.0050's protocol
constraint). First-draft log events: server start/stop,
each tool call (name plus key arguments), each preview request, and
warnings such as lint findings; no diagram content beyond element
ids, so logs stay small and safe.

> **0.0080**: How does package management work - I know PyPI for
> Python.

The direct analogues: the **npm registry** (`registry.npmjs.org`) is
PyPI - `npm install <pkg>` is `pip install <pkg>`; **`package.json`**
is `pyproject.toml` - name, version, dependencies, scripts, and the
`bin` entry that makes `dist/index.js` runnable; **`node_modules/`**
is the `.venv` - created per project by `npm install`, gitignored;
**`package-lock.json`** is `uv.lock` - the exact resolved dependency
tree, committed for reproducibility. `npm run <script>` executes the
shell commands defined under `package.json`'s `scripts` (this
project: `build`, `dev`, `test`, `start`, `lint`, `format`,
`format:check`). Unlike Python, the package
is not published anywhere: the agent host runs it from disk, so the
lock file plus `node_modules/` is the entire distribution story.
First-draft dependency set: `@modelcontextprotocol/sdk`,
`bpmn-moddle`, `bpmnlint`, `bpmn-js`, `pino`, `pino-roll`, `zod`
(runtime dependencies); `typescript`, `vitest`, `@types/node`,
`eslint`, `typescript-eslint`, `prettier`,
`eslint-config-prettier`, `@vitest/coverage-v8`
(devDependencies, per 0.0220 as amended by 0.0280) - the
pre-commit hooks (0.0190) are a system
tool, not npm dependencies.

<!-- Elicited 2026-10-24 as follow-up TODO notes from the implementer: pairs 0.0090-0.0130 extend 0.0040, 0.0060, 0.0070, and the 0.0080 context with the multi-component layout, the jest overview, enterprise-grade logging, a merged Python + Node .gitignore, and OTel-compatible telemetry. -->

> **0.0090**: If this repository *had* multiple components (example:
> server, client, ...), how would that change the directory layout?

0.0040 answers the single-component case; this pair covers the
multi-component one. The standard Node/TS answer is a **monorepo with
npm workspaces** (the pattern to adopt if/when a second component
appears): a root `package.json` declaring
`"workspaces": ["packages/*"]`, one directory per component, each
with its own `package.json`, `src/`, `dist/`, and `tsconfig.json`,
while third-party dependencies are hoisted into a single root
`node_modules/` under a single root `package-lock.json`. Components
that share code (e.g. a `bpmn-core` package holding the moddle
operations) are declared as ordinary dependencies by name plus
version, and npm links them to the local package instead of fetching
them from the registry. Considered alternatives: (b) **separate
repositories** (polyrepo) - each component versioned and published to
the npm registry independently; more publishing and versioning
discipline, only worth it when components have independent release
cycles or external consumers; (c) **a build orchestrator on top of
workspaces** (Turborepo, Nx) - adds task caching and pipelines;
overkill below roughly four or five components.

Applied here: the workspaces layout is adopted **from day one**
(user decision, 2026-10-24, recorded in 0.0270) even though the
project currently has a single component (the MCP server process;
the preview page is just static assets it serves) - the component
lives in `apps/mcp-server/`. When Stage 2 adds a canvas-server
process and a web client (per the
`yctimlin/mcp_excalidraw` precedent cited in the decision record),
the natural evolution continues within the same layout:
`packages/bpmn-core` (the shared operations, already anticipated by
7.0010's core-module layout) plus `apps/canvas-server` and
`apps/web` for the live canvas and its page. The root keeps
`AGENTS.md`, `docs/`, the lock file, and the workspace root
`package.json`.

> **0.0100**: Pair 0.0060 dismisses jest as "heavier configuration" -
> when would jest actually make sense?

"Heavier" refers to setup, not to capability: jest is a fully
battle-tested runner, and it is the right choice when (1) the project
is plain JavaScript, especially CommonJS - jest is CJS-native while
vitest is ESM-first, so a legacy CJS codebase runs under jest with
less friction; (2) the team or organization has already standardized
on jest and carries jest-specific plugins, snapshots, and CI
configuration to preserve - migrating a mature suite has a real cost,
and vitest's API is jest-compatible for the common cases
(`describe`/`it`/`expect`, mocking) but not 1:1 at the edges; or (3)
a needed plugin exists only in the jest ecosystem (rare and
shrinking, since the two ecosystems have largely converged). For this
project none of those apply: it is a greenfield TypeScript + ESM
codebase (the official MCP SDK is ESM-only), with no existing suite
and no team jest investment - exactly the profile vitest was designed
for (native TS, Vite-based transform, near-zero configuration). So
jest is not rejected as inferior; it is simply not the current
default for a new TS/ESM project.

> **0.0110**: Pair 0.0070 justified pino partly as the lighter
> option - that reads like a first-draft stopgap we would outgrow.
> What are the logging options for an enterprise-grade Node/MCP
> project, and which is the long-run choice?

Fair point - "lighter" was the wrong frame. The enterprise question
is not the logger's weight but structured output, context
propagation, and observability integration. The options: (a)
**pino** (chosen - and chosen as the long-run answer, not a
stopgap): the de-facto standard structured JSON logger in Node (used
by Fastify and most high-throughput services); child loggers give
every log line a stable per-request/per-tool context; and it
integrates with OpenTelemetry via `pino-opentelemetry` (adds
`trace_id`/`span_id` to log records), so logs, traces, and metrics
correlate once 0.0130 is in place; (b) **winston**: multi-transport
(console, file, syslog) with pluggable formats - the better fit when
one process must fan logs out to several different destinations and
formats from application code; the cost is performance and a heavier
abstraction; (c) **the OpenTelemetry SDK logs API directly**
(`@opentelemetry/sdk-logs` plus an OTLP log exporter): log records as
first-class telemetry, fully OTel-native; the JS logs API is younger
and less battle-tested than the Python/Java equivalents, and it
replaces rather than complements an application logger; (d)
**bunyan/consola/plain `console`**: legacy or non-structured - no
enterprise case for a new service.

The recorded position: pino writes JSON lines to stderr for the life
of the project; the "enterprise-grade" evolution happens downstream
of the logger, not inside it - the collector/exporter layer (OTLP to
a local Grafana stack, file-based beats, etc.) is where the scale-out
decision lands, and pino's JSON lines are the standard input format
all of them accept. Swapping the framework later would be a mistake
in either direction.

> **0.0120**: The current `.gitignore` is tailored for Python. How do
> I get a file that suits both Python and TS/JS?

`.gitignore` is per-repo, not per-language - the answer is one merged
file with both sections (standard practice in polyglot repositories;
github/gitignore ships combined "Python + Node" templates). The
current file already covers the overlap by accident: `build/` and
`dist/` are Python build outputs and also `tsc`'s compile target.
The Node/TS additions are: `node_modules/` (the dependency
directory, 0.0080), `coverage/` (vitest's report directory, 0.0060),
`*.tsbuildinfo` (`tsc`'s incremental-build state), `logs/` (the log
files, 0.0160), and `.env` (local machine configuration, never
committed - `.env.example` is the committed template). Target
content:

```
# Python-generated files
__pycache__/
*.py[oc]
build/
wheels/
*.egg-info

# Virtual environments
.venv

# Node.js / TypeScript
node_modules/
dist/
coverage/
*.tsbuildinfo

# Local configuration
.env

# Runtime artifacts
logs/
```

(`dist/` moves from the Python section to the Node/TS section, since
that is where it is produced; `build/` stays under Python as the uv
scaffold's output.) This is a one-file repository change that can be
applied as soon as this Q&A is accepted.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** the original answer listed `diagrams/` (the runtime
diagram directory, 0.0040) among the Node/TS additions and in the
template above. There is no `diagrams/` runtime directory: processes
live under the committed `docs/prc/` path (REQ-010, pair 0.0300), not
a gitignored runtime directory, so `diagrams/` never appears in
`.gitignore` (ACC-013). The target content above has already been
corrected to drop it.

> **0.0130**: What is a good telemetry and metering framework for
> this project - ideally OpenTelemetry compatible?

**OpenTelemetry** (via `@opentelemetry/api` plus
`@opentelemetry/sdk-node`) - it is the OTel-compatible choice by
definition and the vendor-neutral standard for enterprise telemetry.
The considered options: (a) **the OTel API from day one, the full
SDK only when a collector exists** (chosen): the `@opentelemetry/api`
package is tiny and stable, and it is a no-op unless an SDK is
registered - so the code is instrumented from the start (a span per
tool call with the tool name and key attributes; counters and
histograms for tool invocations and durations, preview requests, and
lint findings) at zero cost, and enabling the full `sdk-node` with an
OTLP exporter (gRPC or HTTP) to a local collector (the Grafana stack,
Jaeger, ...) later is a configuration change, not a code change; (b)
**`prom-client`** (the Prometheus pull model): simpler, but
metrics-only (no traces) and bound to the Prometheus scrape protocol
rather than OTLP; (c) **rolling our own JSON metrics into the
logs**: no cardinality, no standard, no.

Two constraints from this project: the local-only requirement (see
REQ 94d75c0f-da9d-4f43-8253-936747ff2fe9) - exporting to a remote
endpoint must be opt-in, which OTel handles naturally (no SDK or no
endpoint means no network traffic; a local on-premises collector is
fine); and the stdio protocol constraint (0.0050) - telemetry must
never write to stdout (the OTel console exporter's stdout variant is
off limits; file, stderr, or OTLP are fine). Once (a) is in place,
`pino-opentelemetry` (0.0110) ties the three signals together: every
pino log line carries the active trace's `trace_id`/`span_id`.

<!-- Elicited 2026-10-24 as follow-up TODO notes from the implementer on the logging/telemetry pairs: 0.0140 (stdio versus the logging framework, and whether OTel should own the logs signal too) and 0.0150 (OTel logging to a local file). -->

> **0.0140**: MCP runs over stdio (0.0050) - does that interfere with
> the logging framework? And *if* OTel is chosen for telemetry and
> metrics, would it make sense to use OTel for logging too?

First question: yes, but it is a solved constraint (0.0050) that
touches only *where* the logger writes, not *which* logger is used.
The stdio transport reserves stdout exclusively for MCP JSON-RPC
frames - a log line on stdout would be parsed as a protocol message
by the agent host and break the connection. MCP designates stderr
for server diagnostics, and the host captures it (OpenCode exposes
the server's stderr in its MCP log view; Claude Desktop writes it
into its own logs). So the framework stays pino; the configuration
changes in two places: pino's default destination is stdout, so the
logger is constructed with explicit destinations - a log file and
stderr (dual output, 0.0160), never stdout; and any dependency that
calls `console.log` directly (some libraries do) must be audited,
because `console.log` also writes to stdout. The first-draft rule: nothing in the process
writes to stdout except the SDK's protocol frames.

Second question: "OTel for logging" splits into two parts with two
different answers. For *correlation* - making every log line
queryable by its trace - yes, and it is already planned:
`pino-opentelemetry` (0.0110) injects the active span's
`trace_id`/`span_id` into pino records, so a log backend can join
logs to traces and metrics without the logging framework itself being
OTel. For *transport* - emitting log records as first-class OTel log
signals over OTLP - the honest Node.js state today: the JS logs
signal (`@opentelemetry/api-logs` plus `@opentelemetry/sdk-logs`
plus the OTLP log exporters) exists and its API is stable, but its
ecosystem maturity (bridges, collector support in common backends)
lags the Python/Java equivalents, and the standard practice in
mature Node services is to keep a classic structured logger
(pino/winston) for application logs while OTel owns traces and
metrics. Recorded decision: pino remains the logger; OTel owns
traces and metrics (0.0130); logs join the pipeline through context
injection; "logs as an OTel signal" is a documented upgrade path
(a pino destination forwarding records into the OTel Logger, or a
switch to the SDK-native loggers) to revisit once a collector-based
log pipeline actually exists - not first-draft scope, and nothing
in the first-draft code precludes it.

> **0.0150**: Can I use OTel to log to a local file?

Yes - with the caveat that the practical file writer differs
depending on which half of the pipeline should own the file. Three
concrete ways: (a) **OTLP into a local collector, and the collector
writes the file** (the "real OTel" way): run a local `otelcol`
(contrib build) with an OTLP receiver and its `fileexporter`
(experimental but shipped), and all three signals - including any
OTel-format log records - land as local JSON files; this is the
standard local development/evaluation pattern, and the only path
that keeps file logging in the same format and pipeline as traces
and metrics; (b) **OTel's logging exporter plus process-level
redirection**: the JS SDK ships a `logging` exporter that writes
records to the console; for this stdio server the stdout variant is
off limits (0.0140), so the workable form is the host capturing the
process's stderr into a file (e.g. starting the server as `node dist/index.js 2> logs/server.log`) - quick, but it captures whatever
reaches stderr rather than per-signal structured files; (c) **no
OTel: pino writes the file directly**
(`pino.destination('logs/server.log')`, rotation via
`pino-roll`) - the simplest,
zero-collector path, at the cost of the file being pino JSON rather
than an OTel format.

Decision (2026-10-24, user): on-disk file logging is required from
the first draft - the server runs inside OpenCode, where its stderr
is not visible to the user, so stderr capture alone is not an
acceptable log destination. Option (c) is therefore adopted: pino
writes to a log file (default `logs/server.log`, daily rotation via
`pino-roll`, seven files kept) **and** to stderr (dual output, so
the MCP inspector and the host's own capture keep working too);
destination, level, and rotation are configurable as recorded in
0.0160. Option (a) remains the path if a local OTLP collector is
adopted later (file logging then comes for free in OTel format). A
custom "OTel file exporter" inside the application code is not on
the table: file writing belongs to the collector or the logger, not
to the instrumented process.

<!-- Elicited 2026-10-24 as the user's decisions on the logging configuration (file + stderr dual output, .env-driven, config file, OTel destination via env vars) plus three new questions: 0.0160-0.0170 extend 0.0150/0.0130; 0.0180-0.0200 cover CI/CD, pre-commit hooks, and design by contract. -->

> **0.0160**: How is the log destination and format configured - can
> I use a `.env` file for the log path, and a config file for the
> rest?

Yes to both, with classic 12-factor precedence. The layers: (1) a
**config file** `logging.json` next to the component
(`apps/mcp-server/logging.json`, 0.0270) - the committed shared
defaults: destinations (file plus stderr), level, and
rotation (mode `daily` or `size`, files kept, max size); (2)
**environment variables** that override individual keys - e.g.
`BPMN_MCP_LOG_FILE`, `BPMN_MCP_LOG_LEVEL`, `BPMN_MCP_LOG_ROTATE`,
`BPMN_MCP_LOG_RETAIN` (the exact list is fixed at implementation
time); (3) **`.env`** for local machine values - gitignored (0.0120)
with a committed `.env.example` as the documented template.
Precedence: real environment (including `.env`) > `logging.json` >
built-in defaults. Loading: Node 24's built-in `process.loadEnvFile()`
(guarded for a missing file) at the very start of the process - zero
new dependencies, and it never overrides variables the environment
already provides, which is exactly the precedence wanted; the
classic `dotenv` package is the alternative if the project ever
targets older Node versions or needs more parsing features.
Recorded defaults: file `logs/server.log` plus stderr, level
`info`, daily rotation, seven files kept.

> **0.0170**: Can the OTel destination be configured via `.env` as
> well?

Yes - via the standard OTel environment-variable convention, with no
custom wiring: `OTEL_EXPORTER_OTLP_ENDPOINT` (e.g.
`http://localhost:4318`), `OTEL_EXPORTER_OTLP_PROTOCOL`
(`http/protobuf` or `grpc`), and `OTEL_SERVICE_NAME` /
`OTEL_RESOURCE_ATTRIBUTES` for the service identity. The OTel SDK
reads these spec-defined variables itself at initialization, and
because `.env` is loaded before anything else in the process
(0.0160), the values flow through unchanged; the same precedence
rule (real environment > `.env`) applies. With no endpoint set, the
SDK is not initialized and all instrumentation stays a no-op
(0.0130) - so "enable telemetry" is a one-line `.env` edit, and
"disable it" is deleting the line.

> **0.0180**: How do I configure CI/CD for a TS project?

Two facts shape the answer: the repository is hosted on GitHub, and
nothing is published or deployed (0.0080 - the agent host runs the
package from disk). So Stage 1 needs a **build gate**, not a deploy
pipeline: one GitHub Actions workflow, `.github/workflows/ci.yml`
(named and shaped after the sister repository `biz.dfch.SpecMgr`'s
"Lint and Test").

- Triggers: `push` to `main`/`dev` (the repository's two branches)
  and any `pull_request`, plus the sister's concurrency group
  (cancel superseded runs per ref).
- One job (`build`) on `ubuntu-latest` with minimal
  `permissions: contents: read`: `actions/checkout@v5` and
  `actions/setup-node@v4`, both pinned by commit SHA (the sister's
  security convention; the tag is kept as a comment), with
  `node-version: 24` and npm caching, and the family env var
  `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` set; then `npm ci` (the
  strict, lockfile-based install - the CI-appropriate form of
  `npm install`), `npm run lint` (ESLint, 0.0220/0.0280),
  `npm run format:check` (Prettier, 0.0280), `npm run build`
  (`tsc`, which doubles as the type-check gate), and `npm test`
  (`vitest run`) - the root manifest delegates all of them to the
  workspaces (0.0270).

No release/publish/deploy jobs in Stage 1, and no "Make sure X is
correct" drift gates yet: the sister runs those for its generated
artifacts (API docs, JSON schemas), and this repository has none -
the slots join this workflow when generated artifacts appear. A
second job for the Python side only if the unrelated `uv` scaffold
ever grows real code. A weekly `dependabot.yml` for
the npm ecosystem mirrors the sister's pip one (dependency updates
arrive as PRs; the committed lock file keeps them reproducible).
The local-only requirement constrains the *tool's runtime*, not
the CI runner; if the organization later requires on-prem CI, the
same steps run on a self-hosted runner or in GitLab CI - only the
host changes.

> **0.0190**: Can I use pre-commit hooks in a TS project?

Decision (2026-10-24, user - revised after comparing with the sister
project `biz.dfch.SpecMgr`): use the **`pre-commit` framework** (a
`.pre-commit-config.yaml` at the repository root) rather than husky.
Reasons: (1) this repository is polyglot - the unrelated Python
scaffold, the Node/TS project, and the markdown documents under
`docs/` - and pre-commit is language-agnostic, one config gates
everything, while husky would fire only on the npm lifecycle; (2)
family consistency - the sister's hook structure, local-gate idiom,
and drift-check pattern carry over unchanged; (3) pre-commit's
per-hook staged-file filtering (`files:` gates) covers what
lint-staged would have provided, so no npm dev dependencies are
needed for the hooks at all.

Setup: the config is committed; each clone runs `pre-commit install` once (or `uvx pre-commit install`, no global install).
First-draft hook set: the standard hygiene hooks from
`pre-commit/pre-commit` (v4.7.0 - `check-yaml`,
`end-of-file-fixer`, `trailing-whitespace`, with the historical
session transcript excluded from the whitespace fixers), plus four
`repo: local` gates mirroring the sister's idiom: `npm run lint`
(ESLint, 0.0220/0.0280), `npm run format:check` (Prettier,
0.0280), `npm run build` (the tsc type-check gate), and `npm test`
(the vitest suite), each
`files:`-gated to Node/TS sources and the project manifest, each
`pass_filenames: false` because the underlying command operates on
the whole project; all require `npm install` to have been run once
in the clone. The sister's drift-gate idiom (regenerate, then
`git diff --exit-code`) is deliberately not carried over yet,
because this repository has no generated artifacts; it joins when
they appear (0.0180). husky plus lint-staged remains the recorded
rejected alternative (the "fresh Node project" idiom - this
pair's original position), superseded by the family-standard
choice. One caveat, unchanged: hooks are a convenience - `git commit --no-verify` bypasses them, so CI (0.0180) remains the
authoritative gate.

> **0.0200**: Is there a "design by contract" framework for
> TypeScript, like the .NET Contracts library?

No first-class design-by-contract framework with real ecosystem
adoption exists for TypeScript - that part of the .NET toolbox has
no direct equivalent, and nothing worth a dependency was found. The
idiomatic TypeScript answer is layered: (1) **the type system is
the compile-time contract** - parameter and return types under
strict `tsc` already enforce the interface-level contracts, and the
`tsc` gate (0.0180) makes violations a build failure; (2) **runtime
boundary contracts are zod** (added when the code that needs it
lands, per the superseded marker below) - the de-facto standard
schema library, and notably the
official MCP SDK's `tool()` helper takes a zod schema as the tool's
input, so every MCP tool input is contract-validated at the
protocol boundary already; the same schemas guard the core-module
functions (import/export paths, change actions, parse results);
(3) **preconditions, postconditions, and invariants have no
standard library** - the pragmatic pattern is small assertion
helpers (a `precondition(condition, message)` / postcondition
wrapper, a few dozen lines in the core module), e.g. "the exported
XML re-parses to the same element set" as the postcondition of
`export`. Recorded decision: zod for runtime contracts at the tool
and module boundaries, plain assert helpers for pre/postconditions;
if true decorator-style DbC is ever wanted, a small in-house module
on top of zod - not a framework dependency.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** "added to the dependency set" (0.0080's phrasing) is
corrected to "added when the code that needs it lands" - this
feature (feat-1-bpmn-mcp-scaffold) ships no tools and no core-module
boundary code, so zod is not a Phase 100 devDependency; whether the
`@modelcontextprotocol/sdk`'s tool-registration helper pulls zod in
as a peer dependency regardless is confirmed by the Task 100.165
interop spike, and zod becomes a committed runtime dependency only in
Phase 110 (or later), with the first code that actually validates a
schema.

<!-- Elicited 2026-10-24: the user's coding-convention questions (recorded as 0.0210-0.0260 with the options considered and the choice made) plus the user's monorepo decision (0.0270), which supersedes the layout position of 0.0040. -->

> **0.0210**: Where do the coding conventions, guidelines, and
> procedures for this repository live - and what is the convention
> list?

By enforcement level (0.0020's single-source-of-truth rule applies):
(1) **the machine configs are the source of truth for the rules** -
`.prettierrc` at the repository root (the style: braces,
indentation, line width, quotes, semicolons; 0.0220/0.0230/0.0240,
as amended by 0.0280), `eslint.config.js` per component (the
quality rules: naming, complexity measurement; 0.0240/0.0250),
`tsconfig.json` (`strict: true`
plus the recommended flags), `.editorconfig` at the repository root
(indent and line-ending hygiene for any editor; 0.0230), and the
vitest configuration (coverage; 0.0260). A convention that exists
only in prose is drift-prone - the sister repository's culture is
machine gates, so every convention here has a machine home. (2)
**`CONTRIBUTING.md` at the repository root** - the family pattern
(the sister has one; GitHub auto-links it from pull requests): the
procedures (setup, commands, logging and telemetry configuration,
commit guidelines, and how to change a convention) plus a one-line
index of the conventions pointing at `CONSTITUTION.md` and the
deciding QA pair - the index is navigation, not the specification
(slimmed 2026-10-24): templates, exemptions, and rationale live in
the QA pairs, and the machine configs remain the source of truth. (3) **`AGENTS.md`** carries a short pointer
section (to CONTRIBUTING.md and to this Q&A) - it stays the agent
entry point, not a convention dump (the sister's AGENTS.md is
self-contained and large; this repository keeps it lean and
pointer-based). (4) **this Q&A** records each decision with its
options and rationale.

The convention list itself is elicited in the adjacent pairs: 0.0220
(linter + formatter, superseded in its Allman position by 0.0280),
0.0230 (indentation), 0.0240 (line width + cyclomatic complexity),
0.0250 (naming), 0.0260 (coverage +
pre/postcondition asserts) - on top of the repository layout
decision they assume, 0.0270 (monorepo from day one), the
0.0280 re-decision (K&R braces, the Prettier + ESLint split), and
0.0290 (the SPDX license header, CONSTITUTION principle 1).

> **0.0220**: Which linter do we use for Node/TS - and how does the
> user's Allman brace requirement shape that choice?

**Superseded in part (2026-10-24, pair 0.0280):** the Allman
requirement was challenged and withdrawn - the Google TypeScript
Style Guide cited by 0.0230/0.0250 is K&R, not Allman, and Allman
was a personal preference, not part of that standard. Prettier is
adopted as the formatter; ESLint keeps the non-stylistic rules
(`complexity`, `naming-convention`). The stylistic rules named
below (`brace-style: allman`, `indent`, `quotes`, `semi`,
`comma-dangle`) no longer apply. The historical answer follows.

**ESLint** (flat config, `eslint.config.js` per component) with
**typescript-eslint** - the de-facto standard for TypeScript
linting. The Allman requirement (user, 2026-10-24) drives the
tooling more than the linting does: the standard formatter
**Prettier is rejected** - Prettier is deliberately opinionated and
emits K&R braces only (there is no Allman option; the request was
declined upstream) - and the newer all-in-one **Biome** is the same;
adopting either would fight the user's style on every format. So
ESLint is both linter and style enforcer: its stylistic rules carry
the convention set (`brace-style: ["error", "allman"]`, `indent`,
`quotes`, `semi`, `comma-dangle`, `max-len`, plus the
`naming-convention` and `complexity` rules per 0.0240/0.0250), with
no separate formatter step. (The sister repository's Python side
keeps ruff, which does have a stable formatter; no TypeScript
formatter with Allman support exists.) Consequences, all recorded:
ESLint joins the first-draft devDependencies and scripts (0.0080,
`npm run lint`), CI gains a lint step (0.0180), and pre-commit gains
an ESLint gate (0.0190). The stylistic defaults adopted: single
quotes, semicolons on, trailing commas in multi-line constructs.

> **0.0230**: What is the standard indentation for TS projects - 2
> spaces, 4 spaces, or tabs?

**2 spaces, never tabs** - the de-facto standard across the
TypeScript/Node ecosystem: Prettier's default, the Google
TypeScript Style Guide, and the mainstream TS projects (including
the bpmn.io libraries) all use 2 spaces. 4 spaces is the C#/Java/
.NET convention (familiar to the implementer from the .NET
background behind 0.0200's question), and tabs are effectively never
used in committed JS/TS. Machine enforcement on two levels
(0.0210): `.editorconfig` at the repository root (`indent_style = space`, `indent_size = 2`, plus `charset = utf-8`, `end_of_line = lf`, `insert_final_newline = true`, `trim_trailing_whitespace = true`) for any editor or agent, and Prettier `tabWidth: 2` (the
formatter's job since 0.0280) for CI and pre-commit. The markdown documents under `docs/` stay
with mdformat's wrapping (specmgr); `.editorconfig` does not change
that.

> **0.0240**: What is the standard line width for Node/TS - is 120
> chars common? And how is cyclomatic complexity bounded?

Line width: the ecosystem default is 80 (the Prettier/traditional
standard), 100 is a common modern TypeScript choice, and **120 is
adopted for this project** (the user's candidate, 2026-10-24) -
common in enterprise shops and on wide screens, coherent with the
K&R/2-space style (0.0280), and it matches the width the
implementer already works at in the sister repository's long
workflow lines. Enforcement: Prettier `printWidth: 120` (the
formatter re-wraps; unbreakable lines - long URLs, import lines -
are left as-is, so the old `max-len` exclusion list is obsolete,
0.0280). Cyclomatic complexity: the requirement is a **tool that
measures cyclomatic complexity per function - not a threshold**:
the effective threshold is a value the user sets in the ESLint
config (or adopts a standard's default). The measuring tool is
**ESLint's built-in `complexity` rule** - the standard JS/TS tool
(the dedicated analyzers the implementer knows from Python, e.g.
radon, are Python-only; SonarJS/SonarQube is a commercial
platform, against this project's FOSS posture, 3.0020). The
first-draft config ships `complexity: ["error", 10]` - the
ecosystem's common starting value (the common starting range is
10-15), recorded as an adjustable config default rather than a
user requirement; the sister gates dead code with vulture but has
no complexity gate, so there is no family precedent to copy. A
function that exceeds the threshold is refactored (extracted),
not waived; an `eslint-disable` for `complexity` requires a
recorded justification in this Q&A, consistent with the drift-gate
culture.

> **0.0250**: What are the naming conventions - PascalCase,
> camelCase, kebab-case - for which constructs?

The TypeScript standard (the Google TypeScript Style Guide), encoded
as `@typescript-eslint/naming-convention` rules so it is enforced in
CI and pre-commit rather than only documented (0.0210):

- **PascalCase**: classes, interfaces, type aliases, enum
  declarations and enum members, generic type parameters
  (`BpmnCore`, `ToolResult`).
- **camelCase**: functions, methods, variables, parameters, object
  properties (`loadDiagram`, `exportPath`).
- **UPPER_SNAKE_CASE**: true constants - module-level `const` values
  that never change (defaults, limits: `DEFAULT_PORT`,
  `MAX_LINT_FINDINGS`).
- **kebab-case**: file and directory names (`preview-server.ts`,
  `core/`); npm package names are kebab-case by registry rule (the
  established name `biz.dfch.bpmnmcp` is the recorded exception,
  0.0080 - dots are legal in npm names).

No JSX/React rules apply (there is no UI framework - the preview
page is a single static asset, 4.0010). Acronyms follow the
surrounding convention (`BpmnElement`, `loadBpmnFile`), never
ALL-CAPS mid-word.

> **0.0260**: How is test coverage measured (branches, classes,
> functions) - and what is the common assert pattern for
> preconditions and postconditions?

Coverage: **vitest's built-in coverage provider**
(`@vitest/coverage-v8`, devDependency per 0.0080; the `-istanbul`
provider is the alternative for source-map edge cases) - run with
`npm test -- --coverage`, reporting **lines, statements, functions,
and branches** per file and in total (JavaScript has no separately
countable "classes" - class methods are functions and class bodies
are lines, so the three requested dimensions are covered by the
standard report; `coverage/` is gitignored, 0.0120). CI runs
coverage with every gate (the sister's `pytest --cov` parity,
0.0180). Percentage thresholds: report-only in the first draft; the
hard minimum (e.g. 100% for the small core module) is set once the
suite exists - an explicit open follow-up, not a first-draft gate.

Assert pattern (concretizing 0.0200): the TypeScript-idiomatic shape
is **assertion functions with `asserts` signatures** - a small
in-house module in the core component defining
`precondition(condition: unknown, message: string): asserts condition` and `postcondition(...)` likewise, which throw on a
falsy condition and let the compiler narrow types at the call site.
Usage: `precondition` at function entry (guarding invariants),
`postcondition` at exit (e.g. `export`: "the serialized XML
re-parses to the same element set"); zod (0.0200) stays the boundary
validator for data crossing tool and module lines. No framework
dependency - this is the recorded design-by-contract answer for
TypeScript (0.0200).

> **0.0270**: Even though we only have a single component at this
> time, we want to set up the directory layout as a monorepo where
> we can later host multiple components (possibly in different
> languages). How is that arranged?

Yes (user decision, 2026-10-24) - the monorepo layout is adopted
**from day one**, superseding 0.0040's original root-level
single-package position. Layout (revised in 0.0040 accordingly): a
**private root** `package.json` declaring
`"workspaces": ["apps/*", "packages/*"]` plus the root
`package-lock.json`; **`apps/`** holds deployable units - currently
a single component, `apps/mcp-server/` (its own `package.json` named
`biz.dfch.bpmnmcp` per 0.0080); **`packages/`** holds shared
libraries and stays empty until code is shared between components
(the `bpmn-core` extraction of 0.0090 happens then, not before).
The root manifest delegates the conventional scripts (`build`,
`lint`, `dev`, `test`) to the workspaces, so CI (0.0180) and
pre-commit (0.0190) run from the repository root without
per-component paths. The directory layout is language-agnostic: a
later component in another language (e.g. a Python helper) lives in
its own top-level directory with its own tooling; npm workspaces
manage only the JS/TS components. The 0.0090 workspaces pattern
(chosen there over polyrepo and orchestrator tools) is the vehicle
for the user's stated expectation that more components - possibly in
different languages - will be hosted in this repository.

<!-- Elicited 2026-10-24 as a challenge to 0.0220: the user noted that the Google TypeScript Style Guide cited by 0.0230/0.0250 does not suggest Allman, and re-opened the linter/formatter choice. -->

> **0.0280**: The Google TypeScript Style Guide (cited by 0.0230
> and 0.0250) does not suggest the Allman brace style - it is K&R.
> If the Allman requirement is dropped, which linter/formatter is
> the best choice?

**Challenge accepted; Allman is dropped (user, 2026-10-24).**
Evidence: the Google TypeScript Style Guide never prescribes
Allman - every example is K&R (opening brace on the same line:
`if (x) {`, `class Foo {`), and the rule the TS guide inherits from
the Google family is explicit (the C++ style guide: "Opening
braces go on the same line as the code before them"; the Java
guide likewise). Allman was therefore a personal preference
recorded on 2026-10-24, not part of the cited standard - and
0.0220's rejection of Prettier and Biome rested solely on that
preference (neither can emit Allman; Prettier's request was
declined upstream).

**Decision: Prettier (the formatter) + ESLint with
typescript-eslint (the linter) + `eslint-config-prettier`.** The
de-facto ecosystem pairing, and the shape a Google-style TS
project effectively uses. Prettier owns all style, in a single
root `.prettierrc` shared by every workspace: K&R braces (now the
standard's position, not a fight), `tabWidth: 2` (0.0230),
`printWidth: 120` (0.0240), and 0.0220's stylistic defaults
expressed as options - `singleQuote: true`, `semi: true`,
`trailingComma: "all"`. ESLint keeps the non-stylistic rules:
`complexity` (the cyclomatic measurement tool, 0.0240),
`@typescript-eslint/naming-convention` (0.0250), plus the
typescript-eslint recommended set; `eslint-config-prettier` turns
off ESLint's stylistic rules (`brace-style`, `indent`, `quotes`,
`semi`, `comma-dangle`, `max-len`) so the two never conflict.
Consequences, recorded: 0.0220 is superseded in part (the
historical answer stays for the record), 0.0230's ESLint `indent`
becomes Prettier `tabWidth`, 0.0240's `max-len` becomes Prettier
`printWidth`, `prettier` + `eslint-config-prettier` join the
first-draft devDependencies (0.0080), the root manifest delegates
`format`/`format:check` (0.0040/0.0270), and CI (0.0180) plus
pre-commit (0.0190) gain a `npm run format:check` gate.
`.editorconfig` is unchanged - Prettier reads it, and the values
already agree.

**Biome considered and rejected (2026-10-24).** The all-in-one
alternative (linter + formatter + LSP in one Rust binary, no
Node.js required for the tool itself) would otherwise be
attractive: dual-licensed MIT or Apache-2.0 (FOSS-compliant,
3.0020), community-governed (a formal `GOVERNANCE.md`, eight core
contributors, corporate sponsorship), 607 linter rules per the v2
docs, GritQL-based plugin support since v2, `biome ci` for CI,
`biome migrate eslint` to port an existing ESLint config, and
Prettier-compatible output (97% by the Algora challenge). It is
rejected here for two recorded reasons: (1) it has no
cyclomatic-complexity rule (its closest is
`noExcessiveCognitiveComplexity` - a different metric whose
threshold would not mean what 0.0240 records), and (2) 0.0240 and
0.0250 are written against ESLint rule names (`complexity`,
`@typescript-eslint/naming-convention`), so Biome would force
re-wording those pairs. Further, its rule base is younger (nursery
rules are explicitly not semver-stable) and its formatter is 97%,
not 100%, Prettier-identical. Revisit when Biome ships a
cyclomatic-complexity rule and its naming convention stabilizes -
the re-decision path is this Q&A, not the config.

<!-- Elicited 2026-10-24 (user): the repository is AGPLv3-licensed (3.0020); the user asked for a coding convention, recorded as CONSTITUTION principle 1, that every source file carries the license with an SPDX reference. -->

> **0.0290**: How is the project's license declared per file, and
> how is that enforced?

**The two-line SPDX declaration header (user decision,
2026-10-24), recorded as CONSTITUTION principle 1.** Every source
file of the project starts with exactly:

```
# SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
# SPDX-License-Identifier: AGPL-3.0-only
```

in the file type's comment syntax (`#` for Python, YAML, TOML,
INI; `//` for JavaScript and TypeScript); the copyright holder is
named by the user (matching `pyproject.toml`'s author). JSON cannot
carry comments: every `package.json` manifest declares the license
via its `"license": "AGPL-3.0-only"` field instead, and other JSON
config files (e.g. a future `.prettierrc`) are exempt for that
reason. Considered and rejected: (a) the two lines plus the GNU
short-notice block - the SPDX identifier alone is the modern
standard (the Linux kernel and systemd carry only SPDX tags), it is
what license scanners key on, and it removes a failure mode: with a
prose notice, every file would have to say "version 3 of the
License" without the "(at your option) any later version" clause,
whereas `AGPL-3.0-only` carries that precision by definition; (b)
the full license text per file - redundant with the verbatim
`LICENSE` at the repository root, which AGPL's conveyance terms
already require to travel with the program; (c)
`eslint-plugin-header` as the enforcement vehicle - JS/TS-only, it
cannot check Python/YAML/TOML files, and it adds a dependency. The
identifier is always the SPDX 3.x form `AGPL-3.0-only`: never the
deprecated bare `AGPL-3.0`, never `AGPL-3.0-or-later` (3.0020).

**Scope.** In scope: every committed file that is project source
code or machine-executable configuration - all current and future
`apps/`/`packages/` code, test, and `package.json` files, the root
`package.json` (when the npm scaffold lands), the root machine
configs (`.editorconfig`, `.pre-commit-config.yaml`,
`.github/workflows/*.yml`, `.github/dependabot.yml`), and the
Python/`uv` scaffold (`src/`, `pyproject.toml`) - the scaffold
stays functionally unrelated (AGENTS.md) but is part of the AGPL
repository, so its files carry the header too. Exempt, recorded:
the specification artifacts under `docs/`, the historical session
transcript (`session-feat-0-bpmn-ses_e9db.md`), the root
documentation (`README.md`, `AGENTS.md`, `CONTRIBUTING.md`,
`CONSTITUTION.md`), `LICENSE` itself (the FSF text carries
"changing it is not allowed" - a header would modify it), other
JSON config, and generated files (`uv.lock`, `package-lock.json`,
`node_modules/`, `dist/`, `coverage/`, `logs/`). The exemption list is
part of the convention: a file needing a new exemption gets a
recorded decision here first.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** `diagrams/` is dropped from the generated-files exemption
list above - there is no `diagrams/` runtime directory (pair 0.0300);
processes live under the committed `docs/prc/` path, which is already
exempt as documentation under `docs/`. feat-1-bpmn-mcp-scaffold's
Task 100.150 also adds explicit new-file-type coverage/exemptions to
the drift gate for the file types this feature introduces
(`.gitignore`, `.node-version`, `.env.example`, `.prettierrc`,
`.prettierignore`, `eslint.config.js`, and, once it lands in Phase
110, `apps/mcp-server/logging.json`), per REQ-004.

**Enforcement (the machine home, CONSTITUTION principle 3).** A
license-header drift gate - a vitest suite (first draft:
`apps/mcp-server/test/license-header.test.ts`) that walks the
in-scope files and asserts, per file type: line 1 is
`SPDX-FileCopyrightText` (the holder text as recorded), line 2 is
`SPDX-License-Identifier: AGPL-3.0-only`, each in the file type's
comment syntax, and every in-scope `package.json` carries
`"license": "AGPL-3.0-only"`; exempt paths are not asserted. It
runs through the existing `npm test` script, so CI (0.0180) and
pre-commit (0.0190) gate it with no new hook and no new
dependency. The existing in-scope files were retrofitted with the
header on 2026-10-24 (`.pre-commit-config.yaml`, `.editorconfig`,
`.github/workflows/ci.yml`, `.github/dependabot.yml`,
`src/biz_dfch_bpmnmcp/__init__.py`, `pyproject.toml`).

<!-- Elicited 2026-10-29/30 during the feat-1-bpmn-mcp-scaffold planning: dropping the registry file (1.0030/1.0080) raised the question of how a process is still identified and located without it. -->

> **0.0300**: With the registry file (`diagrams/registry.json`)
> dropped (see 1.0020/1.0030/1.0080's superseded markers below), how
> are processes still identified and located on disk?

**Superseding in part**, not dropping: the registry *file* and its
`diagrams/` runtime directory go away, but UUID process
identification does not - it moves into the filename. The adopted
path model follows this repository's own **SpecMgr-style path
convention**: a root directory, `BPMN_MCP_DOCS_DIR` (default
`./docs`, REQ-010), with a **hardcoded per-type subdirectory** -
`prc` - exactly the way `SPECMGR_DOCS_DIR` roots this repository's
own `req`/`dec`/`qa` documents under matching hardcoded
subdirectories. Each BPMN process therefore lives at
`docs/prc/prc-<uuid>-<slug>.bpmn`, matching this repository's own
`<type>-<uuid>-<slug>` filename convention for its specification
documents (`req-...`, `dec-...`, `qa-...`) - the same convention this
very Q&A document's own filename follows.

Consequences: the **directory listing of `docs/prc/` is the
inventory** - no separate registry file is needed to map a uuid to a
path, because the uuid is already encoded in the filename a plain
directory scan sees. UUID process identification (1.0070's "every
process gets a UUID", 1.0080's `.../processes/<uuid>` preview URL
scheme, 4.0010) is unaffected: the uuid still identifies the process,
it is just read out of the filename instead of looked up in
`registry.json`. What the registry file *did* additionally carry -
the `lastKnownChecksum` and timestamps bookkeeping for the
conditional-re-read-by-checksum mechanism (1.0020) - still needs a
home; the concept of conditional re-read with a checksum is
unaffected by this pair, but where that checksum cache now lives
(in-memory only, a sidecar file, or recomputed each time) is left to
the feature that implements the `prc` artifact core, not decided
here. This feature (feat-1-bpmn-mcp-scaffold) implements none of this
- it only resolves and reports the `BPMN_MCP_DOCS_DIR`/`prc` path
(REQ-010) and records this scheme so the next feature does not have
to re-elicit it.

## Functional Suitability

> **1.0010**: Which tools does the first-draft MCP server expose?

Seven tools: one per functional requirement plus the preview —
`create`, `change`, `import`, `export`, `validate`, `parse`, and
`preview`; apart from `import` (which takes a file path) and the
resources, every tool addresses a process by its UUID (1.0080). `change` is a single tool with an action parameter (add
element, update element, connect, delete) rather than a set of
finer-grained tools: the 2026-10-22 session had sketched the
finer-grained surface (`bpmn_add_element`, `bpmn_connect`, ...), but
the 1:1 mapping keeps the tool surface aligned with the requirements
and the agent's mental model, and the actions can be split into
separate tools later if they prove to need distinct inputs. Phasing:
the first increment is smaller than this surface - MCP resources plus
`import` and `export` first, the rest deferred to separate
discussion (1.0070).

> **1.0020**: Does the server hold one in-memory "current diagram", or
> is every operation file-backed?

Decision (2026-10-24, user - supersedes the original in-memory
position): **the file on disk is the single source of truth**; the
server holds the in-memory bpmn-moddle tree of each registered
process only as a cache. The server manages several processes at the
same time (1.0030/1.0080), each identified by a UUID. Every tool
call that touches a process performs a **conditional re-read with
checksum**: the server computes the file's current SHA-256 and
compares it with the `lastKnownChecksum` recorded in the registry -
if equal, the cached tree is served without re-parsing; if
different, the file has changed out of band (by a user or by another
MCP instance) and the server re-reads (re-parses) the file, updates
the cache and the checksum, and notes the re-read in the tool result
and in the structured log (0.0070). This replaces the original
stance - the in-memory tree as source of truth, hand edits visible
only on the next explicit import (the 2026-10-22 session's
worst-case policy for the plugin alternative) - with detection that
is still polling-based (checked at operation time, no file watcher)
and keeps the first draft free of file-watching machinery. `import`
is the primary entry path (1.0080); `create` (deferred, 1.0070)
builds a new process, which becomes registered on its first
`export`. Known limitation, recorded: the read-check-act sequence is
not lock-protected in the first draft, so two concurrent operations
on the same process can still race (last write wins); locking is a
deferred improvement.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** the registry and its `lastKnownChecksum`/timestamps
bookkeeping are dropped (see 1.0030/1.0080's superseded markers and
the new pair 0.0300) - there is no `registry.json` file. The
high-level **concept** of a conditional re-read with a checksum -
caching the in-memory tree and only re-parsing when the on-disk
checksum changes - is unaffected and still stands; only where that
checksum is now recorded (in-memory only, a sidecar file, or
recomputed) is left open, to be settled by the feature that
implements the `prc` artifact core.

> **1.0030**: Where are diagrams stored, and can there be several of
> them at once?

Decision (2026-10-24, user - supersedes the one-diagram-at-a-time
position): **several processes at the same time**. Each imported
process is identified by a server-assigned UUID (v4), and a
server-managed **registry file** `diagrams/registry.json` maps each
uuid to its file path, label, `lastKnownChecksum` (SHA-256), and
timestamps. The default directory `diagrams/` (configurable, as
before) hosts server-managed files; `import` may point at a file
anywhere, and `export` writes a process (by uuid) to its registered
path or to an explicitly given path, updating the registry
checksum. The full design - UUIDs, registry, checksum-based
conditional re-read, file as single source of truth - is recorded in
1.0080; the original answer (one current diagram at a time, several
diagrams out of scope) is superseded.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** "several processes at the same time" is unaffected and
still stands. Only the registry file goes away: there is no
`diagrams/registry.json` and no `diagrams/` directory. Each process
instead lives at `docs/prc/prc-<uuid>-<slug>.bpmn`
(`BPMN_MCP_DOCS_DIR`'s hardcoded `prc` subdirectory, REQ-010, pair
0.0300), so the uuid travels in the filename and a directory listing
of `docs/prc/` is the inventory; `import` may still point at a file
anywhere, and `export` still writes to an explicit path or to the
process's own path (see 1.0070's corrected wording below).

> **1.0040**: What does `parse` return to the agent?

A structured inventory of the current diagram: every element with its
BPMN id, type (e.g. `bpmn:Task`, `bpmn:StartEvent`,
`bpmn:ExclusiveGateway`), and name, plus every flow (sequence and
message) with its id, source, target, and condition expression where
present. The agent addresses elements by their BPMN id in subsequent
`change` calls. The inventory is returned as structured text/JSON in
the tool result, not as raw XML.

> **1.0050**: Who supplies the graphic coordinates (BPMN DI) for
> elements the agent creates?

The viewer only renders elements that carry diagram-interchange
(BPMNDI) information, so the first draft always emits some placement:
`create` and `change` accept optional explicit positions (x/y) per
element, and when positions are omitted the tool auto-places new
elements on a simple grid, so the diagram is always viewable without
adding a layout dependency. A proper algorithmic auto-layout — the
comparables (e.g. `Stieges/bpmn-generator`) keep the LLM away from
coordinates entirely and use an algorithmic layout engine — is
recorded as a follow-up improvement, not first-draft scope.

> **1.0060**: Are `create` and `change` automatically validated with
> bpmnlint?

No — validation happens only via the explicit `validate` tool, so each
tool result stays focused and the first draft does not pay the lint
cost on every mutation. The tool descriptions state that the agent
should call `validate` after a change it cares about. (The most mature
comparable runs an integrity check on every generate; for a turn-based
local tool, explicit-only is the simpler contract for the first
draft.)

> **1.0070**: Which items make up the *first increment* of the tool
> surface - and what MCP resources does the server expose?

Decision (user, 2026-10-24): the first increment starts smaller than
the seven-tool Stage 1 surface of 1.0010, and adds MCP **resources**
(which the original tool list did not cover):

- **MCP resources**: a `version` resource and a `config` resource -
  mirroring what the sister repository `biz.dfch.SpecMgr` exposes
  (its `specmgr://version` and `specmgr://config` resources):
  read-only metadata the agent can fetch without a tool call (the
  server's name and version; the effective configuration - log
  destination, level, and rotation per 0.0160, the OTel endpoint
  state per 0.0170, the bpmnlint preset per 7.0020).
- **An `import` tool** (working name - the user's candidates were
  "load" / "import" / "read"; the final name is still to be
  determined): opens a BPMN 2.0 file from disk, parses it with
  bpmn-moddle, registers the process, and returns its UUID (1.0080;
  re-importing a path already in the registry keeps its UUID). The
  user's phrasing "render it in the BPMN modeler" is recorded as the
  Stage 1 **Viewer** preview (4.0010/4.0020) - the full Modeler is
  Stage 2 territory; if a Modeler rendering was actually intended,
  that is a scope change to record separately.
- **An `export` tool** (working name - candidates "export" /
  "write"): takes a process UUID, serializes the diagram (after the
  checksum re-read, 1.0080) to BPMN 2.0 XML, and writes it to its
  own path under `docs/prc/` or to an explicitly given path (9.0010's
  overwrite rule applies) - **fixed (2026-10-29/30,
  feat-1-bpmn-mcp-scaffold planning)**: "registered path" is corrected
  to the `prc-<uuid>-<slug>.bpmn` filename scheme (pair 0.0300),
  since there is no registry to register a path in.

Everything else of the 1.0010 surface (`create`, `change`,
`validate`, `parse`, `preview`) is **deferred to later, separate
discussion** (user: "Other tools will be discussed later and
separately") - 1.0010 remains the Stage 1 target; this pair only
phases the first increment. The "bare minimum" milestone of 0.0030
is re-read accordingly: scaffold + the two resources + `import` +
`export` + logging, verified end to end (import a `.bpmn` file, view
it in the preview, export it back, and diff the round-trip).

> **1.0080**: The MCP must manage more than one BPMN file at the same
> time, with every process identifiable via a UUID (e.g.
> `.../processes/<uuid>` URLs), and out-of-band file changes must be
> detectable. How is that arranged, and what is the source of truth?

Decision (user, 2026-10-24). Three parts:

1. **Source of truth**: the `.bpmn` file on disk (reversing 1.0020's
   original in-memory position); the in-memory trees are per-process
   caches.
2. **Identification and registry**: every registered process has a
   server-assigned UUID (v4); `diagrams/registry.json` (default
   location; the directory is configurable per 1.0030) maps each
   uuid to its file path, label, `lastKnownChecksum` (SHA-256), and
   timestamps. `import` (a path) parses the file, assigns or reuses
   the uuid, records the checksum, and returns the uuid; every other
   tool (`parse`, `change`, `validate`, `export`, `preview`) takes
   the uuid as its process parameter. The preview HTTP server
   addresses processes by the `.../processes/<uuid>` URL scheme
   (4.0010), and the `config` MCP resource (1.0070) exposes the
   registry location and the default diagram directory.
3. **Consistency**: every operation performs the conditional re-read
   with checksum (1.0020) - a match means serve from cache, a
   mismatch means out-of-band change (user or another MCP instance)
   and a re-parse that is noted in the tool result and the
   structured log (0.0070). Polling at operation time - no file
   watcher in the first draft.

Known limitation (recorded): the read-check-act sequence is not
lock-protected; two concurrent operations on the same process can
race (last write wins). Per-process locking (e.g. a lock file in the
registry directory) is a deferred improvement, not first-draft
scope.

**Superseded in part (2026-10-29/30, feat-1-bpmn-mcp-scaffold
planning):** part 2 ("Identification and registry") is superseded in
its `registry.json`-specific detail only. UUID process identification
and the `.../processes/<uuid>` preview URL scheme stand unchanged;
there is simply no `diagrams/registry.json` file to carry them -
`import` parses the file and reads or assigns the uuid from/to its
filename (`prc-<uuid>-<slug>.bpmn` under `docs/prc/`, pair 0.0300)
instead of looking it up in a registry, and the `config` MCP resource
exposes the resolved `docs`/`prc` path (REQ-010) rather than a
registry location. Part 1 (file as source of truth) and part 3 (the
conditional-re-read-by-checksum concept) are unaffected and still
stand; only where the checksum is now cached is left open to the
feature that implements the `prc` artifact core.

## Performance Efficiency

> **2.0010**: Any performance requirements elicited?

None specific. A single local process, small hand-sized diagrams, and
stdio tool-call round trips: the decision record already rated the MCP
transport overhead "negligible for a local tool". No throughput,
latency, or diagram-size targets were elicited for the first draft.

## Compatibility

> **3.0010**: Which MCP SDK and transport does the first draft use?

The official TypeScript SDK (`@modelcontextprotocol/sdk`) over the
stdio transport only. That SDK is what the most mature comparable
project (`Stieges/bpmn-generator`) runs on, and the repository's
`AGENTS.md` already points at "the official MCP SDK for TypeScript".
Network transports are not needed for a local agent host and are left
out of the first draft.

> **3.0020**: Under which FOSS license is the project itself
> released?

**AGPLv3** (the GNU Affero General Public License v3.0, only) -
corrected 2026-10-24 (user): the original answer named MIT ("matching
the bpmn.io toolkit (bpmn-moddle, bpmnlint) and the comparable
BPMN+MCP projects"), which does not match the repository's actual
license and is superseded. AGPLv3 is a Free and Open Source Software
license (strong copyleft with a network-use clause), so the FOSS
requirement is satisfied; no Stage 1 distribution occurs (the agent
host runs the package from disk, 0.0080), and the copyleft
obligations bind whoever later redistributes the code, not the local
user. The `LICENSE` at the repository root carries the verbatim FSF
text (byte-identical to `gnu.org/licenses/agpl-3.0.txt`, checked
2026-10-24); the per-file declaration of the "v3.0 only" grant is
the SPDX identifier `AGPL-3.0-only` in each source file's two-line
header (0.0290, CONSTITUTION principle 1) - the identifier itself
excludes later versions, so no per-source-file prose notice is
needed. The bpmn-js "bpmn.io License" (MIT plus the
unremovable
attribution-watermark clause) is a third-party dependency license,
already reviewed and accepted in the companion research Q&A -
unaffected by this correction.

> **3.0030**: Which Node.js/npm versions does the first draft target?

Development and testing on the system's Node.js v24 (LTS) and npm 11;
no lower bound is declared beyond what the MCP SDK itself requires.
Bun is not available in the environment, and the decision record
settled on Node.js, so the preview server uses the Node.js built-in
`http` module rather than the `Bun.serve()` sketch the 2026-10-22
session made for the (rejected) plugin variant.

## Interaction Capability

> **4.0010**: How does the Stage 1 browser preview work?

`preview` serves a self-contained HTML page running bpmn-js as a
Viewer: the page fetches the diagram of the requested process from
the endpoint `/processes/<uuid>` on the same server (UUID process
addressing per 1.0080), and bpmn-js renders it with the unmodified
"powered by bpmn.io" watermark. The preview server is a zero-dependency
`http` server inside the MCP server process, bound to localhost on a
fixed port (8080) for the first draft, and it stays alive across
repeated `preview` calls; the tool opens the user's default browser
pointed at it (`xdg-open` on Linux, `open` on macOS, `start` on
Windows — the same cross-platform trick `plannotator` uses). The
contract is turn-based: each `preview` call reflects the state of the
requested process at that moment (after its checksum re-read,
1.0080); nothing updates the page automatically.

> **4.0020**: What may a human do in the preview?

View only. No editing, no properties panel, no Modeler interaction —
that is Stage 2 territory (the full bpmn-js Modeler, optionally with
`bpmn-js-properties-panel`), deferred per the requirement's own note.
The first-draft page is a read-only Viewer.

## Reliability

> **5.0010**: Any reliability requirements elicited?

None beyond what the decision record already implies: the server is
its own process, independently restartable and inspectable. Loss of
in-memory state on restart is acceptable for the first draft, because
`export`/`import` is the durable path — a diagram is always recoverable
from the `.bpmn` file on disk. No uptime, crash-recovery, or
persistence guarantees were elicited.

## Security

> **6.0010**: Any security requirements elicited?

The tool runs entirely locally (local/on-prem requirement, no
mandatory cloud dependency), so the first-draft posture is: the
preview server binds to 127.0.0.1 only — never to a network interface
— and needs no authentication because only the local user can reach
it. No remote attack surface is introduced; `import` and `export`
read and write only paths explicitly supplied by the agent (i.e. the
local user's tool host).

## Maintainability

> **7.0010**: Which development toolchain does the first draft use?

npm (the installed package manager), TypeScript compiled with `tsc`
to a single executable bin under `dist/`, and vitest for tests. The
npm package is named `biz.dfch.bpmnmcp` (lowercase, matching the
repository's `biz.dfch.*` naming convention). The code is organized so
that the BPMN operations (create/change/import/export/validate/parse
on the moddle tree) live in a core module, and the MCP server and the
preview server are thin adapters over it — cheap now, and it keeps the
door open to the later OpenCode-plugin adapter and the Stage 2 canvas
server contemplated by the decision record.

> **7.0020**: How is the bpmnlint rule set configured, and how are
> findings reported?

A config file (`.bpmnlintrc`, JSON) lives in the repository and is the
single source for the rules; the first-draft default extends
`bpmnlint:recommended` via the config's `extends` block. `validate`
reports each finding to the agent as rule, element id (where the
finding attaches to one), and message, in a list in the tool result,
together with an overall status (no findings / N findings). Custom
rules remain possible by extending the same config — which is what the
"configurable" requirement demands.

<!-- Elicited 2026-10-31 during the feat-2-prc-import-export planning: the user requested ArchUnit-style architecture unit tests for the TypeScript codebase, recorded as a constitution principle. -->

> **7.0030**: How are the architectural constraints (module
> layering, dependency directions, circular dependencies) enforced?

Decision (user, 2026-10-31; CONSTITUTION principle 4): the
architecture is tested, not written about. The architectural rules
are **architecture unit tests** in the component's vitest suite,
written with **`archunit` (ArchUnitTS)** -- the npm package
`archunit` (MIT), an architecture-testing library for
TypeScript/JavaScript, inspired by the Java ArchUnit library but not
affiliated with it. The rules run under the existing `npm test`
gate (CI + pre-commit), so no new CI step is introduced (principle
3: the machine home of this convention is the test gate).

Options considered: (1) `archunit` (ArchUnitTS) -- an
ArchUnit-style rule DSL over the project's TypeScript module graph
(`dependOnFiles` for intra-project boundaries, `haveNoCycles` for
cycles, content-based `adhereTo` custom conditions for external
dependencies), integrating with vitest through the `toPassAsync()`
matcher (which requires `globals: true` in `vitest.config.ts`);
(2) `dependency-cruiser` -- a standalone config + CLI, a new gate
step; (3) ESLint import rules -- lint-level, weaker for
graph-level rules; (4) a hand-rolled import scanner -- fragile, and
re-implements what (1) and (2) already solve. Chosen: (1), at the
user's explicit request ("archunit") -- the closest TypeScript
equivalent of the ArchUnit-style architecture tests requested.

The initial rule set (machine home:
`apps/mcp-server/test/architecture.test.ts`) encodes the layering
decided in 7.0010 (the core module with thin protocol adapters, the
Stage 2 split kept possible) and the boundary decisions of
0.0300/1.0080 (the core owns the filesystem, the adapters never
touch it): no cycles in `src/**`; `src/**` does not depend on
`test/**`; `src/prc/**` (the core, landing in
feat-2-prc-import-export) does not depend on the adapter files
`src/server.ts`/`src/index.ts` and does not import
`@modelcontextprotocol/sdk`; the adapters do not import `node:fs`.
Rules targeting modules that do not exist yet run with
`allowEmptyTests` and bite as soon as the module lands. At
introduction, deliberate violations (a cycle, an SDK import in the
core, a `node:fs` import in an adapter) were verified to fail their
rules, per the drift-gate culture of 0.0290/ACC-003.

**Integration details.** `toPassAsync()` requires vitest's
`globals: true` -- archunit extends the *global* `expect` at import
time and throws a configuration error when the global `expect` is
absent -- so `apps/mcp-server/vitest.config.ts` carries
`globals: true`. The suite keeps the repository's convention of
explicit `import { describe, expect, it } from 'vitest'` (the
imported `expect` is the same instance the global points to, so the
extended matcher is available through it). The matcher's types are
declared by archunit against a global `VitestAssertion` interface
that vitest's own `Assertion` does not reference, so the suite
carries a module augmentation (`declare module 'vitest'`, mirroring
vitest's `Assertion<R, T>` declaration exactly) that types
`toPassAsync()` under `strict`.

**Dependency audit note (minimatch)**: `archunit` depends
transitively on `minimatch` (declared `^10.0.1`). The advisory
GHSA-g3hv-75wg-m249 (moderate, a potential denial of service via
globparts amplification) is fixed in `minimatch` 11.0.1 (released
2026-10-27); the advisory itself was published *after* feat-1's
audit run (2026-10-30, which reported 0 vulnerabilities against
the then-committed lock file) -- so the pre-existing `minimatch`
copies (the eslint subtree at 3.1.5, typescript-estree at 10.2.6)
were flagged by the new advisory independently of `archunit`.
The root `package.json` `overrides` therefore pin `minimatch`
to 11.0.1 across the tree (verified
API-compatible at all three call sites: the named `minimatch()`
function and the `Minimatch` class, with identical signatures in
10.2.6 and 11.0.1) **except archunit's own copy**, which a nested
override keeps at 10.2.6: `archunit` 2.5.4 calls
`minimatch.makeRe()`, which 11.0.1 removed from its public exports,
and no `minimatch`-11-compatible `archunit` release exists yet
(2.5.4, 2026-09-13, is the latest). Known residual: one moderate
finding (`archunit` -> `minimatch` 10.2.6), tracked here until an
`archunit` release compatible with `minimatch` 11 ships and the
nested override is dropped. The practical risk of the residual is
low: the vulnerable code path requires attacker-crafted glob
patterns, and the consumers here are dev-only (eslint,
typescript-estree, archunit) with glob inputs coming from this
repository's own committed code -- no untrusted input reaches
`minimatch`. `npm audit fix --force` would downgrade `archunit` to
2.1.31 (a breaking change) -- rejected, per the
targeted-remediation precedent of feat-1's Phase 130.

## Flexibility

> **8.0010**: Any flexibility or extensibility requirements elicited?

Two concrete knobs for the first draft: the bpmnlint rule set is
configurable (see above), and the default diagram directory is
overridable (environment variable or startup argument). Beyond that,
the extensibility constraint is architectural rather than functional:
Stage 2 (live canvas) is expected to become a separate canvas-server
process (web UI + REST + WebSocket sync, per the
`yctimlin/mcp_excalidraw` precedent cited in the decision record), so
the first draft must not hardwire its state model in a way that
precludes that split. The core-module/adapters layout (7.0010) is the
first-draft answer to that.

## Safety

> **9.0010**: Any safety requirements elicited?

None specific — this is a local development tool with no
safety-relevant behavior. One deliberate choice is recorded here:
`export` overwrites the target file only when an explicit path is
given, and `create` never writes to disk by itself (the diagram lives
in memory until the agent exports it), so an agent run cannot silently
clobber an existing file without an explicit `export` call.

## More Information

- GitHub issue: https://github.com/dfch/biz.dfch.BpmnMcp/issues/1 —
  "Create an MCP server for BPMN 2.0 modeling with a local browser
  viewer interface" (opened 2026-10-22, label `enhancement`). This
  Q&A backs the first-draft implementation of that issue.
- The transcript of the earlier 2026-10-22 research session is stored
  in the repository as `session-feat-0-bpmn-ses_e9db.md`; the
  finer-grained tool surface and the `Bun.serve()`/`xdg-open` preview
  sketch discussed there were superseded or adapted as recorded in
  1.0010, 3.0030, and 4.0010.

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

### Requirements

- REQ abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6: The tool must be free and open source software
- REQ 94d75c0f-da9d-4f43-8253-936747ff2fe9: The tool must run entirely locally or on-premises
- REQ 7b9dca78-7432-43bb-af33-8374edb232a4: The tool shall create new BPMN 2.0 process diagrams
- REQ 8b53fa5a-de89-402b-8b68-ec6ddc1e8e25: The tool shall change elements and flows in an existing BPMN 2.0 diagram
- REQ 5e0fa899-683e-4c32-bb13-6a2dee03a516: The tool shall import existing BPMN 2.0 XML files
- REQ b4d4fa31-9ba8-4967-be59-9d23cc7f9213: The tool shall export the current diagram as BPMN 2.0 XML
- REQ f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0: The tool shall validate a diagram against configurable modeling rules
- REQ a36fb3d9-a285-49c9-b5b4-deb2f55b8998: The tool shall parse BPMN 2.0 XML into an addressable, structured model
- REQ 0caae3bd-b4e8-47c6-a417-520766031f27: The tool shall expose its functionality as a Model Context Protocol server
- REQ bb63c11f-c3e2-4ed0-8f4e-5453b28260f6: The tool shall let a human view the current diagram in a browser after an agent change

### Q&A

- QA 28a4470d-287e-452e-b59e-d336155b0bfd: BPMN Modeling Tool for Agent and Human Use — Research Q&A
