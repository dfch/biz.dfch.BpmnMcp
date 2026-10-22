---
classification: null
created: '2026-10-22T17:50:42.658+02:00'
id: 5e0fa899-683e-4c32-bb13-6a2dee03a516
status: draft
type: req
updated: '2026-10-22T17:52:09.068+02:00'
version: 1.0.0
---

# The tool shall import existing BPMN 2.0 XML files

The tool must read an existing BPMN 2.0 XML document and load it as
the current diagram.

## Description

The tool must read a BPMN 2.0 XML document from disk (or from supplied
text) and load it as the current, addressable diagram, using
bpmn-moddle for structural parsing.

## Characteristics

1. Functional completeness
2. Compatibility

## Level

MUST

## Priority

20

## Tags

- bpmn
- import
- bpmn-moddle

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
