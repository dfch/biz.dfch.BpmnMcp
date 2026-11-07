// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { ModdleElement } from 'moddle';
import {
  addElement,
  connect,
  createProcess,
  deleteElement,
  updateElement,
  ELEMENT_TYPES,
  type AddElementResult,
  type ConnectResult,
  type CreateProcessResult,
  type DeleteElementResult,
  type EditingFailure,
  type UpdateElementResult,
} from '../../src/prc/editing.js';
import {
  collectShapeBounds,
  getEdgeForElement,
  getShapeBounds,
  getPlane,
  rectanglesOverlap,
  sizeForElement,
} from '../../src/prc/layout.js';
import {
  collectElementInventory,
  createBpmnElement,
  parseBpmn,
  serializeBpmn,
  type BpmnRootElement,
} from '../../src/prc/moddle.js';

// Resolve the fixture directory independent of the test runner's
// working directory (test/prc/ -> test/ -> fixtures/).
const FIXTURES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures');

/** Reads a committed fixture as text. */
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');

/** A parsed document without any DI (two tasks, no diagram). */
const NO_DI_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D">
  <bpmn:process id="p" isExecutable="false">
    <bpmn:task id="t1" />
    <bpmn:task id="t2" />
  </bpmn:process>
</bpmn:definitions>`;

/** A parsed document with a sub-process carrying an inner task. */
const NESTED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D">
  <bpmn:process id="p" isExecutable="false">
    <bpmn:task id="outer" />
    <bpmn:subProcess id="sub">
      <bpmn:task id="inner" />
    </bpmn:subProcess>
  </bpmn:process>
</bpmn:definitions>`;

/** Narrows a createProcess result to its success side. */
function expectCreated(result: CreateProcessResult): Extract<CreateProcessResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the create result must be a success');
  }
  return result;
}

/** Narrows an addElement result to its success side. */
function expectAdded(result: AddElementResult): Extract<AddElementResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the add result must be a success');
  }
  return result;
}

/** Narrows an updateElement result to its success side. */
function expectUpdated(result: UpdateElementResult): Extract<UpdateElementResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the update result must be a success');
  }
  return result;
}

/** Narrows a connect result to its success side. */
function expectConnected(result: ConnectResult): Extract<ConnectResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the connect result must be a success');
  }
  return result;
}

/** Narrows a deleteElement result to its success side. */
function expectDeleted(result: DeleteElementResult): Extract<DeleteElementResult, { ok: true }> {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('unreachable: the delete result must be a success');
  }
  return result;
}

/** Asserts a structured failure with the given code and a single-line message. */
function expectEditingFailure(result: unknown, code: EditingFailure['error']['code']): EditingFailure {
  expect(result).toMatchObject({ ok: false });
  const failure = result as EditingFailure;
  expect(failure.error.code).toBe(code);
  expect(failure.error.message.length).toBeGreaterThan(0);
  expect(failure.error.message).not.toMatch(/[\r\n]/);
  return failure;
}

describe('createProcess (feat-17 REQ-001/REQ-003/REQ-004)', () => {
  it('builds a fresh Definitions/Process tree with its DI roots and the derived identity', () => {
    const created = expectCreated(createProcess('Order Process'));

    expect(created.processId).toBe('order-process');
    expect(created.slug).toBe('order-process');
    expect(created.elementCount).toBe(0);
    expect(created.tree.$type).toBe('bpmn:Definitions');
    const process = created.tree.rootElements[0];
    expect(process.$type).toBe('bpmn:Process');
    expect(process.id).toBe('order-process');
    expect(process.name).toBe('Order Process');
    expect(getPlane(created.tree)).toBeDefined();
    expect(getPlane(created.tree)?.bpmnElement).toBe(process);

    // The tree serializes to a viewable (diagram-carrying) document.
    const xml = serializeBpmn(created.tree).then((text) => text);
    return expect(xml).resolves.toContain('<bpmndi:BPMNDiagram');
  });

  it('derives the process id from the name (digit-leading names are prefixed, empty slugs fall back)', () => {
    expect(expectCreated(createProcess('2 Fast Orders')).processId).toBe('process-2-fast-orders');
    expect(expectCreated(createProcess('!!!')).processId).toBe('process');
    expect(expectCreated(createProcess('Übung Lauf')).processId).toBe('übung-lauf');
  });

  it('adds initial elements with generated ids and DI (explicit x/y as-is, omitted grid-placed)', () => {
    const created = expectCreated(
      createProcess('Order Process', [
        { type: 'start-event', name: 'Begin' },
        { type: 'task', name: 'Work' },
        { type: 'end-event', x: 123, y: 45 },
      ]),
    );
    expect(created.elementCount).toBe(3);

    const ids = collectElementInventory(created.tree)
      .filter((ref) => ref.type.startsWith('bpmn:'))
      .map((ref) => ref.id);
    expect(ids).toContain('startEvent_1');
    expect(ids).toContain('task_1');
    expect(ids).toContain('endEvent_1');

    // Explicit coordinates are honored as-is (never snapped to the grid).
    expect(getShapeBounds(created.tree, 'endEvent_1')).toEqual({ x: 123, y: 45, width: 36, height: 36 });
    // Omitted coordinates are grid-placed, and nothing overlaps.
    const bounds = collectShapeBounds(created.tree);
    expect(bounds).toHaveLength(3);
    for (let i = 0; i < bounds.length; i += 1) {
      for (let j = i + 1; j < bounds.length; j += 1) {
        expect(rectanglesOverlap(bounds[i], bounds[j])).toBe(false);
      }
    }
  });

  it('honors a caller-supplied initial element id and rejects a duplicate', () => {
    const ok = expectCreated(createProcess('P', [{ type: 'task', id: 'my-task' }]));
    expect(collectElementInventory(ok.tree).map((ref) => ref.id)).toContain('my-task');

    const dup = createProcess('P', [
      { type: 'task', id: 'same' },
      { type: 'end-event', id: 'same' },
    ]);
    expectEditingFailure(dup, 'duplicate-element-id');
  });

  it('returns structured errors for blank names and malformed initial elements', () => {
    expectEditingFailure(createProcess('   '), 'invalid-property');
    expectEditingFailure(createProcess('P', [{ type: 'task', x: -1 }]), 'invalid-coordinates');
    expectEditingFailure(createProcess('P', [{ type: 'task', id: 'bad id' }]), 'invalid-id');
    // The unknown-type message names the given type and lists the Stage 1 set.
    const bad = expectEditingFailure(createProcess('P', [{ type: 'warp-gate' }]), 'unknown-element-type');
    expect(bad.error.message).toContain('warp-gate');
    for (const type of Object.keys(ELEMENT_TYPES)) {
      expect(bad.error.message).toContain(type);
    }
  });
});

describe('addElement (feat-17 REQ-002/REQ-003/REQ-004)', () => {
  it('adds every Stage 1 element type with a generated id and the standard-size DI', () => {
    for (const [name, moddleType] of Object.entries(ELEMENT_TYPES)) {
      const created = expectCreated(createProcess('P'));
      const added = expectAdded(addElement(created.tree, { type: name }));
      expect(added.id).toBe(`${TYPE_PREFIX[moddleType]}_1`);
      expect(added.type).toBe(name);
      const process = created.tree.rootElements[0] as ModdleElement;
      const element = process.flowElements.find((child: ModdleElement) => child.id === added.id) as ModdleElement;
      const size = sizeForElement(element);
      expect(getShapeBounds(created.tree, added.id)).toEqual({
        x: 80,
        y: 80,
        width: size.width,
        height: size.height,
      });
    }
  });

  it('places auto elements on the grid without overlap across repeated adds', () => {
    const created = expectCreated(createProcess('P'));
    const ids: string[] = [];
    for (let i = 0; i < 4; i += 1) {
      ids.push(expectAdded(addElement(created.tree, { type: 'task' })).id);
    }
    expect(ids).toEqual(['task_1', 'task_2', 'task_3', 'task_4']);
    const bounds = collectShapeBounds(created.tree);
    expect(bounds).toHaveLength(4);
    for (let i = 0; i < bounds.length; i += 1) {
      for (let j = i + 1; j < bounds.length; j += 1) {
        expect(rectanglesOverlap(bounds[i], bounds[j])).toBe(false);
      }
    }
    // All four land on the cell lattice.
    for (const b of bounds) {
      expect(b.x % 80).toBe(0);
      expect(b.y % 80).toBe(0);
    }
  });

  it('honors explicit x/y as-is and records the name', () => {
    const created = expectCreated(createProcess('P'));
    const added = expectAdded(addElement(created.tree, { type: 'task', name: 'The Task', x: 123, y: 45 }));
    expect(added).toMatchObject({ id: 'task_1', x: 123, y: 45, name: 'The Task' });
    expect(getShapeBounds(created.tree, 'task_1')).toEqual({ x: 123, y: 45, width: 100, height: 80 });
  });

  it('generates family-aware ids over existing ids of the same family', () => {
    const created = expectCreated(createProcess('P', [{ type: 'task', id: 'task_1' }]));
    expect(expectAdded(addElement(created.tree, { type: 'task' })).id).toBe('task_2');
    // A bare family name taken by a caller id still yields the _1 successor.
    const bare = expectCreated(createProcess('P', [{ type: 'task', id: 'task' }]));
    expect(expectAdded(addElement(bare.tree, { type: 'task' })).id).toBe('task_1');
  });

  it('honors a caller-supplied id and rejects duplicates, invalid shapes, and empty-as-unset', () => {
    const created = expectCreated(createProcess('P', [{ type: 'task', id: 'task_1' }]));
    expect(expectAdded(addElement(created.tree, { type: 'end-event', id: 'custom-end' })).id).toBe('custom-end');

    const dup = addElement(created.tree, { type: 'end-event', id: 'task_1' });
    expectEditingFailure(dup, 'duplicate-element-id');
    // A duplicate of a DI id (model and DI share the id space) fails too.
    const diDup = addElement(created.tree, { type: 'end-event', id: 'shape_task_1' });
    expectEditingFailure(diDup, 'duplicate-element-id');

    const invalid = addElement(created.tree, { type: 'end-event', id: 'has space' });
    expectEditingFailure(invalid, 'invalid-id');

    // An empty id is treated as unset (generated).
    const unset = expectAdded(addElement(created.tree, { type: 'end-event', id: '' }));
    expect(unset.id).toBe('endEvent_1');
  });

  it('rejects unknown types and invalid coordinates (single-axis, negative, fractional, NaN)', () => {
    const created = expectCreated(createProcess('P'));
    expectEditingFailure(addElement(created.tree, { type: 'message-flow' }), 'unknown-element-type');
    expectEditingFailure(addElement(created.tree, { type: 'task', x: 10 }), 'invalid-coordinates');
    expectEditingFailure(addElement(created.tree, { type: 'task', x: -1, y: 10 }), 'invalid-coordinates');
    expectEditingFailure(addElement(created.tree, { type: 'task', x: 10, y: 10.5 }), 'invalid-coordinates');
    expectEditingFailure(addElement(created.tree, { type: 'task', x: Number.NaN, y: 10 }), 'invalid-coordinates');
  });

  it('fails with no-process for a document without a process', () => {
    const tree = createBpmnElement('bpmn:Definitions', { id: 'D' }) as BpmnRootElement;
    expectEditingFailure(addElement(tree, { type: 'task' }), 'no-process');
  });

  it('adds into an imported document, keeping its existing DI untouched', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const added = expectAdded(addElement(tree, { type: 'task' }));
    expect(added.id).toBe('task_1');
    // The pre-existing shapes keep their exact bounds.
    expect(getShapeBounds(tree, 'review-task')).toEqual({ x: 252, y: 80, width: 100, height: 80 });
    // The new shape does not overlap any pre-existing one.
    const newBounds = getShapeBounds(tree, 'task_1');
    if (newBounds === undefined) {
      throw new Error('unreachable: the added element must carry a shape');
    }
    const others = collectShapeBounds(tree).filter((b) => !(b.x === newBounds.x && b.y === newBounds.y));
    for (const b of others) {
      expect(rectanglesOverlap(newBounds, b)).toBe(false);
    }
  });
});

/** The id prefix per metamodel type (mirrors the module's generation scheme). */
const TYPE_PREFIX: Record<string, string> = {
  'bpmn:StartEvent': 'startEvent',
  'bpmn:EndEvent': 'endEvent',
  'bpmn:IntermediateCatchEvent': 'intermediateCatchEvent',
  'bpmn:Task': 'task',
  'bpmn:SubProcess': 'subProcess',
  'bpmn:ExclusiveGateway': 'exclusiveGateway',
  'bpmn:ParallelGateway': 'parallelGateway',
};

describe('updateElement (feat-17 REQ-002/REQ-003, scoped property set)', () => {
  it('renames any flow element (node and sequence flow)', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    expect(expectUpdated(updateElement(tree, { id: 'review-task', name: 'Second look' })).name).toBe('Second look');
    expect(expectUpdated(updateElement(tree, { id: 'flow-1', name: 'go' })).name).toBe('go');
    const xml = await serializeBpmn(tree);
    expect(xml).toContain('name="Second look"');
    expect(xml).toContain('name="go"');
  });

  it('repositions with explicit coordinates, keeping the size and other DI untouched', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const updated = expectUpdated(updateElement(tree, { id: 'review-task', x: 10, y: 20 }));
    expect(updated).toMatchObject({ x: 10, y: 20 });
    expect(getShapeBounds(tree, 'review-task')).toEqual({ x: 10, y: 20, width: 100, height: 80 });
    expect(getShapeBounds(tree, 'start-event')).toEqual({ x: 152, y: 102, width: 36, height: 36 });
  });

  it('resolves a single axis against the existing shape; fails without one', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const single = expectUpdated(updateElement(tree, { id: 'review-task', y: 111 }));
    expect(single).toMatchObject({ x: 252, y: 111 });
    expect(getShapeBounds(tree, 'review-task')).toEqual({ x: 252, y: 111, width: 100, height: 80 });

    const noDi = (await parseBpmn(NO_DI_XML)).rootElement;
    expectEditingFailure(updateElement(noDi, { id: 't1', x: 5 }), 'invalid-coordinates');
    const both = expectUpdated(updateElement(noDi, { id: 't1', x: 5, y: 6 }));
    expect(both).toMatchObject({ x: 5, y: 6 });
    expect(getShapeBounds(noDi, 't1')).toEqual({ x: 5, y: 6, width: 100, height: 80 });
  });

  it('sets isInterrupting on start events (the metamodel declares it there)', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;

    // false differs from the metamodel default (true), so it is serialized.
    expectUpdated(updateElement(tree, { id: 'start-event', isInterrupting: false }));
    let xml = await serializeBpmn(tree);
    expect(xml).toMatch(/<bpmn:startEvent[^>]*id="start-event"[^>]*isInterrupting="false"[^>]*\/>/);

    // true equals the default: the in-memory value is set, the serializer
    // omits the attribute (BPMN semantics: omitted = true).
    expectUpdated(updateElement(tree, { id: 'start-event', isInterrupting: true }));
    xml = await serializeBpmn(tree);
    expect(xml).not.toMatch(/<bpmn:startEvent[^>]*isInterrupting/);

    // Any other element type is a structured error -- the metamodel does
    // not declare the attribute there, so the value would be silently dropped.
    expectEditingFailure(updateElement(tree, { id: 'end-event', isInterrupting: false }), 'unsupported-property');
    expectEditingFailure(updateElement(tree, { id: 'review-task', isInterrupting: true }), 'unsupported-property');
  });

  it('rejects x/y on a sequence flow, blank names, invalid coordinates, and unknown ids', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    expectEditingFailure(updateElement(tree, { id: 'flow-1', x: 1 }), 'unsupported-property');
    expectEditingFailure(updateElement(tree, { id: 'review-task', name: '   ' }), 'invalid-property');
    expectEditingFailure(updateElement(tree, { id: 'review-task', x: -5 }), 'invalid-coordinates');
    expectEditingFailure(updateElement(tree, { id: 'review-task', x: 2.5, y: 1 }), 'invalid-coordinates');
    expectEditingFailure(updateElement(tree, { id: 'ghost' }), 'unknown-element-id');
    expectEditingFailure(updateElement(tree, { id: 'shape-task' }), 'unknown-element-id');
  });

  it('an update without coordinates leaves the pre-existing DI byte-identical', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const before = await serializeBpmn(tree);
    expectUpdated(updateElement(tree, { id: 'review-task', name: 'Second look' }));
    const after = await serializeBpmn(tree);
    const diSection = (xml: string): string => {
      const start = xml.indexOf('<bpmndi:BPMNDiagram');
      const end = xml.indexOf('</bpmndi:BPMNDiagram>') + '</bpmndi:BPMNDiagram>'.length;
      return xml.slice(start, end);
    };
    expect(diSection(after)).toBe(diSection(before));
    expect(after).toContain('name="Second look"');
  });

  it('a failed update leaves the tree untouched (atomicity)', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const before = await serializeBpmn(tree);
    // name is valid, isInterrupting on a task is not -- nothing may be applied.
    expectEditingFailure(
      updateElement(tree, { id: 'review-task', name: 'Second look', isInterrupting: true }),
      'unsupported-property',
    );
    const after = await serializeBpmn(tree);
    expect(after).toBe(before);
  });
});

describe('connect (feat-17 REQ-002, sequence flows only)', () => {
  it('creates a sequence flow with a generated id, references, and a DI edge', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const connected = expectConnected(connect(tree, { sourceId: 'start-event', targetId: 'review-task' }));
    expect(connected).toMatchObject({ flowId: 'sequenceFlow_1', conditionSet: false });

    const process = tree.rootElements[0] as ModdleElement;
    const flow = process.flowElements.find((element: ModdleElement) => element.id === 'sequenceFlow_1');
    expect(flow).toBeDefined();
    expect(flow.sourceRef.id).toBe('start-event');
    expect(flow.targetRef.id).toBe('review-task');

    const edge = getEdgeForElement(tree, 'sequenceFlow_1');
    if (edge === undefined) {
      throw new Error('unreachable: the connect must have emitted a DI edge');
    }
    expect(edge.waypoint).toHaveLength(2);
    // Waypoints start on the source shape border and end on the target shape border.
    const sourceBounds = getShapeBounds(tree, 'start-event');
    const targetBounds = getShapeBounds(tree, 'review-task');
    if (sourceBounds === undefined || targetBounds === undefined) {
      throw new Error('unreachable: the fixture shapes must be present');
    }
    expect(edge.waypoint[0].x).toBeGreaterThanOrEqual(sourceBounds.x);
    expect(edge.waypoint[0].x).toBeLessThanOrEqual(sourceBounds.x + sourceBounds.width);
    expect(edge.waypoint[1].x).toBeGreaterThanOrEqual(targetBounds.x);
    expect(edge.waypoint[1].x).toBeLessThanOrEqual(targetBounds.x + targetBounds.width);
  });

  it('attaches a condition expression and a name (serialized in the XML)', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const connected = expectConnected(
      connect(tree, {
        sourceId: 'start-event',
        targetId: 'review-task',
        name: 'to review',
        conditionExpression: 'amount > 100',
      }),
    );
    expect(connected.conditionSet).toBe(true);
    const xml = await serializeBpmn(tree);
    expect(xml).toContain('name="to review"');
    expect(xml).toContain(
      '<bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">amount &gt; 100</bpmn:conditionExpression>',
    );

    // Blank condition text is treated as absent.
    const blank = expectConnected(
      connect(tree, { sourceId: 'review-task', targetId: 'end-event', conditionExpression: '   ' }),
    );
    expect(blank.conditionSet).toBe(false);
  });

  it('auto-places missing endpoint DI (no pre-existing shapes) and never overlaps', async () => {
    const tree = (await parseBpmn(NO_DI_XML)).rootElement;
    const connected = expectConnected(connect(tree, { sourceId: 't1', targetId: 't2' }));
    expect(connected.flowId).toBe('sequenceFlow_1');
    const bounds = collectShapeBounds(tree);
    expect(bounds).toHaveLength(2);
    expect(bounds[0]).toEqual({ x: 80, y: 80, width: 100, height: 80 });
    expect(bounds[1]).toEqual({ x: 240, y: 80, width: 100, height: 80 });
    expect(getEdgeForElement(tree, 'sequenceFlow_1')).toBeDefined();
  });

  it('rejects missing endpoints, flow endpoints, self-connects, and cross-scope connects', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const missingSource = connect(tree, { sourceId: 'ghost', targetId: 'review-task' });
    expectEditingFailure(missingSource, 'unknown-element-id');
    if (!missingSource.ok) {
      expect(missingSource.error.message).toContain('source element');
    }
    const missingTarget = connect(tree, { sourceId: 'review-task', targetId: 'ghost' });
    expectEditingFailure(missingTarget, 'unknown-element-id');
    if (!missingTarget.ok) {
      expect(missingTarget.error.message).toContain('target element');
    }
    const flowEndpoint = connect(tree, { sourceId: 'flow-1', targetId: 'end-event' });
    expectEditingFailure(flowEndpoint, 'unknown-element-id');
    if (!flowEndpoint.ok) {
      expect(flowEndpoint.error.message).toContain('sequence flow, not a flow node');
    }
    const self = connect(tree, { sourceId: 'review-task', targetId: 'review-task' });
    expectEditingFailure(self, 'self-connect');

    const nested = (await parseBpmn(NESTED_XML)).rootElement;
    const crossScope = connect(nested, { sourceId: 'outer', targetId: 'inner' });
    expectEditingFailure(crossScope, 'cross-scope-connect');
  });

  it('generates unique flow ids across repeated connects', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    expect(expectConnected(connect(tree, { sourceId: 'start-event', targetId: 'review-task' })).flowId).toBe(
      'sequenceFlow_1',
    );
    expect(expectConnected(connect(tree, { sourceId: 'review-task', targetId: 'end-event' })).flowId).toBe(
      'sequenceFlow_2',
    );
  });
});

describe('deleteElement (feat-17 REQ-002, design note "Delete semantics")', () => {
  it('removes a flow node with its referencing flows and their DI', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const deleted = expectDeleted(deleteElement(tree, { id: 'review-task' }));
    expect(deleted).toEqual({
      ok: true,
      id: 'review-task',
      kind: 'element',
      removedFlows: 2,
      removedDiShapes: 1,
      removedDiEdges: 2,
    });

    const process = tree.rootElements[0] as ModdleElement;
    const remainingIds = process.flowElements.map((element: ModdleElement) => element.id);
    expect(remainingIds).toEqual(['start-event', 'end-event']);
    expect(getShapeBounds(tree, 'review-task')).toBeUndefined();
    expect(getEdgeForElement(tree, 'flow-1')).toBeUndefined();
    expect(getEdgeForElement(tree, 'flow-2')).toBeUndefined();
    // The untouched shapes remain.
    expect(getShapeBounds(tree, 'start-event')).toEqual({ x: 152, y: 102, width: 36, height: 36 });
    expect(getShapeBounds(tree, 'end-event')).toEqual({ x: 402, y: 102, width: 36, height: 36 });

    // The result re-parses cleanly (no dangling references).
    const xml = await serializeBpmn(tree);
    const reparsed = (await parseBpmn(xml)).rootElement;
    expect(collectElementInventory(reparsed).map((ref) => ref.id)).not.toContain('review-task');
  });

  it('removes a sequence flow without touching its nodes', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const deleted = expectDeleted(deleteElement(tree, { id: 'flow-1' }));
    expect(deleted).toEqual({
      ok: true,
      id: 'flow-1',
      kind: 'flow',
      removedFlows: 1,
      removedDiShapes: 0,
      removedDiEdges: 1,
    });
    const process = tree.rootElements[0] as ModdleElement;
    const remainingIds = process.flowElements.map((element: ModdleElement) => element.id);
    expect(remainingIds).toContain('start-event');
    expect(remainingIds).toContain('review-task');
    expect(remainingIds).toContain('end-event');
    expect(remainingIds).toContain('flow-2');
    expect(getEdgeForElement(tree, 'flow-1')).toBeUndefined();
    expect(getEdgeForElement(tree, 'flow-2')).toBeDefined();
  });

  it('removes an unconnected node (flows 0) and finds nested nodes at subprocess depth', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const solo = expectDeleted(deleteElement(tree, { id: 'end-event' }));
    expect(solo).toEqual({
      ok: true,
      id: 'end-event',
      kind: 'element',
      removedFlows: 1,
      removedDiShapes: 1,
      removedDiEdges: 1,
    });

    const nested = (await parseBpmn(NESTED_XML)).rootElement;
    const inner = expectDeleted(deleteElement(nested, { id: 'inner' }));
    expect(inner.kind).toBe('element');
    expect(inner.removedFlows).toBe(0);
  });

  it("deleting a start event is legal at core level (model soundness is validate's job)", async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    const deleted = expectDeleted(deleteElement(tree, { id: 'start-event' }));
    expect(deleted.removedFlows).toBe(1);
    const process = tree.rootElements[0] as ModdleElement;
    expect(process.flowElements.some((element: ModdleElement) => element.id === 'start-event')).toBe(false);
  });

  it('rejects unknown ids (including DI ids)', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    expectEditingFailure(deleteElement(tree, { id: 'ghost' }), 'unknown-element-id');
    expectEditingFailure(deleteElement(tree, { id: 'shape-task' }), 'unknown-element-id');
    // The tree is untouched after a failed delete.
    expect(getShapeBounds(tree, 'review-task')).toEqual({ x: 252, y: 80, width: 100, height: 80 });
  });
});
