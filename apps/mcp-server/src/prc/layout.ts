// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import type { ModdleElement } from 'moddle';
import { collectElementInventory, createBpmnElement, isModdleElement, type BpmnRootElement } from './moddle.js';

/**
 * The grid layout module (REQ-003, feat-17 design note "Grid"): the
 * fixed cell lattice, the standard element sizes, the first-free-slot
 * placement, and the BPMN DI shape/edge emission the editing
 * operations wire into the tree.
 *
 * Placement is a scan over a fixed origin with a fixed cell size: a
 * candidate position is *free* when the rectangle it would occupy (at
 * the element's standard size) does not overlap any existing
 * `BPMNShape` bounds in the plane. Edges touch (shared border) without
 * overlapping. Explicit coordinates are always honored as-is (never
 * snapped to the lattice); auto-placement is only the fallback for
 * omitted positions. Pre-existing DI is never modified here except by
 * the dedicated attach/remove/bounds-set calls the editing layer makes
 * for the element it is working on.
 *
 * The UPPER_SNAKE_CASE constants below are the single home of the
 * grid's geometry (QA 0.0250); the editing layer imports them through
 * this module's functions, never re-derives them.
 */

/** A point in the diagram's pixel coordinate space. */
export interface Point {
  x: number;
  y: number;
}

/** A size in pixels. */
export interface Size {
  width: number;
  height: number;
}

/** A bounds rectangle in the diagram's pixel coordinate space. */
export interface Bounds extends Point, Size {}

/** The fixed grid cell size in pixels (80x80). */
export const GRID_CELL = 80;

/** The fixed grid origin's x coordinate. */
export const ORIGIN_X = 80;

/** The fixed grid origin's y coordinate. */
export const ORIGIN_Y = 80;

/** The standard size of an event (36x36). */
export const EVENT_SIZE: Size = { width: 36, height: 36 };

/** The standard size of a gateway (50x50). */
export const GATEWAY_SIZE: Size = { width: 50, height: 50 };

/** The standard size of a task or sub-process (100x80). */
export const TASK_SIZE: Size = { width: 100, height: 80 };

/** The scan extent (rows and columns) the first-free-slot search covers. */
const MAX_GRID_EXTENT = 200;

/** The exact standard size per metamodel type (the Stage 1 element set). */
const SIZE_BY_MODDLER_TYPE: Readonly<Record<string, Size>> = {
  'bpmn:Task': TASK_SIZE,
  'bpmn:SubProcess': TASK_SIZE,
  'bpmn:StartEvent': EVENT_SIZE,
  'bpmn:EndEvent': EVENT_SIZE,
  'bpmn:IntermediateCatchEvent': EVENT_SIZE,
  'bpmn:ExclusiveGateway': GATEWAY_SIZE,
  'bpmn:ParallelGateway': GATEWAY_SIZE,
};

/**
 * The standard grid size for a metamodel type (the exact Stage 1
 * match): throws for a type outside the set -- a programming error,
 * because the callers only pass element types they control.
 *
 * @param moddleType - The metamodel type (e.g. `bpmn:Task`).
 */
export function sizeForType(moddleType: string): Size {
  const size = SIZE_BY_MODDLER_TYPE[moddleType];
  if (size === undefined) {
    throw new Error(`no standard grid size for ${moddleType}`);
  }
  return size;
}

/**
 * The standard grid size for a flow node (REQ-003): the exact match
 * for the Stage 1 element set, falling back to the metamodel family
 * (`bpmn:Gateway`, `bpmn:Event`, everything else the task standard)
 * for node types an imported document may carry beyond the set.
 *
 * @param element - The flow node whose size is looked up.
 */
export function sizeForElement(element: ModdleElement): Size {
  const exact = SIZE_BY_MODDLER_TYPE[element.$type];
  if (exact !== undefined) {
    return exact;
  }
  if (element.$instanceOf('bpmn:Gateway') === true) {
    return GATEWAY_SIZE;
  }
  if (element.$instanceOf('bpmn:Event') === true) {
    return EVENT_SIZE;
  }
  return TASK_SIZE;
}

/**
 * Whether two bounds rectangles overlap (strict intersection: touching
 * borders are not an overlap).
 *
 * @param a - The first rectangle.
 * @param b - The second rectangle.
 */
export function rectanglesOverlap(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

/**
 * The plane's `BPMNShape` bounds, in document order (shapes without
 * usable numeric bounds are skipped). An empty list when the document
 * carries no plane or no shapes.
 *
 * @param tree - The document root.
 */
export function collectShapeBounds(tree: BpmnRootElement): Bounds[] {
  const result: Bounds[] = [];
  const plane = getPlane(tree);
  const elements = plane?.planeElement;
  if (!Array.isArray(elements)) {
    return result;
  }
  for (const element of elements) {
    if (isModdleElement(element) && element.$type === 'bpmndi:BPMNShape') {
      const bounds = shapeBoundsOf(element);
      if (bounds !== undefined) {
        result.push(bounds);
      }
    }
  }
  return result;
}

/**
 * The first free grid slot for a rectangle of the given size
 * (REQ-003): a row-major scan of the lattice (x advances fastest, so
 * elements flow left-to-right before wrapping to the next row),
 * starting at the fixed origin; the first candidate whose rectangle
 * does not overlap any existing shape bounds is returned.
 *
 * @param tree - The document root (the existing shapes' source).
 * @param size - The rectangle's standard size.
 */
export function findFreeSlot(tree: BpmnRootElement, size: Size): Point {
  const occupied = collectShapeBounds(tree);
  for (let row = 0; row < MAX_GRID_EXTENT; row += 1) {
    for (let col = 0; col < MAX_GRID_EXTENT; col += 1) {
      const candidate: Bounds = {
        x: ORIGIN_X + col * GRID_CELL,
        y: ORIGIN_Y + row * GRID_CELL,
        width: size.width,
        height: size.height,
      };
      if (!occupied.some((other) => rectanglesOverlap(candidate, other))) {
        return { x: candidate.x, y: candidate.y };
      }
    }
  }
  throw new Error('the grid is exhausted: no free slot within the scan extent');
}

/**
 * The document's `BPMNPlane`, if any (the first diagram's plane).
 *
 * @param tree - The document root.
 */
export function getPlane(tree: BpmnRootElement): ModdleElement | undefined {
  const diagrams = tree.diagrams;
  if (!Array.isArray(diagrams)) {
    return undefined;
  }
  for (const diagram of diagrams) {
    if (isModdleElement(diagram) && diagram.$type === 'bpmndi:BPMNDiagram' && isModdleElement(diagram.plane)) {
      return diagram.plane;
    }
  }
  return undefined;
}

/**
 * The plane the editing operations work on: the existing plane when
 * the document already carries one, otherwise a fresh
 * `bpmndi:BPMNDiagram` + `bpmndi:BPMNPlane` pair (unique ids, the
 * plane referencing the process) attached to the root's `diagrams`.
 *
 * @param tree - The document root (mutated when created).
 * @param process - The `bpmn:Process` the new plane references.
 */
export function ensurePlane(tree: BpmnRootElement, process: ModdleElement): ModdleElement {
  const existing = getPlane(tree);
  if (existing !== undefined) {
    return existing;
  }
  const diagram = createBpmnElement('bpmndi:BPMNDiagram', { id: uniqueDiId('BPMNDiagram_1', tree) });
  const plane = createBpmnElement('bpmndi:BPMNPlane', { id: uniqueDiId('BPMNPlane_1', tree), bpmnElement: process });
  diagram.plane = plane;
  const diagrams = Array.isArray(tree.diagrams) ? tree.diagrams : [];
  diagrams.push(diagram);
  tree.diagrams = diagrams;
  return plane;
}

/**
 * The plane's `BPMNShape` for the model element with the given id, if
 * any (matched through the shape's resolved `bpmnElement` reference).
 *
 * @param tree - The document root.
 * @param elementId - The model element's id.
 */
export function getShapeForElement(tree: BpmnRootElement, elementId: string): ModdleElement | undefined {
  return findPlaneElement(tree, 'bpmndi:BPMNShape', elementId);
}

/**
 * The plane's `BPMNEdge` for the model element with the given id, if
 * any (matched through the edge's resolved `bpmnElement` reference).
 *
 * @param tree - The document root.
 * @param elementId - The model element's id.
 */
export function getEdgeForElement(tree: BpmnRootElement, elementId: string): ModdleElement | undefined {
  return findPlaneElement(tree, 'bpmndi:BPMNEdge', elementId);
}

/**
 * The bounds rectangle of the model element's shape, if the element
 * has one.
 *
 * @param tree - The document root.
 * @param elementId - The model element's id.
 */
export function getShapeBounds(tree: BpmnRootElement, elementId: string): Bounds | undefined {
  const shape = getShapeForElement(tree, elementId);
  return shape === undefined ? undefined : shapeBoundsOf(shape);
}

/**
 * Creates a `bpmndi:BPMNShape` for a model element at the given bounds
 * (REQ-003's shape emission): a unique `shape_<elementId>` id, the
 * element reference, and a `dc:Bounds` child. The caller attaches the
 * shape to the plane (see `attachToPlane`).
 *
 * @param element - The model element the shape depicts.
 * @param bounds - The shape's bounds rectangle.
 * @param tree - The document root (the id-uniqueness scan's source).
 */
export function createShapeForElement(element: ModdleElement, bounds: Bounds, tree: BpmnRootElement): ModdleElement {
  return createBpmnElement('bpmndi:BPMNShape', {
    id: uniqueDiId(`shape_${element.id}`, tree),
    bpmnElement: element,
    bounds: createBpmnElement('dc:Bounds', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    }),
  });
}

/**
 * Creates a `bpmndi:BPMNEdge` for a sequence flow between two shapes
 * (REQ-003's edge emission): a unique `edge_<flowId>` id, the flow
 * reference, and two waypoints -- the source bounds' border point
 * aimed at the target's center and the target bounds' border point
 * aimed at the source's center. The caller attaches the edge to the
 * plane (see `attachToPlane`).
 *
 * @param flow - The sequence flow the edge depicts.
 * @param sourceBounds - The source shape's bounds rectangle.
 * @param targetBounds - The target shape's bounds rectangle.
 * @param tree - The document root (the id-uniqueness scan's source).
 */
export function createEdgeForFlow(
  flow: ModdleElement,
  sourceBounds: Bounds,
  targetBounds: Bounds,
  tree: BpmnRootElement,
): ModdleElement {
  const sourceAnchor = anchorPointToward(sourceBounds, centerOf(targetBounds));
  const targetAnchor = anchorPointToward(targetBounds, centerOf(sourceBounds));
  return createBpmnElement('bpmndi:BPMNEdge', {
    id: uniqueDiId(`edge_${flow.id}`, tree),
    bpmnElement: flow,
    waypoint: [
      createBpmnElement('dc:Point', { x: sourceAnchor.x, y: sourceAnchor.y }),
      createBpmnElement('dc:Point', { x: targetAnchor.x, y: targetAnchor.y }),
    ],
  });
}

/**
 * Appends a DI element to the plane's `planeElement` collection
 * (creating the collection when absent).
 *
 * @param plane - The `BPMNPlane`.
 * @param diElement - The shape or edge to attach.
 */
export function attachToPlane(plane: ModdleElement, diElement: ModdleElement): void {
  const elements = Array.isArray(plane.planeElement) ? plane.planeElement : [];
  elements.push(diElement);
  plane.planeElement = elements;
}

/**
 * Removes one DI element from the plane's `planeElement` collection.
 *
 * @param plane - The `BPMNPlane`.
 * @param diElement - The shape or edge to remove.
 */
export function removeFromPlane(plane: ModdleElement, diElement: ModdleElement): void {
  const elements = plane.planeElement;
  if (!Array.isArray(elements)) {
    return;
  }
  plane.planeElement = elements.filter((element) => element !== diElement);
}

/**
 * Replaces a shape's bounds (REQ-003's reposition): a fresh
 * `dc:Bounds` with the given rectangle; nothing else on the shape is
 * touched.
 *
 * @param shape - The `BPMNShape` to reposition.
 * @param bounds - The new bounds rectangle.
 */
export function setShapeBounds(shape: ModdleElement, bounds: Bounds): void {
  shape.bounds = createBpmnElement('dc:Bounds', {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  });
}

/**
 * The center point of a bounds rectangle.
 *
 * @param bounds - The rectangle.
 */
export function centerOf(bounds: Bounds): Point {
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

/**
 * The point where the ray from the rectangle's center toward the
 * given point leaves the rectangle: the border point an edge
 * connecting to a remote shape should start (or end) at. Co-located
 * centers yield the rectangle's own center.
 *
 * @param bounds - The rectangle the point is taken from.
 * @param toward - The point the ray is aimed at.
 */
export function anchorPointToward(bounds: Bounds, toward: Point): Point {
  const center = centerOf(bounds);
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  if (dx === 0 && dy === 0) {
    return center;
  }
  const scaleX = dx !== 0 ? bounds.width / 2 / Math.abs(dx) : Number.POSITIVE_INFINITY;
  const scaleY = dy !== 0 ? bounds.height / 2 / Math.abs(dy) : Number.POSITIVE_INFINITY;
  const scale = Math.min(scaleX, scaleY);
  return { x: center.x + dx * scale, y: center.y + dy * scale };
}

/** A unique DI id: the base, or `base_<n>` with the smallest free n. */
function uniqueDiId(base: string, tree: BpmnRootElement): string {
  const taken = new Set(collectElementInventory(tree).map((ref) => ref.id));
  let candidate = base;
  let suffix = 1;
  while (taken.has(candidate)) {
    candidate = `${base}_${suffix}`;
    suffix += 1;
  }
  return candidate;
}

/** The plane's element of the given DI type whose `bpmnElement` carries the given id. */
function findPlaneElement(tree: BpmnRootElement, type: string, elementId: string): ModdleElement | undefined {
  const plane = getPlane(tree);
  const elements = plane?.planeElement;
  if (!Array.isArray(elements)) {
    return undefined;
  }
  for (const element of elements) {
    if (!isModdleElement(element) || element.$type !== type) {
      continue;
    }
    if (isModdleElement(element.bpmnElement) && element.bpmnElement.id === elementId) {
      return element;
    }
  }
  return undefined;
}

/** The numeric bounds of a shape, or undefined when the shape carries none. */
function shapeBoundsOf(shape: ModdleElement): Bounds | undefined {
  const bounds = shape.bounds;
  if (!isModdleElement(bounds) || typeof bounds.x !== 'number' || typeof bounds.y !== 'number') {
    return undefined;
  }
  if (typeof bounds.width !== 'number' || typeof bounds.height !== 'number') {
    return undefined;
  }
  return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
}
