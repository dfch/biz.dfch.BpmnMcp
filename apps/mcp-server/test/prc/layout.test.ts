// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  attachToPlane,
  anchorPointToward,
  centerOf,
  collectShapeBounds,
  createEdgeForFlow,
  createShapeForElement,
  ensurePlane,
  EVENT_SIZE,
  findFreeSlot,
  GATEWAY_SIZE,
  GRID_CELL,
  getPlane,
  getShapeBounds,
  ORIGIN_X,
  ORIGIN_Y,
  rectanglesOverlap,
  removeFromPlane,
  setShapeBounds,
  sizeForElement,
  TASK_SIZE,
  type Bounds,
} from '../../src/prc/layout.js';
import { createBpmnElement, parseBpmn } from '../../src/prc/moddle.js';
import type { BpmnRootElement } from '../../src/prc/moddle.js';

// Resolve the fixture directory independent of the test runner's
// working directory (test/prc/ -> test/ -> fixtures/).
const FIXTURES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures');

/** Reads a committed fixture as text. */
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');

/** A bare `bpmn:Definitions` + `bpmn:Process` tree (no DI yet). */
function makeBareTree(): { tree: BpmnRootElement; process: ReturnType<typeof createBpmnElement> } {
  const tree = createBpmnElement('bpmn:Definitions', {
    id: 'Definitions_1',
    targetNamespace: 'http://bpmn.io/schema/bpmn',
  });
  const process = createBpmnElement('bpmn:Process', { id: 'p', isExecutable: false });
  tree.rootElements = [process];
  return { tree, process };
}

/** Adds a task with a shape at the given bounds to a bare tree. */
function withShapeAt(
  tree: BpmnRootElement,
  process: ReturnType<typeof createBpmnElement>,
  id: string,
  bounds: Bounds,
): void {
  const task = createBpmnElement('bpmn:Task', { id });
  const flowElements = Array.isArray(process.flowElements) ? process.flowElements : [];
  flowElements.push(task);
  process.flowElements = flowElements;
  const plane = ensurePlane(tree, process);
  attachToPlane(plane, createShapeForElement(task, bounds, tree));
}

describe('layout constants (feat-17 design note "Grid")', () => {
  it('the cell, origin, and standard sizes are the recorded values', () => {
    expect(GRID_CELL).toBe(80);
    expect(ORIGIN_X).toBe(80);
    expect(ORIGIN_Y).toBe(80);
    expect(EVENT_SIZE).toEqual({ width: 36, height: 36 });
    expect(GATEWAY_SIZE).toEqual({ width: 50, height: 50 });
    expect(TASK_SIZE).toEqual({ width: 100, height: 80 });
  });
});

describe('sizeForElement', () => {
  it('matches the exact Stage 1 sizes', () => {
    expect(sizeForElement(createBpmnElement('bpmn:Task', { id: 't' }))).toEqual(TASK_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:SubProcess', { id: 's' }))).toEqual(TASK_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:StartEvent', { id: 'e' }))).toEqual(EVENT_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:EndEvent', { id: 'e' }))).toEqual(EVENT_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:IntermediateCatchEvent', { id: 'e' }))).toEqual(EVENT_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:ExclusiveGateway', { id: 'g' }))).toEqual(GATEWAY_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:ParallelGateway', { id: 'g' }))).toEqual(GATEWAY_SIZE);
  });

  it('falls back to the metamodel family for imported node types beyond the set', () => {
    expect(sizeForElement(createBpmnElement('bpmn:ScriptTask', { id: 't' }))).toEqual(TASK_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:ReceiveTask', { id: 't' }))).toEqual(TASK_SIZE);
    expect(sizeForElement(createBpmnElement('bpmn:BoundaryEvent', { id: 'e' }))).toEqual(EVENT_SIZE);
  });
});

describe('rectanglesOverlap', () => {
  const a: Bounds = { x: 0, y: 0, width: 10, height: 10 };
  it('detects strict intersections and containment', () => {
    expect(rectanglesOverlap(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(rectanglesOverlap(a, { x: 2, y: 2, width: 3, height: 3 })).toBe(true);
  });
  it('touching borders are not an overlap', () => {
    expect(rectanglesOverlap(a, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
    expect(rectanglesOverlap(a, { x: 0, y: 10, width: 10, height: 10 })).toBe(false);
  });
});

describe('findFreeSlot (REQ-003)', () => {
  it('returns the fixed origin on an empty plane', () => {
    const { tree } = makeBareTree();
    expect(findFreeSlot(tree, TASK_SIZE)).toEqual({ x: ORIGIN_X, y: ORIGIN_Y });
    expect(findFreeSlot(tree, EVENT_SIZE)).toEqual({ x: ORIGIN_X, y: ORIGIN_Y });
    expect(getPlane(tree)).toBeUndefined();
  });

  it('skips occupied slots for a task (100x80 spans two cells)', () => {
    const { tree, process } = makeBareTree();
    withShapeAt(tree, process, 't0', { x: ORIGIN_X, y: ORIGIN_Y, width: 100, height: 80 });
    expect(findFreeSlot(tree, TASK_SIZE)).toEqual({ x: ORIGIN_X + 2 * GRID_CELL, y: ORIGIN_Y });
  });

  it('places an event (36x36) past the occupied task, which spans two cells', () => {
    const { tree, process } = makeBareTree();
    withShapeAt(tree, process, 't0', { x: ORIGIN_X, y: ORIGIN_Y, width: 100, height: 80 });
    // The task covers x 80..180, so both of the first two event slots overlap it.
    expect(findFreeSlot(tree, EVENT_SIZE)).toEqual({ x: ORIGIN_X + 2 * GRID_CELL, y: ORIGIN_Y });
  });

  it('reproduces the first free slot over the committed order-process plane', async () => {
    const tree = (await parseBpmn(readFixture('order-process.bpmn'))).rootElement;
    expect(findFreeSlot(tree, TASK_SIZE)).toEqual({ x: 480, y: 80 });
    expect(findFreeSlot(tree, EVENT_SIZE)).toEqual({ x: 80, y: 80 });
    expect(findFreeSlot(tree, GATEWAY_SIZE)).toEqual({ x: 80, y: 80 });
  });

  it('wraps to the next row once the first row is fully occupied', () => {
    const { tree, process } = makeBareTree();
    const plane = ensurePlane(tree, process);
    // A task spans two cells, so 100 of them cover the row's 200 columns.
    for (let i = 0; i < 100; i += 1) {
      const bounds: Bounds = {
        x: ORIGIN_X + i * 2 * GRID_CELL,
        y: ORIGIN_Y,
        width: TASK_SIZE.width,
        height: TASK_SIZE.height,
      };
      const task = createBpmnElement('bpmn:Task', { id: `t${i}` });
      const flowElements = Array.isArray(process.flowElements) ? process.flowElements : [];
      flowElements.push(task);
      process.flowElements = flowElements;
      attachToPlane(plane, createShapeForElement(task, bounds, tree));
    }
    // Row 0 is fully occupied; row 1 col 0 touches row 0 (no overlap).
    expect(findFreeSlot(tree, TASK_SIZE)).toEqual({ x: ORIGIN_X, y: ORIGIN_Y + GRID_CELL });
  });

  it('auto-placed shapes never overlap across several placements (non-overlap)', () => {
    const { tree, process } = makeBareTree();
    const plane = ensurePlane(tree, process);
    const placed: Bounds[] = [];
    for (let i = 0; i < 6; i += 1) {
      const position = findFreeSlot(tree, TASK_SIZE);
      const bounds: Bounds = { ...position, width: TASK_SIZE.width, height: TASK_SIZE.height };
      const task = createBpmnElement('bpmn:Task', { id: `t${i}` });
      const flowElements = Array.isArray(process.flowElements) ? process.flowElements : [];
      flowElements.push(task);
      process.flowElements = flowElements;
      attachToPlane(plane, createShapeForElement(task, bounds, tree));
      placed.push(bounds);
    }
    expect(placed.map((b) => b.x)).toEqual([80, 240, 400, 560, 720, 880]);
    expect(placed.map((b) => b.y)).toEqual([80, 80, 80, 80, 80, 80]);
    expect(collectShapeBounds(tree)).toEqual(placed);
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        expect(rectanglesOverlap(placed[i], placed[j])).toBe(false);
      }
    }
  });
});

describe('plane and shape/edge emission (REQ-003)', () => {
  it('ensurePlane creates one diagram/plane pair and is idempotent', () => {
    const { tree, process } = makeBareTree();
    const first = ensurePlane(tree, process);
    const second = ensurePlane(tree, process);
    expect(first).toBe(second);
    expect(tree.diagrams).toHaveLength(1);
    expect(tree.diagrams[0].$type).toBe('bpmndi:BPMNDiagram');
    expect(first.$type).toBe('bpmndi:BPMNPlane');
    expect(first.bpmnElement).toBe(process);
  });

  it('createShapeForElement emits shape_<id> with the bounds as given (no snapping)', () => {
    const { tree, process } = makeBareTree();
    const task = createBpmnElement('bpmn:Task', { id: 'task_1' });
    const shape = createShapeForElement(task, { x: 123, y: 45, width: 100, height: 80 }, tree);
    expect(shape.$type).toBe('bpmndi:BPMNShape');
    expect(shape.id).toBe('shape_task_1');
    expect(shape.bpmnElement).toBe(task);
    expect(shape.bounds).toMatchObject({ x: 123, y: 45, width: 100, height: 80 });
    const plane = ensurePlane(tree, process);
    attachToPlane(plane, shape);
    expect(getShapeBounds(tree, 'task_1')).toEqual({ x: 123, y: 45, width: 100, height: 80 });
  });

  it('createShapeForElement avoids a taken base id (whole-tree scan, model and DI alike)', () => {
    const { tree, process } = makeBareTree();
    // An element literally named shape_task_1 takes the natural base id.
    const blocker = createBpmnElement('bpmn:Task', { id: 'shape_task_1' });
    const flowElements = Array.isArray(process.flowElements) ? process.flowElements : [];
    flowElements.push(blocker);
    process.flowElements = flowElements;
    const task = createBpmnElement('bpmn:Task', { id: 'task_1' });
    const shape = createShapeForElement(task, { x: 80, y: 80, width: 100, height: 80 }, tree);
    expect(shape.id).toBe('shape_task_1_1');
  });

  it('createEdgeForFlow emits edge_<flowId> with two boundary waypoints', () => {
    const { tree, process } = makeBareTree();
    const flow = createBpmnElement('bpmn:SequenceFlow', { id: 'sequenceFlow_1' });
    const sourceBounds: Bounds = { x: 80, y: 80, width: 100, height: 80 };
    const targetBounds: Bounds = { x: 320, y: 80, width: 100, height: 80 };
    const edge = createEdgeForFlow(flow, sourceBounds, targetBounds, tree);
    expect(edge.$type).toBe('bpmndi:BPMNEdge');
    expect(edge.id).toBe('edge_sequenceFlow_1');
    expect(edge.bpmnElement).toBe(flow);
    const waypoints = edge.waypoint;
    expect(waypoints).toHaveLength(2);
    // Right border of the source, left border of the target (axis-aligned).
    expect(waypoints[0]).toMatchObject({ x: 180, y: 120 });
    expect(waypoints[1]).toMatchObject({ x: 320, y: 120 });
    const plane = ensurePlane(tree, process);
    attachToPlane(plane, edge);
  });

  it('setShapeBounds replaces only the bounds (reposition keeps the size)', () => {
    const { tree, process } = makeBareTree();
    withShapeAt(tree, process, 't0', { x: 80, y: 80, width: 100, height: 80 });
    const shape = getShapeBounds(tree, 't0');
    expect(shape).toBeDefined();
    const plane = getPlane(tree);
    if (plane === undefined) {
      throw new Error('unreachable: the plane must exist');
    }
    const elements = plane.planeElement;
    const theShape = elements[0];
    setShapeBounds(theShape, { x: 10, y: 20, width: 100, height: 80 });
    expect(getShapeBounds(tree, 't0')).toEqual({ x: 10, y: 20, width: 100, height: 80 });
  });

  it('attachToPlane / removeFromPlane round-trip', () => {
    const { tree, process } = makeBareTree();
    const plane = ensurePlane(tree, process);
    expect(plane.planeElement ?? []).toHaveLength(0);
    const task = createBpmnElement('bpmn:Task', { id: 't0' });
    const shape = createShapeForElement(task, { x: 80, y: 80, width: 100, height: 80 }, tree);
    attachToPlane(plane, shape);
    expect(collectShapeBounds(tree)).toHaveLength(1);
    removeFromPlane(plane, shape);
    expect(collectShapeBounds(tree)).toHaveLength(0);
  });
});

describe('anchorPointToward / centerOf', () => {
  it('returns the border point aimed at the other center (axis-aligned cases)', () => {
    const rect: Bounds = { x: 0, y: 0, width: 100, height: 80 };
    expect(anchorPointToward(rect, { x: 200, y: 40 })).toEqual({ x: 100, y: 40 });
    expect(anchorPointToward(rect, { x: -100, y: 40 })).toEqual({ x: 0, y: 40 });
    expect(anchorPointToward(rect, { x: 50, y: 200 })).toEqual({ x: 50, y: 80 });
    expect(anchorPointToward(rect, { x: 50, y: -200 })).toEqual({ x: 50, y: 0 });
  });
  it('co-located centers yield the rectangle center', () => {
    const rect: Bounds = { x: 10, y: 20, width: 100, height: 80 };
    expect(anchorPointToward(rect, centerOf(rect))).toEqual(centerOf(rect));
  });
  it('diagonal targets land on a corner', () => {
    const rect: Bounds = { x: 0, y: 0, width: 100, height: 80 };
    expect(anchorPointToward(rect, { x: 500, y: 400 })).toEqual({ x: 100, y: 80 });
  });
});
