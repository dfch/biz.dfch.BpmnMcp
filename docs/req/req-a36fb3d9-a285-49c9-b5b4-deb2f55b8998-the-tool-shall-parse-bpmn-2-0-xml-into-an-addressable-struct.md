---
classification: null
created: '2026-10-22T17:50:48.407+02:00'
id: a36fb3d9-a285-49c9-b5b4-deb2f55b8998
status: draft
type: req
updated: '2026-10-22T17:52:14.252+02:00'
version: 1.0.0
---

# The tool shall parse BPMN 2.0 XML into an addressable, structured model

The tool must represent the current diagram as a structured,
addressable model of its elements and flows, not only as raw XML text.

## Description

The tool must expose the current diagram as a structured, in-memory
object model (elements, flows, their properties and relationships),
not only as an opaque XML string, so that an agent can query and
reference individual elements by id.

## Characteristics

1. Functional completeness

## Level

MUST

## Priority

20

## Tags

- bpmn
- parse
- bpmn-moddle

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
