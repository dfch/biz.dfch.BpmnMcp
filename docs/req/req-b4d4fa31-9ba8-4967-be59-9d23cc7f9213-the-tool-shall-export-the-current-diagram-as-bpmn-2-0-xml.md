---
classification: null
created: '2026-10-22T17:50:44.358+02:00'
id: b4d4fa31-9ba8-4967-be59-9d23cc7f9213
status: draft
type: req
updated: '2026-10-22T17:52:10.714+02:00'
version: 1.0.0
---

# The tool shall export the current diagram as BPMN 2.0 XML

The tool must write the current diagram as a standard-compliant BPMN
2.0 XML document.

## Description

The tool must serialize the current, in-memory diagram back to a
standard-compliant BPMN 2.0 XML document, using bpmn-moddle, suitable
for opening in any BPMN 2.0 compliant tool.

## Characteristics

1. Functional completeness
2. Compatibility

## Level

MUST

## Priority

20

## Tags

- bpmn
- export
- bpmn-moddle

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
