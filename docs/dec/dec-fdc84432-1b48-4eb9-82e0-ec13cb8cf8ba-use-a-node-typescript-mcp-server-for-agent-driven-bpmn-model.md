---
classification: null
created: '2026-10-22T17:51:16.799+02:00'
id: fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba
status: draft
type: dec
updated: '2026-10-22T17:52:00.717+02:00'
version: 1.0.0
---

# Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Context and Problem Statement

A user and an AI coding agent need to create, change, import, export,
validate, and parse BPMN 2.0 process diagrams, starting with a workflow
where the agent edits a diagram and the user can view the result in a
browser. The solution must be Free and Open Source Software (FOSS) and
must run entirely locally / on-premises, on the same system as the
agent host, with no mandatory cloud dependency.

## Decision Drivers

- FOSS licensing, no paid component required
- Local / on-premises operation only
- The solution must not be locked to one specific AI agent host
- Reuse of mature, well-maintained BPMN tooling over custom-built
  parsing, linting, or rendering
- Low operational complexity (few moving parts, few runtimes)

## Considered Options

- MCP (Model Context Protocol) server, implemented in Node/TypeScript
- An OpenCode v2 plugin
- A hybrid: a shared core library with both an MCP adapter and an
  OpenCode v2 plugin adapter
- An MCP server implemented in Python, delegating BPMN-specific
  operations to a bundled Node.js helper process

## Decision Outcome

Chosen option: "MCP server, implemented in Node/TypeScript", because it
is the only option that is both host-agnostic (usable from any
MCP-capable agent, not only OpenCode) and free of any cross-language
bridge. The mature, actively maintained, FOSS BPMN tooling needed for
this project (bpmn-moddle, bpmnlint, bpmn-js) exists only as
JavaScript/TypeScript libraries; authoring the server itself in the
same language avoids adding a second runtime or a subprocess bridge.

### Consequences

- The project depends on Node.js as its runtime, and on the bpmn.io
  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.
- The server is usable from any MCP-compatible agent host, not only
  OpenCode.
- A later OpenCode-specific integration (e.g. for deeper, host-native
  hooks) remains possible as an additional, separate adapter on top of
  the same core, without changing this decision.
- bpmn-js ships under the "bpmn.io License" (MIT plus a clause
  requiring its small attribution watermark to remain visible and
  unmodified on any rendered canvas). This is accepted; see Pros and
  Cons of Option 1 below.

### Confirmation

This decision is confirmed once a minimal MCP server built on
bpmn-moddle and bpmnlint can create, import, export, validate, and
parse a BPMN 2.0 diagram end to end, and a human can view the current
diagram in a browser after an agent-driven change (Stage 1 scope; see
the related requirements).

## Roles and Responsibilities

### Accountable

Ronald Rink

### Responsible

- Ronald Rink
- The implementing AI coding agent

### Support

### Consulted

### Informed

## Tags

- bpmn
- mcp
- foss
- architecture

## Source

Design discussion and research conducted interactively with an AI
coding agent (OpenCode), researching BPMN modeler options, the
bpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2
plugin API, prior to starting the `biz.dfch.BpmnMcp` project.

## Related Artifacts

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

## Pros and Cons

### Option 1: MCP server, implemented in Node/TypeScript

- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable
  with no cross-language bridge.
- Good, because MCP is a stable, cross-vendor protocol usable from any
  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,
  OpenCode, ...), not only OpenCode.
- Good, because it runs as its own process, independently restartable
  and inspectable, isolated from the agent host's own process.
- Bad, because it adds a tool-call round trip through the MCP
  transport (stdio or network) rather than an in-process function
  call; negligible for a local tool.
- Bad, because a later real-time, two-way-synced browser canvas
  (Stage 2) needs an additional, separate canvas-server process next
  to the MCP server process, rather than a single shared process.
- Bad, because bpmn-js's "bpmn.io License" requires a small,
  unremovable attribution watermark to stay visible on any rendered
  canvas; accepted as a non-issue for a local, non-public tool.

### Option 2: An OpenCode v2 plugin

- Good, because it runs in a single process together with the
  OpenCode host, simplifying a future real-time, two-way-synced
  browser canvas (Stage 2): one process, shared in-memory state.
- Good, because it can hook other tool calls
  (`ctx.tool.hook("execute.after")`), use OpenCode's own permission
  prompts (`ctx.permission.assert`), and post messages directly into
  the chat transcript (`ctx.session.synthetic`).
- Bad, because it only works inside OpenCode, directly violating the
  "not locked to one agent host" driver.
- Bad, because the v2 plugin API is new, and several of its hooks are
  explicitly marked experimental; more exposure to breaking changes
  than the MCP protocol.
- Bad, because OpenCode v2 plugins must be authored in
  JavaScript/TypeScript; this is not itself a downside relative to
  Option 1, but it buys no portability in exchange for the same
  language constraint.

### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)

- Good, because it keeps the door open to both host-agnostic use and
  deep OpenCode-native integration later.
- Good, because the core BPMN logic (parsing, validation, the canvas
  server) is written once and reused by both adapters.
- Bad, because it is the most engineering effort of the options
  considered, for a benefit (the second, OpenCode-specific adapter)
  that is not needed yet.
- Bad, because it is premature: no Stage 2 (live-canvas) requirement
  exists yet to justify the extra adapter.

### Option 4: Python MCP server with a bundled Node.js helper

- Good, because it would match a Python-first tooling convention, had
  one been required for this project.
- Bad, because it still depends on the same Node.js-only BPMN
  libraries under the hood, adding a second runtime and a subprocess
  or sidecar bridge for no corresponding benefit.
- Bad, because the one mature pure-Python BPMN project found
  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and
  has no equivalent to bpmnlint's configurable modeling-rule
  validation or to a diagram auto-layout engine.
- Not chosen: this project was not, in fact, committed to Python; an
  initial `uv`-based scaffold existed only as a placeholder for
  incidental scripting, not as a language decision.

## More Information

Comparable, publicly available BPMN+MCP projects exist (e.g.
`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all
headless (no live browser canvas). The closest architectural precedent
for a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`
(an MCP server for Excalidraw, not BPMN), which splits into a
canvas-server process (web UI + REST + WebSocket sync) and a thin
MCP/CLI client; this is the model to follow if/when Stage 2 (live
canvas) is undertaken for BPMN.

## Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

### 2026-10-22T17:51:00.000Z - Created

Initial decision record, drafted from an interactive research
conversation prior to starting implementation.
