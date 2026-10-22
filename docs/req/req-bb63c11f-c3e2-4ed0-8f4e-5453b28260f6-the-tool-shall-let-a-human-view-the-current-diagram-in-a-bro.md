---
classification: null
created: '2026-10-22T17:50:53.019+02:00'
id: bb63c11f-c3e2-4ed0-8f4e-5453b28260f6
status: draft
type: req
updated: '2026-10-22T17:52:17.881+02:00'
version: 1.0.0
---

# The tool shall let a human view the current diagram in a browser after an agent change

The tool must let a human view the current diagram in a web browser
after an agent creates or changes it.

## Description

After an agent creates or changes a diagram, a human must be able to
open a local web browser and see the current state of that diagram,
rendered visually (not as raw XML). For this first stage, this may be
a turn-based preview (an explicit preview step reloads the current
diagram) rather than a continuously live, two-way synchronized canvas.

## Characteristics

1. Operability

## Level

MUST

## Priority

30

## Tags

- bpmn
- preview
- bpmn-js
- stage-1

## Source

User requirement, stated directly at the start of this project, scoped
down to a turn-based preview for the first implementation stage.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

A later, live, two-way-synchronized browser canvas (both the agent and
the human editing the same diagram in real time) was discussed and
deferred; see the Decision's "More Information" section for the
architectural precedent (`yctimlin/mcp_excalidraw`) to follow if and
when that stage is undertaken.
