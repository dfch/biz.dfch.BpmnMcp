// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import type { ModdleElement } from 'moddle';
import { precondition } from '../assertions.js';
import { deriveSlug, slugify } from './filename.js';
import {
  attachToPlane,
  createEdgeForFlow,
  createShapeForElement,
  ensurePlane,
  findFreeSlot,
  getPlane,
  getShapeBounds,
  getShapeForElement,
  setShapeBounds,
  sizeForElement,
  sizeForType,
  type Bounds,
} from './layout.js';
import {
  collectElementInventory,
  createBpmnElement,
  isModdleElement,
  oneLine,
  type BpmnRootElement,
} from './moddle.js';

/**
 * The core editing module (feat-17, REQ-001/REQ-002/REQ-004/REQ-007):
 * builds a fresh `bpmn:Definitions`/`bpmn:Process` tree with its DI
 * roots (`createProcess`) and applies the four change operations
 * (`addElement`, `updateElement`, `connect`, `deleteElement`) to any
 * parsed tree. Every function returns a structured result (`ok: true`
 * with what changed, or `ok: false` with a single-line
 * `{ code, message }`) and never throws for expected input failures;
 * the store maps those onto its own error codes, and the Phase 110
 * adapter maps them onto tool-level `isError` results.
 *
 * The Stage 1 element set (design note "Element set") is the kebab-case
 * vocabulary of `ELEMENT_TYPES` (sequence flows are created by
 * `connect`, not by `addElement`). The update property set (scoped
 * decision, recorded in the feat README): `name` on any flow element
 * (node or sequence flow) and `isInterrupting` (a boolean) on start
 * events only (the bpmn-moddle metamodel declares the attribute there;
 * a value equal to its `true` default is omitted from the XML, as BPMN
 * semantics intend) -- every other property/element combination is a
 * structured `unsupported-property` error.
 *
 * Element ids (scoped decision, REQ-004): `addElement` and the initial
 * elements of `createProcess` accept an OPTIONAL caller id (validated
 * against the BPMN id shape, `invalid-id` otherwise); an omitted or
 * empty id is generated as `<type-prefix>_<n>` -- `task_1`,
 * `startEvent_2`, ... -- with the smallest free suffix, respecting
 * existing ids of the same family. A supplied id that already exists
 * anywhere in the document (model or DI) is a `duplicate-element-id`
 * error.
 *
 * Coordinates (REQ-003): explicit x/y are non-negative integers,
 * honored as-is (never grid-snapped); `addElement` needs both or
 * neither (an omitted pair is grid auto-placed by the layout module's
 * first-free-slot scan), `updateElement` accepts a single axis when
 * the element already has a shape (the other axis is kept).
 *
 * Delete semantics (design note): removing a node removes the node
 * and every sequence flow referencing it (plus the node's DI shape
 * and the DI edges of the removed flows); removing a flow removes
 * just the flow and its DI edge. Model soundness (e.g. a start event
 * is required) is `validate`'s job, not the core's.
 */

/** The Stage 1 element types, as the tool-facing kebab-case vocabulary. */
export type PrcElementType =
  | 'start-event'
  | 'end-event'
  | 'intermediate-catch-event'
  | 'task'
  | 'sub-process'
  | 'exclusive-gateway'
  | 'parallel-gateway';

/** The metamodel type each Stage 1 element type maps to. */
export const ELEMENT_TYPES: Readonly<Record<PrcElementType, string>> = {
  'start-event': 'bpmn:StartEvent',
  'end-event': 'bpmn:EndEvent',
  'intermediate-catch-event': 'bpmn:IntermediateCatchEvent',
  task: 'bpmn:Task',
  'sub-process': 'bpmn:SubProcess',
  'exclusive-gateway': 'bpmn:ExclusiveGateway',
  'parallel-gateway': 'bpmn:ParallelGateway',
};

/** The id prefix each metamodel type's generated ids use. */
const TYPE_ID_PREFIX: Readonly<Record<string, string>> = {
  'bpmn:StartEvent': 'startEvent',
  'bpmn:EndEvent': 'endEvent',
  'bpmn:IntermediateCatchEvent': 'intermediateCatchEvent',
  'bpmn:Task': 'task',
  'bpmn:SubProcess': 'subProcess',
  'bpmn:ExclusiveGateway': 'exclusiveGateway',
  'bpmn:ParallelGateway': 'parallelGateway',
  'bpmn:SequenceFlow': 'sequenceFlow',
};

/**
 * The metamodel types that accept `isInterrupting`: the bpmn-moddle
 * metamodel declares the attribute on `bpmn:StartEvent` only (default
 * `true`, so a value equal to the default is omitted from the XML).
 * Setting it on any other type would be silently dropped by the
 * serializer, so the structured `unsupported-property` error is the
 * honest leg.
 */
const INTERRUPTIBLE_TYPES: ReadonlySet<string> = new Set(['bpmn:StartEvent']);

/**
 * The BPMN id shape (NCName, unicode-extended): a letter or underscore
 * first, then letters, digits, and `_`, `.`, `-`, `:`. Caller-supplied
 * ids outside this shape are a structured `invalid-id` error.
 */
const ELEMENT_ID_PATTERN = /^[A-Za-z_\p{L}][\p{L}\p{N}_\-.:]*$/u;

/** The structured failure codes the editing operations can return. */
export type EditingErrorCode =
  | 'no-process'
  | 'unknown-element-type'
  | 'unknown-element-id'
  | 'duplicate-element-id'
  | 'invalid-id'
  | 'invalid-coordinates'
  | 'invalid-property'
  | 'unsupported-property'
  | 'self-connect'
  | 'cross-scope-connect';

/** A structured editing error: a code plus a single-line message. */
export interface EditingError {
  code: EditingErrorCode;
  message: string;
}

/** The structured editing failure side (shared by every operation). */
export interface EditingFailure {
  ok: false;
  error: EditingError;
}

/** An element to add (the `create` initial-element spec, too). */
export interface AddElementInput {
  /** The Stage 1 element type (the kebab-case vocabulary). */
  type: string;
  /** The element's name (optional). */
  name?: string;
  /** A caller-supplied id (optional; generated when omitted/empty). */
  id?: string;
  /** The explicit x coordinate (optional; non-negative integer). */
  x?: number;
  /** The explicit y coordinate (optional; non-negative integer). */
  y?: number;
}

/** The `update-element` operation input. */
export interface UpdateElementInput {
  /** The element's id. */
  id: string;
  /** The new name (any flow element; non-blank when given). */
  name?: string;
  /** The new `isInterrupting` value (start events only, see the module documentation). */
  isInterrupting?: boolean;
  /** The new x coordinate (repositions the element's DI shape). */
  x?: number;
  /** The new y coordinate (repositions the element's DI shape). */
  y?: number;
}

/** The `connect` operation input. */
export interface ConnectInput {
  /** The source flow node's id. */
  sourceId: string;
  /** The target flow node's id. */
  targetId: string;
  /** The flow's name (optional; blank treated as absent). */
  name?: string;
  /** The condition expression text (optional; blank treated as absent). */
  conditionExpression?: string;
}

/** The `delete-element` operation input. */
export interface DeleteElementInput {
  /** The element's id (a flow node or a sequence flow). */
  id: string;
}

/** The discriminated operation union the store's change op accepts. */
export type EditingOperation =
  | ({ action: 'add-element' } & AddElementInput)
  | ({ action: 'update-element' } & UpdateElementInput)
  | ({ action: 'connect' } & ConnectInput)
  | ({ action: 'delete-element' } & DeleteElementInput);

/** The `createProcess` success result (the tree and its identity data). */
export interface CreateProcessSuccess {
  ok: true;
  /** The derived `bpmn:Process` id (the export slug's source). */
  processId: string;
  /** The export slug (see `deriveSlug`). */
  slug: string;
  /** The fresh document root (not yet written anywhere). */
  tree: BpmnRootElement;
  /** How many initial elements the process carries. */
  elementCount: number;
}

/** The `addElement` success result. */
export interface AddElementSuccess {
  ok: true;
  /** The element's (generated or supplied) id. */
  id: string;
  /** The validated Stage 1 element type. */
  type: PrcElementType;
  /** The element's name, when given. */
  name?: string;
  /** The shape's x coordinate (explicit or auto-placed). */
  x: number;
  /** The shape's y coordinate (explicit or auto-placed). */
  y: number;
}

/** The `updateElement` success result (only the fields that changed). */
export interface UpdateElementSuccess {
  ok: true;
  id: string;
  name?: string;
  isInterrupting?: boolean;
  x?: number;
  y?: number;
}

/** The `connect` success result. */
export interface ConnectSuccess {
  ok: true;
  /** The generated sequence flow's id. */
  flowId: string;
  sourceId: string;
  targetId: string;
  /** Whether a condition expression was attached. */
  conditionSet: boolean;
}

/** The `deleteElement` success result. */
export interface DeleteElementSuccess {
  ok: true;
  id: string;
  /** What was removed: a flow node (`element`) or a sequence flow (`flow`). */
  kind: 'element' | 'flow';
  /** How many sequence flows were removed (0 for a flow, cascades for a node). */
  removedFlows: number;
  removedDiShapes: number;
  removedDiEdges: number;
}

/** Any change-operation success side. */
export type EditingSuccess = AddElementSuccess | UpdateElementSuccess | ConnectSuccess | DeleteElementSuccess;

/** Any change-operation result. */
export type EditingResult = EditingSuccess | EditingFailure;

export type CreateProcessResult = CreateProcessSuccess | EditingFailure;
export type AddElementResult = AddElementSuccess | EditingFailure;
export type UpdateElementResult = UpdateElementSuccess | EditingFailure;
export type ConnectResult = ConnectSuccess | EditingFailure;
export type DeleteElementResult = DeleteElementSuccess | EditingFailure;

/** A flow element found in the tree, with the container that holds it. */
interface FoundElement {
  element: ModdleElement;
  container: ModdleElement;
}

/**
 * Builds a fresh `bpmn:Definitions` tree with a single
 * `bpmn:Process` and its DI roots (REQ-001): the process id is the
 * slugified name (prefixed `process-` when it would start with a
 * digit, constant `process` when the name slugifies to nothing), the
 * export slug derives from that id via `deriveSlug`, and the
 * `bpmndi:BPMNDiagram`/`BPMNPlane` pair is created up front so the
 * tree serializes to a viewable diagram even when empty. Each initial
 * element goes through the same `addElement` leg (validated type,
 * generated or caller id, explicit or grid-placed DI).
 *
 * @param name - The process name (non-blank; `invalid-property` otherwise).
 * @param initialElements - The initial elements (default: none).
 */
export function createProcess(name: string, initialElements: AddElementInput[] = []): CreateProcessResult {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return fail('invalid-property', 'the process name must be a non-blank string');
  }
  const processId = deriveProcessId(name);
  const slug = deriveSlug(processId, 'process.bpmn');
  const definitions = createBpmnElement('bpmn:Definitions', {
    id: 'Definitions_1',
    targetNamespace: 'http://bpmn.io/schema/bpmn',
  });
  const process = createBpmnElement('bpmn:Process', { id: processId, name, isExecutable: false });
  definitions.rootElements = [process];
  ensurePlane(definitions, process);

  for (const spec of initialElements) {
    const added = addElementToProcess(definitions, process, spec);
    if (!added.ok) {
      return added;
    }
  }
  return {
    ok: true,
    processId,
    slug,
    tree: definitions,
    elementCount: (process.flowElements ?? []).length,
  };
}

/**
 * The `add-element` change operation (REQ-002): adds a Stage 1
 * element to the document's process with its DI shape (explicit
 * coordinates as-is, omitted coordinates grid-placed). See the module
 * documentation for the id and coordinate rules.
 *
 * @param tree - The document root (mutated on success).
 * @param input - The element spec.
 */
export function addElement(tree: BpmnRootElement, input: AddElementInput): AddElementResult {
  const process = getProcessElement(tree);
  if (process === undefined) {
    return noProcess();
  }
  return addElementToProcess(tree, process, input);
}

/**
 * The `update-element` change operation (REQ-002): renames any flow
 * element, sets `isInterrupting` on start events, and
 * repositions an element's DI shape when coordinates are given
 * (pre-existing DI is never touched otherwise). x/y on a sequence
 * flow is a structured error (flow geometry belongs to `connect`).
 * Validation is complete before any mutation, so a structured error
 * always leaves the tree untouched (atomicity: the store's
 * write-through never sees a half-applied update).
 *
 * @param tree - The document root (mutated on success).
 * @param input - The update spec.
 */
export function updateElement(tree: BpmnRootElement, input: UpdateElementInput): UpdateElementResult {
  const process = getProcessElement(tree);
  if (process === undefined) {
    return noProcess();
  }
  const found = findFlowElement(tree, input.id);
  if (found === undefined) {
    return unknownElement(input.id);
  }
  const { element } = found;
  const error = validateUpdateInput(tree, element, input);
  if (error !== undefined) {
    return { ok: false, error };
  }
  return applyUpdate(tree, process, element, input);
}

/**
 * The `connect` change operation (REQ-002): creates a
 * `bpmn:SequenceFlow` between two flow nodes of the same process
 * scope, with a generated id, an optional name, and an optional
 * condition expression (a `bpmn:FormalExpression` body). A DI edge is
 * emitted between the two shapes (an endpoint without a shape gets a
 * grid-placed one); pre-existing DI is never touched.
 *
 * @param tree - The document root (mutated on success).
 * @param input - The connection spec.
 */
export function connect(tree: BpmnRootElement, input: ConnectInput): ConnectResult {
  const process = getProcessElement(tree);
  if (process === undefined) {
    return noProcess();
  }
  if (input.sourceId === input.targetId) {
    return fail('self-connect', `source and target are the same element (${quote(input.sourceId)})`);
  }
  const source = resolveEndpoint(tree, input.sourceId, 'source');
  if (!source.ok) {
    return source;
  }
  const target = resolveEndpoint(tree, input.targetId, 'target');
  if (!target.ok) {
    return target;
  }
  if (source.endpoint.container !== target.endpoint.container) {
    return fail(
      'cross-scope-connect',
      `source ${quote(input.sourceId)} and target ${quote(input.targetId)} are flow nodes of different process scopes`,
    );
  }
  return applyConnect(tree, process, source.endpoint, target.endpoint, input);
}

/**
 * The `delete-element` change operation (REQ-002, design note "Delete
 * semantics"): removes a sequence flow (the flow and its DI edge) or a
 * flow node (the node, every sequence flow referencing it wherever it
 * lives, the node's DI shape, and the DI edges of the removed flows).
 * The tree stays structurally consistent; model soundness (a start
 * event must exist, no dangling flows) is `validate`'s job.
 *
 * @param tree - The document root (mutated on success).
 * @param input - The element id to delete.
 */
export function deleteElement(tree: BpmnRootElement, input: DeleteElementInput): DeleteElementResult {
  const process = getProcessElement(tree);
  if (process === undefined) {
    return noProcess();
  }
  const found = findFlowElement(tree, input.id);
  if (found === undefined) {
    return unknownElement(input.id);
  }
  const { element, container } = found;
  const isFlow = element.$type === 'bpmn:SequenceFlow';

  const removedFlowIds = new Set<string>();
  if (isFlow) {
    removeFlowFromContainer(container, element);
    removedFlowIds.add(element.id);
  } else {
    for (const referencing of collectReferencingFlows(process, element.id)) {
      removeFlowFromContainer(referencing.container, referencing.flow);
      removedFlowIds.add(referencing.flow.id);
    }
    removeNodeFromContainer(container, element);
  }

  const removedDi = removeDiFor(tree, element.id, removedFlowIds);
  return {
    ok: true,
    id: element.id,
    kind: isFlow ? 'flow' : 'element',
    removedFlows: removedFlowIds.size,
    removedDiShapes: removedDi.shapes,
    removedDiEdges: removedDi.edges,
  };
}

/** The `add-element` leg shared by `createProcess` and `addElement`. */
function addElementToProcess(tree: BpmnRootElement, process: ModdleElement, input: AddElementInput): AddElementResult {
  const spec = resolveAddSpec(tree, input);
  if ('code' in spec) {
    return { ok: false, error: spec };
  }
  return applyAddToProcess(tree, process, spec);
}

/** The validated spec an `add-element` will apply. */
interface AddSpec {
  type: PrcElementType;
  moddleType: string;
  elementId: string;
  name?: string;
  bounds: Bounds;
}

/**
 * The validation phase of `add-element` (read-only, including the
 * grid scan for omitted coordinates): the type, the coordinates, the
 * id (shape and uniqueness), and the resulting DI bounds.
 */
function resolveAddSpec(tree: BpmnRootElement, input: AddElementInput): EditingError | AddSpec {
  const type = resolveElementType(input.type);
  if (type === undefined) {
    return {
      code: 'unknown-element-type',
      message: `unknown element type ${quote(input.type)}; the Stage 1 set is: ${Object.keys(ELEMENT_TYPES).join(', ')}`,
    };
  }
  if ((input.x === undefined) !== (input.y === undefined)) {
    return { code: 'invalid-coordinates', message: 'add-element needs both or neither of x and y' };
  }
  const coordinateProblem = invalidCoordinate(input.x, input.y);
  if (coordinateProblem !== undefined) {
    return { code: 'invalid-coordinates', message: `invalid coordinates: ${coordinateProblem}` };
  }
  const ids = takenIds(tree);
  const moddleType = ELEMENT_TYPES[type];
  const elementId = resolveElementId(input.id, moddleType, ids);
  if (elementId === undefined) {
    return { code: 'invalid-id', message: `the supplied element id ${quote(input.id)} is not a valid BPMN id` };
  }
  if (ids.has(elementId)) {
    return { code: 'duplicate-element-id', message: `element id ${quote(elementId)} already exists in the process` };
  }
  const size = sizeForType(moddleType);
  const position =
    input.x !== undefined && input.y !== undefined ? { x: input.x, y: input.y } : findFreeSlot(tree, size);
  return {
    type,
    moddleType,
    elementId,
    ...(input.name !== undefined ? { name: input.name } : {}),
    bounds: { ...position, width: size.width, height: size.height },
  };
}

/** The application phase of `add-element` (already validated). */
function applyAddToProcess(tree: BpmnRootElement, process: ModdleElement, spec: AddSpec): AddElementSuccess {
  const element = createBpmnElement(spec.moddleType, {
    id: spec.elementId,
    ...(spec.name !== undefined ? { name: spec.name } : {}),
  });
  const flowElements = Array.isArray(process.flowElements) ? process.flowElements : [];
  flowElements.push(element);
  process.flowElements = flowElements;
  const plane = ensurePlane(tree, process);
  attachToPlane(plane, createShapeForElement(element, spec.bounds, tree));
  const result: AddElementSuccess = {
    ok: true,
    id: spec.elementId,
    type: spec.type,
    x: spec.bounds.x,
    y: spec.bounds.y,
  };
  if (spec.name !== undefined) {
    result.name = spec.name;
  }
  return result;
}

/** The validation phase of `updateElement`: all input checks, no mutation. */
function validateUpdateInput(
  tree: BpmnRootElement,
  element: ModdleElement,
  input: UpdateElementInput,
): EditingError | undefined {
  const nameError = validateName(input.name);
  if (nameError !== undefined) {
    return nameError;
  }
  const propertyError = validateIsInterrupting(element, input.id, input.isInterrupting);
  if (propertyError !== undefined) {
    return propertyError;
  }
  const position = validateReposition(tree, element, input.id, input.x, input.y);
  if (position !== undefined && 'code' in position) {
    return position;
  }
  return undefined;
}

/** The application phase of `updateElement`: all validations passed. */
function applyUpdate(
  tree: BpmnRootElement,
  process: ModdleElement,
  element: ModdleElement,
  input: UpdateElementInput,
): UpdateElementSuccess {
  const changes: UpdateElementSuccess = { ok: true, id: element.id };
  if (input.name !== undefined) {
    element.name = input.name;
    changes.name = input.name;
  }
  if (input.isInterrupting !== undefined) {
    element.isInterrupting = input.isInterrupting;
    changes.isInterrupting = input.isInterrupting;
  }
  const position = validateReposition(tree, element, input.id, input.x, input.y);
  if (position !== undefined && 'x' in position) {
    applyReposition(tree, process, element, position, changes);
  }
  return changes;
}

/** Validates the `name` input (read-only); the application is a plain set. */
function validateName(name: string | undefined): EditingError | undefined {
  if (name === undefined) {
    return undefined;
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { code: 'invalid-property', message: 'name must be a non-blank string' };
  }
  return undefined;
}

/** Validates `isInterrupting` for the element (read-only); the application is a plain set. */
function validateIsInterrupting(
  element: ModdleElement,
  elementId: string,
  value: boolean | undefined,
): EditingError | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'boolean') {
    return { code: 'invalid-property', message: 'isInterrupting must be a boolean' };
  }
  if (!INTERRUPTIBLE_TYPES.has(element.$type)) {
    return {
      code: 'unsupported-property',
      message: `isInterrupting is only supported on start events (the metamodel declares it there); ${quote(elementId)} is a ${element.$type}`,
    };
  }
  return undefined;
}

/**
 * Validates the reposition input (read-only): no coordinates is a
 * no-op (`undefined`), a flow with coordinates is unsupported,
 * invalid coordinates fail, and a single axis resolves against the
 * existing shape's other axis (failing when the element has no
 * shape). On success, the resolved target position.
 */
function validateReposition(
  tree: BpmnRootElement,
  element: ModdleElement,
  elementId: string,
  x: number | undefined,
  y: number | undefined,
): EditingError | { x: number; y: number } | undefined {
  if (x === undefined && y === undefined) {
    return undefined;
  }
  if (element.$type === 'bpmn:SequenceFlow') {
    return {
      code: 'unsupported-property',
      message: `x/y are not supported on sequence flows; ${quote(elementId)} is a flow (connect owns flow geometry)`,
    };
  }
  const coordinateProblem = invalidCoordinate(x, y);
  if (coordinateProblem !== undefined) {
    return { code: 'invalid-coordinates', message: `invalid coordinates: ${coordinateProblem}` };
  }
  const existing = getShapeBounds(tree, element.id);
  const resolvedX = resolveAxis(x, existing, 'x');
  const resolvedY = resolveAxis(y, existing, 'y');
  if (resolvedX === undefined || resolvedY === undefined) {
    return {
      code: 'invalid-coordinates',
      message: `only one of x and y was given and ${quote(elementId)} has no existing shape to take the other axis from`,
    };
  }
  return { x: resolvedX, y: resolvedY };
}

/** One resolved axis: the given value, or the existing shape's value. */
function resolveAxis(value: number | undefined, existing: Bounds | undefined, axis: 'x' | 'y'): number | undefined {
  if (value !== undefined) {
    return value;
  }
  return existing?.[axis];
}

/**
 * The reposition application of `updateElement` (already validated):
 * updates the element's DI shape in place, or creates one when the
 * element has none. Records the new position in `changes`.
 */
function applyReposition(
  tree: BpmnRootElement,
  process: ModdleElement,
  element: ModdleElement,
  position: { x: number; y: number },
  changes: UpdateElementSuccess,
): void {
  const existing = getShapeBounds(tree, element.id);
  const size = existing ?? sizeForElement(element);
  const bounds: Bounds = { x: position.x, y: position.y, width: size.width, height: size.height };
  const shape = getShapeForElement(tree, element.id);
  if (shape !== undefined) {
    setShapeBounds(shape, bounds);
  } else {
    attachToPlane(ensurePlane(tree, process), createShapeForElement(element, bounds, tree));
  }
  changes.x = position.x;
  changes.y = position.y;
}

/**
 * The application phase of `connect` (both endpoints resolved and in
 * the same scope): creates the sequence flow with its optional name
 * and condition expression, pushes it into the shared container, and
 * emits the DI edge between the two endpoint shapes (auto-placing an
 * endpoint shape when the document carries none for it).
 */
function applyConnect(
  tree: BpmnRootElement,
  process: ModdleElement,
  source: FoundElement,
  target: FoundElement,
  input: ConnectInput,
): ConnectSuccess {
  const flowId = generateElementId('bpmn:SequenceFlow', takenIds(tree));
  const flow = createBpmnElement('bpmn:SequenceFlow', {
    id: flowId,
    sourceRef: source.element,
    targetRef: target.element,
  });
  let conditionSet = false;
  if (input.name !== undefined && input.name.trim().length > 0) {
    flow.name = input.name;
  }
  if (input.conditionExpression !== undefined && input.conditionExpression.trim().length > 0) {
    flow.conditionExpression = createBpmnElement('bpmn:FormalExpression', { body: input.conditionExpression });
    conditionSet = true;
  }
  const flowElements = Array.isArray(source.container.flowElements) ? source.container.flowElements : [];
  flowElements.push(flow);
  source.container.flowElements = flowElements;

  const plane = ensurePlane(tree, process);
  ensureEndpointShape(tree, plane, source.element);
  ensureEndpointShape(tree, plane, target.element);
  const sourceBounds = getShapeBounds(tree, source.element.id);
  const targetBounds = getShapeBounds(tree, target.element.id);
  precondition(
    sourceBounds !== undefined && targetBounds !== undefined,
    'connect must have ensured both endpoint shapes',
  );
  attachToPlane(plane, createEdgeForFlow(flow, sourceBounds, targetBounds, tree));
  return { ok: true, flowId, sourceId: input.sourceId, targetId: input.targetId, conditionSet };
}

/** Resolves a connect endpoint: a flow node (never a sequence flow) with its container. */
function resolveEndpoint(
  tree: BpmnRootElement,
  id: string,
  role: 'source' | 'target',
): { ok: true; endpoint: FoundElement } | EditingFailure {
  const found = findFlowElement(tree, id);
  if (found === undefined) {
    return {
      ok: false,
      error: { code: 'unknown-element-id', message: `the ${role} element ${quote(id)} does not exist in the process` },
    };
  }
  if (found.element.$type === 'bpmn:SequenceFlow') {
    return {
      ok: false,
      error: {
        code: 'unknown-element-id',
        message: `the ${role} element ${quote(id)} is a sequence flow, not a flow node`,
      },
    };
  }
  return { ok: true, endpoint: found };
}

/** Ensures a connect endpoint has a DI shape (grid-placed when absent). */
function ensureEndpointShape(tree: BpmnRootElement, plane: ModdleElement, element: ModdleElement): void {
  if (getShapeForElement(tree, element.id) !== undefined) {
    return;
  }
  const size = sizeForElement(element);
  const position = findFreeSlot(tree, size);
  attachToPlane(
    plane,
    createShapeForElement(element, { x: position.x, y: position.y, width: size.width, height: size.height }, tree),
  );
}

/** The document's single `bpmn:Process` root element, if there is exactly one. */
function getProcessElement(tree: BpmnRootElement): ModdleElement | undefined {
  const rootElements = tree.rootElements;
  if (!Array.isArray(rootElements)) {
    return undefined;
  }
  const processes = rootElements.filter((element) => isModdleElement(element) && element.$type === 'bpmn:Process');
  return processes.length === 1 ? processes[0] : undefined;
}

/** Finds a flow element (node or flow) by id, at any subprocess depth, with its container. */
function findFlowElement(tree: BpmnRootElement, id: string): FoundElement | undefined {
  const process = getProcessElement(tree);
  return process === undefined ? undefined : findInContainer(process, id);
}

/** The recursive container walk for `findFlowElement`. */
function findInContainer(container: ModdleElement, id: string): FoundElement | undefined {
  const flowElements = container.flowElements;
  if (!Array.isArray(flowElements)) {
    return undefined;
  }
  for (const element of flowElements) {
    if (!isModdleElement(element)) {
      continue;
    }
    if (element.id === id) {
      return { element, container };
    }
    if (element.$instanceOf('bpmn:SubProcess') === true) {
      const nested = findInContainer(element, id);
      if (nested !== undefined) {
        return nested;
      }
    }
  }
  return undefined;
}

/** Every sequence flow referencing the node id, at any subprocess depth, with its container. */
function collectReferencingFlows(
  process: ModdleElement,
  nodeId: string,
): { flow: ModdleElement; container: ModdleElement }[] {
  const result: { flow: ModdleElement; container: ModdleElement }[] = [];
  collectReferencingFlowsInContainer(process, nodeId, result);
  return result;
}

/** The recursive container walk for `collectReferencingFlows`. */
function collectReferencingFlowsInContainer(
  container: ModdleElement,
  nodeId: string,
  result: { flow: ModdleElement; container: ModdleElement }[],
): void {
  const flowElements = container.flowElements;
  if (!Array.isArray(flowElements)) {
    return;
  }
  for (const element of flowElements) {
    if (!isModdleElement(element)) {
      continue;
    }
    if (
      element.$type === 'bpmn:SequenceFlow' &&
      (element.sourceRef?.id === nodeId || element.targetRef?.id === nodeId)
    ) {
      result.push({ flow: element, container });
    }
    if (element.$instanceOf('bpmn:SubProcess') === true) {
      collectReferencingFlowsInContainer(element, nodeId, result);
    }
  }
}

/** Removes a flow from its container's `flowElements`. */
function removeFlowFromContainer(container: ModdleElement, flow: ModdleElement): void {
  const flowElements = container.flowElements;
  if (!Array.isArray(flowElements)) {
    return;
  }
  container.flowElements = flowElements.filter((element) => element !== flow);
}

/** Removes a node from its container's `flowElements`. */
function removeNodeFromContainer(container: ModdleElement, node: ModdleElement): void {
  const flowElements = container.flowElements;
  if (!Array.isArray(flowElements)) {
    return;
  }
  container.flowElements = flowElements.filter((element) => element !== node);
}

/**
 * Removes the DI of a deletion: the node's shape and the edges of the
 * removed flows (an edge removed when it depicts the element itself
 * or one of the cascade-removed flows). Returns the removal counts.
 */
function removeDiFor(
  tree: BpmnRootElement,
  elementId: string,
  removedFlowIds: Set<string>,
): { shapes: number; edges: number } {
  const plane = getPlane(tree);
  if (plane === undefined || !Array.isArray(plane.planeElement)) {
    return { shapes: 0, edges: 0 };
  }
  let shapes = 0;
  let edges = 0;
  const remaining: ModdleElement[] = [];
  for (const di of plane.planeElement) {
    if (!isModdleElement(di)) {
      remaining.push(di);
      continue;
    }
    const modelId = diModelId(di);
    if (di.$type === 'bpmndi:BPMNShape' && modelId === elementId) {
      shapes += 1;
      continue;
    }
    if (diIsRemovedEdge(di, modelId, elementId, removedFlowIds)) {
      edges += 1;
      continue;
    }
    remaining.push(di);
  }
  plane.planeElement = remaining;
  return { shapes, edges };
}

/** Whether this DI element is the edge of the removed element or one of the cascade-removed flows. */
function diIsRemovedEdge(
  di: ModdleElement,
  modelId: string | undefined,
  elementId: string,
  removedFlowIds: Set<string>,
): boolean {
  return (
    di.$type === 'bpmndi:BPMNEdge' && modelId !== undefined && (modelId === elementId || removedFlowIds.has(modelId))
  );
}

/** The id of the model element a DI shape/edge references, if resolvable. */
function diModelId(di: ModdleElement): string | undefined {
  const model = di.bpmnElement;
  return isModdleElement(model) && typeof model.id === 'string' ? model.id : undefined;
}

/** Resolves the Stage 1 element type from its tool-facing name. */
function resolveElementType(type: string): PrcElementType | undefined {
  return typeof type === 'string' && Object.hasOwn(ELEMENT_TYPES, type) ? (type as PrcElementType) : undefined;
}

/**
 * The element id to use: the caller's id (shape-validated) when
 * given and non-empty, otherwise a generated `<prefix>_<n>` id.
 * Returns `undefined` for a malformed caller id.
 */
function resolveElementId(supplied: string | undefined, moddleType: string, ids: Set<string>): string | undefined {
  if (supplied !== undefined && supplied.length > 0) {
    return ELEMENT_ID_PATTERN.test(supplied) ? supplied : undefined;
  }
  return generateElementId(moddleType, ids);
}

/**
 * Generates `<prefix>_<n>` with the smallest free n (family-aware):
 * the first free id of a family is `<prefix>_1` (never the bare
 * prefix), so generated ids never collide with a family's bare name.
 */
function generateElementId(moddleType: string, taken: Set<string>): string {
  const prefix = TYPE_ID_PREFIX[moddleType];
  if (prefix === undefined) {
    throw new Error(`no id prefix for metamodel type ${moddleType}`);
  }
  let suffix = 1;
  let candidate = `${prefix}_${suffix}`;
  while (taken.has(candidate)) {
    suffix += 1;
    candidate = `${prefix}_${suffix}`;
  }
  return candidate;
}

/** Every id the document already carries (model and DI alike). */
function takenIds(tree: BpmnRootElement): Set<string> {
  return new Set(collectElementInventory(tree).map((ref) => ref.id));
}

/** The first invalidity of the given coordinates, if any. */
function invalidCoordinate(x: number | undefined, y: number | undefined): string | undefined {
  if (x !== undefined && !isCoordinate(x)) {
    return `x must be a non-negative integer (got ${String(x)})`;
  }
  if (y !== undefined && !isCoordinate(y)) {
    return `y must be a non-negative integer (got ${String(y)})`;
  }
  return undefined;
}

/** A coordinate is a non-negative integer (NaN and Infinity are not). */
function isCoordinate(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

/** The `bpmn:Process` id for a created process (scoped decision): the
 * slugified name, prefixed `process-` when it would start with a
 * digit (BPMN ids are NCNames), and the constant `process` when the
 * name slugifies to nothing. */
function deriveProcessId(name: string): string {
  const slug = slugify(name);
  if (slug.length === 0) {
    return 'process';
  }
  return /^\p{N}/u.test(slug) ? `process-${slug}` : slug;
}

/** The `no-process` structured failure (exactly one process required). */
function noProcess(): EditingFailure {
  return fail('no-process', 'the document does not carry exactly one bpmn:Process element');
}

/** The `unknown-element-id` structured failure for a lookup miss. */
function unknownElement(id: string): EditingFailure {
  return fail('unknown-element-id', `no element with id ${quote(id)} in the process`);
}

/** Builds the structured failure side (always single-line). */
function fail(code: EditingErrorCode, message: string): EditingFailure {
  return { ok: false, error: { code, message: oneLine(message) } };
}

/** Quotes a value for embedding in a single-line message. */
function quote(value: string | undefined): string {
  return value === undefined ? '<unset>' : JSON.stringify(value);
}
