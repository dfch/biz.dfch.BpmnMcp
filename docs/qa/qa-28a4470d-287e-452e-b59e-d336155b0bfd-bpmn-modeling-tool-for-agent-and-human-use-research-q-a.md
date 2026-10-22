---
classification: null
created: '2026-10-22T17:49:56.496+02:00'
id: 28a4470d-287e-452e-b59e-d336155b0bfd
status: draft
type: qa
updated: '2026-10-22T17:49:56.496+02:00'
version: 1.0.0
---

# BPMN Modeling Tool for Agent and Human Use — Research Q&A

## General

### Introduction

Interactive research conversation with an AI coding agent (OpenCode),
conducted 2026-10-22, exploring options for a BPMN modeler usable by
both a human and an AI agent, prior to starting the `biz.dfch.BpmnMcp`
project. Covers the BPMN tooling landscape, licensing constraints,
comparable MCP and OpenCode-plugin projects, and the resulting
architecture decision.

### Raw Requirements

> I want to use a BPMN modeler that has a UI that a user and an agent
> can both concurrently use to create, change, import, export,
> validate and parse BPMN diagrams.

Follow-up constraints added during the conversation:

> ... must be: FOSS; local / on-prem on the same system where the
> OpenCode instance runs.

> I hoped for something like Excalidraw — where an agent can draw the
> image on the same canvas and a user can see this in realtime.

## Elicitation Context

<!-- Elicited 2026-10-22, researching the general BPMN tooling landscape before any FOSS/local constraint was stated. -->

> **0.0010**: What are the general options for a BPMN modeler UI usable
> by both a human and an agent?

Turnkey collaborative SaaS platforms (Camunda 8 Web Modeler, SAP
Signavio, Bizagi); the open-source bpmn.io toolkit (bpmn-js,
bpmn-moddle, bpmnlint), self-hosted; or a file-based "take turns"
pattern where both sides read/write the same `.bpmn` XML file, the
same way this environment's `specmgr` already manages other document
types.

> **0.0020**: Once narrowed to FOSS and local/on-prem only, which
> options remain?

The bpmn.io toolkit (bpmn-js + bpmn-moddle + bpmnlint, self-hosted,
MIT/"bpmn.io License"); Camunda Desktop Modeler (MIT, Electron,
single-user, turn-based on the shared file); Flowable Modeler / jBPM
designer (Apache-2.0, web-based, lock-based rather than live
collaboration). Camunda 8 Web Modeler, Signavio, and Bizagi were
eliminated: cloud or non-FOSS-licensed self-managed.

## Functional Suitability

> **1.0010**: Why are both bpmn-moddle and bpmnlint needed?

bpmn-moddle is the parser/serializer: it reads/writes BPMN 2.0 XML
into/from a structured object tree according to the BPMN meta-model,
with no opinion on whether the diagram is semantically sound.
bpmnlint is a separate, configurable rule-based linter that runs on
the tree bpmn-moddle produces, checking modeling-correctness and style
(missing start/end events, disconnected elements, missing labels,
...). moddle alone would let a diagram "validate" while being
semantically broken; bpmnlint supplies the actual validate capability.

> **1.0020**: Is there an existing BPMN modeler with an Excalidraw-like
> live canvas (agent draws, human watches/interacts in real time)?

No FOSS BPMN equivalent was found. The precedent architecture exists
for Excalidraw (`yctimlin/mcp_excalidraw`, MIT): a canvas-server
process (web UI + REST + WebSocket sync) plus a thin MCP/CLI client,
broadcasting every agent change to any open browser tab and vice
versa. Several BPMN+MCP projects exist (`dattmavis/BPMN-MCP`,
`oisee/mcp-bpmn`, `Stieges/bpmn-generator`, the most mature of the
three) but all are headless XML/SVG generators; none provide a live,
two-way-synchronized canvas. This is a genuine gap, not a solved
problem, and is deferred as a future "Stage 2" rather than built now.

> **1.0030**: Was a pure-Python BPMN implementation considered, to match
> this project's `uv`-based scaffold?

Yes, but the scaffold turned out not to be a deliberate language
commitment (a placeholder for incidental scripting only), so this was
moot. For the record: the one mature pure-Python BPMN project found,
SpiffWorkflow (1.9k★, LGPL-3.0), is a parser and execution engine; its
own credits state it relies on bpmn-js for any visual editor, and it
has no equivalent to bpmnlint's configurable validation or to a
diagram auto-layout engine. A pure-Python path would have meant
reimplementing meaningful parts of what bpmn-moddle/bpmnlint/bpmn-js
already solve.

## Performance Efficiency

> **2.0010**: Any performance requirements elicited?

TODO: answer pending

## Compatibility

> **3.0010**: Should this be built as an OpenCode v2 plugin or as an
> MCP server?

MCP server, to stay independent of any one agent host. An OpenCode v2
plugin would allow deeper, single-process integration (tool-call
hooks, native permission prompts, posting messages into the chat
transcript) and has real precedent for exactly this "agent + live
local browser UI" pattern (the `octto`, 525★, and `plannotator`
plugins), but only works inside OpenCode. MCP's protocol itself is
host-agnostic; the implementation language is not, in either case —
OpenCode v2 plugins must be JavaScript/TypeScript, and the only mature
FOSS BPMN tooling is also JavaScript/TypeScript, so an MCP server in
Node/TypeScript gives the portability without giving up the tooling.

> **3.0020**: Does the bpmn.io License's attribution watermark clause
> conflict with the FOSS requirement?

No. The "bpmn.io License" is MIT plus one clause: a small "powered by
bpmn.io" link rendered on the canvas must stay visible and unmodified.
No fee, no closed-source obligation, no registration. Accepted as
compliant, and a non-issue for a tool used locally rather than
exposed as a public product.

## Interaction Capability

> **4.0010**: What editing capability should the eventual live canvas
> (Stage 2) expose to the human?

Reuse bpmn-js's existing Modeler as-is (drag/drop, connect, delete —
all built in), rather than building a custom renderer; optionally add
`bpmn-js-properties-panel` (also MIT) later if editing names/ids/
attributes through the UI is wanted, not only moving/connecting
elements. Deferred along with the rest of Stage 2.

## Reliability

> **5.0010**: Any reliability requirements elicited?

TODO: answer pending

## Security

> **6.0010**: Any security requirements elicited?

TODO: answer pending

## Maintainability

> **7.0010**: Why prefer existing libraries (bpmn-moddle, bpmnlint,
> bpmn-js) over a custom implementation?

All three are mature, actively maintained, widely used (bpmn-js:
9.7k★; bpmn-moddle/bpmnlint: maintained by the same bpmn.io/Camunda
team), and already solve BPMN 2.0 XML parsing, modeling-rule
validation, and interactive rendering to a depth that would be
significant, ongoing effort to reproduce and keep standards-compliant.

## Flexibility

> **8.0010**: Any flexibility/extensibility requirements elicited?

TODO: answer pending

## Safety

> **9.0010**: Any safety requirements elicited?

TODO: answer pending

## More Information

See the companion decision record ("Use a Node/TypeScript MCP Server
for Agent-Driven BPMN Modeling") and the ten companion requirement
documents produced alongside this Q&A.
