// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { BpmnModdle } from 'bpmn-moddle';
import type { ModdleElement } from 'moddle';

/**
 * The bpmn-moddle wrappers (REQ-001, REQ-006): a process-wide
 * `BpmnModdle` singleton, parsing with structured error wrapping,
 * serialization with `format: true`, and the tree helpers the store
 * and the tests share (the document's process `id`, the element
 * inventory, the addressable inventory). This module owns every
 * `bpmn-moddle` touch point, so the rest of the core never sees the
 * library's raw API.
 */

/** The parsed BPMN 2.0 document root (typically a `bpmn:Definitions`). */
export type BpmnRootElement = ModdleElement;

/** The result of a successful parse. */
export interface BpmnParseResult {
  rootElement: BpmnRootElement;
}

/** One element of a parsed tree that carries an `id` attribute. */
export interface BpmnElementRef {
  /** The element's BPMN `id`. */
  id: string;
  /** The element's moddle type (e.g. `bpmn:Task`). */
  type: string;
}

/** The `kind` of an addressable flow, derived from the moddle type. */
export type FlowKind = 'sequence' | 'message';

/** One flow-model element of the addressable inventory. */
export interface AddressableElement {
  /** The element's BPMN `id`. */
  id: string;
  /** The element's moddle type (e.g. `bpmn:Task`). */
  type: string;
  /** The element's `name`, present only when it is non-empty. */
  name?: string;
}

/** One sequence or message flow of the addressable inventory. */
export interface AddressableFlow {
  /** The flow's BPMN `id`. */
  id: string;
  /** The flow's kind (derived from the moddle type). */
  kind: FlowKind;
  /** The source's BPMN `id`, present only when the `sourceRef` resolves. */
  source?: string;
  /** The target's BPMN `id`, present only when the `targetRef` resolves. */
  target?: string;
  /** The flow's condition expression text, present only when non-empty. */
  conditionExpression?: string;
}

/** The addressable inventory of a parsed tree (feat-18's `parse` result). */
export interface AddressableInventory {
  /** The flow-model elements, sorted by (type, id). */
  elements: AddressableElement[];
  /** The sequence and message flows, sorted by id. */
  flows: AddressableFlow[];
}

/**
 * Structured parse failure (QA pair 0.0260's "unparseable XML with
 * the bpmn-moddle cause"): carries a single-line message with the
 * bpmn-moddle cause folded in, and the original error as its
 * `cause`. The store maps this to its `not-bpmn` structured error;
 * nothing else in the core needs to distinguish parse failures any
 * further.
 */
export class BpmnParseError extends Error {
  constructor(cause: unknown) {
    super(`failed to parse BPMN 2.0 XML: ${causeMessage(cause)}`, { cause });
    this.name = 'BpmnParseError';
  }
}

/** The process-wide `BpmnModdle` singleton (REQ-001). */
const moddle = new BpmnModdle();

/**
 * Parses a BPMN 2.0 XML document into a moddle element tree
 * (REQ-001). The input may be a string or raw bytes (converted to
 * UTF-8 text first -- the underlying reader accepts strings only);
 * a document that is not parseable BPMN 2.0 XML rejects with a
 * `BpmnParseError` (never a raw bpmn-moddle error).
 *
 * @param input - The XML document to parse.
 */
export async function parseBpmn(input: string | Uint8Array): Promise<BpmnParseResult> {
  try {
    const result = await moddle.fromXML(toParseInput(input));
    return { rootElement: result.rootElement };
  } catch (cause) {
    throw new BpmnParseError(cause);
  }
}

/**
 * Serializes a moddle element tree to BPMN 2.0 XML (REQ-006),
 * formatted (indented) per the plan's `format: true` decision.
 *
 * @param rootElement - The document root (typically the parsed
 *   `bpmn:Definitions`) to serialize.
 */
export async function serializeBpmn(rootElement: BpmnRootElement): Promise<string> {
  const { xml } = await moddle.toXML(rootElement, { format: true });
  return xml;
}

/**
 * Creates a new BPMN metamodel element from the singleton
 * (feat-17's tree construction): a thin wrapper over the factory so
 * this module keeps owning every `bpmn-moddle` touch point. Element
 * references (a shape's `bpmnElement`, a flow's `sourceRef`) may be
 * given as already-created element objects; the writer resolves them
 * by `id` at serialization time.
 *
 * @param type - The metamodel type name (e.g. `bpmn:Task`,
 *   `bpmndi:BPMNShape`, `dc:Bounds`).
 * @param attrs - The initial attribute values.
 */
export function createBpmnElement(type: string, attrs?: Record<string, unknown>): ModdleElement {
  return moddle.create(type, attrs);
}

/**
 * The `id` of the document's `<bpmn:process>` element (REQ-002's
 * slug source), or `undefined` when the document has no process
 * with a usable `id` (no `bpmn:Process` root element at all, or one
 * without an `id` attribute).
 *
 * @param rootElement - The parsed document root.
 */
export function getProcessId(rootElement: BpmnRootElement): string | undefined {
  const rootElements = rootElement.rootElements;
  if (!Array.isArray(rootElements)) {
    return undefined;
  }
  const process = rootElements.find((element) => isModdleElement(element) && element.$type === 'bpmn:Process');
  if (!isModdleElement(process)) {
    return undefined;
  }
  const id = process.id;
  return typeof id === 'string' && id.length > 0 ? id : undefined;
}

/**
 * The element inventory of a parsed tree (REQ-006's postcondition
 * basis): every element that carries a non-empty `id`, as a
 * deterministically sorted list of `{ id, type }` pairs. The walk
 * is metamodel-driven (each element's own descriptor, cycle-safe
 * through a visited set) and follows every property value that is
 * itself a moddle element -- the many-valued child collections
 * (`rootElements`, `flowElements`, the DI's `diagrams`, the
 * plane's `planeElement`) and the single-valued element references.
 * The process model and the BPMNDI interchange information are thus
 * covered alike: the diagram lives in `Definitions.diagrams`, the
 * plane in `BPMNDiagram.plane`, the shapes and edges in
 * `BPMNPlane.planeElement`.
 *
 * Metamodel `isReference` attributes (the shapes' and edges'
 * `bpmnElement`, a flow's `sourceRef`/`targetRef`) are resolved to
 * element objects at the end of the parse, so a resolvable one is
 * followed like any other reference; an unresolvable id leaves the
 * property unset (a parse warning), and plain string attributes
 * carry no element at all -- both are skipped. In a well-formed
 * document a resolved reference always points at an element some
 * child collection already carries, so the visited set makes those
 * legs no-ops; reachability never depends on reference traversal.
 * The visited-set loop is the `walkElements` helper shared with
 * `collectAddressableInventory`.
 *
 * @param rootElement - The parsed document root.
 */
export function collectElementInventory(rootElement: BpmnRootElement): BpmnElementRef[] {
  const refs: BpmnElementRef[] = [];
  walkElements(rootElement, (element) => recordRef(element, refs));
  return refs.sort(compareElementRefs);
}

/**
 * The addressable inventory of a parsed tree (feat-18's `parse`
 * result, REQ-001/REQ-002): every flow-model element that carries a
 * non-empty `id` -- its BPMN `id`, moddle `type`, and `name`
 * (omitted when the name is absent or empty) -- plus every sequence
 * and message flow, carrying its `id`, `kind` (`sequence` for a
 * `bpmn:SequenceFlow`, `message` for a `bpmn:MessageFlow`), its
 * `sourceRef`/`targetRef` resolved to the referenced element's BPMN
 * `id` (omitted when the reference does not resolve), and the text
 * of its `conditionExpression` child (omitted when the flow carries
 * no non-empty condition expression).
 *
 * Unlike `collectElementInventory`, the document's container
 * elements (the `bpmn:Definitions`, the `bpmn:Process` and
 * collaboration scope) and the entire BPMNDI interchange
 * information are excluded: the agent addresses elements by their
 * BPMN id in `change` calls, and DI shapes and edges are not
 * change-addressable. The recorded elements are the flow-model
 * elements -- the `bpmn:FlowElement` instances of every process (at
 * any subprocess depth) plus the collaboration-scoped
 * `bpmn:MessageFlow` elements (the metamodel declares them as plain
 * `bpmn:BaseElement`, so they are matched by type). Any other
 * flow-like element type (expect none in Stage 1 diagrams) would
 * appear in `elements` but in no `flows` entry: `kind` is `sequence`
 * or `message` only. Artifacts (e.g. a `bpmn:Association`, a
 * `bpmn:Group`) are not flow-model elements and are excluded from
 * both lists, like the container elements and the BPMNDI
 * information -- they are not change-addressable.
 *
 * The walk is metamodel-driven and cycle-safe exactly like
 * `collectElementInventory` (the shared visited-set loop over the
 * descriptor's many-valued collections and single-valued element
 * references); the `elements` are sorted by (type, id) through the
 * same `compareElementRefs` comparator, the `flows` by id.
 *
 * @param rootElement - The parsed document root.
 */
export function collectAddressableInventory(rootElement: BpmnRootElement): AddressableInventory {
  const inventory: AddressableInventory = { elements: [], flows: [] };
  walkElements(rootElement, (element) => recordAddressableElement(element, inventory));
  inventory.elements.sort(compareElementRefs);
  inventory.flows.sort(compareFlowRefs);
  return inventory;
}

/**
 * Records the element in the inventory when it carries a non-empty
 * `id` attribute.
 *
 * @param element - The visited element.
 * @param refs - The inventory being built (mutated).
 */
function recordRef(element: ModdleElement, refs: BpmnElementRef[]): void {
  const id = element.id;
  if (typeof id === 'string' && id.length > 0) {
    refs.push({ id, type: element.$type });
  }
}

/**
 * The metamodel-driven walk the inventories share: visits the start
 * element and every element reachable from it through child
 * references, invoking `record` on each visited element exactly
 * once -- the visited set makes the walk cycle-safe (a resolved
 * reference back to an already-visited element is a no-op).
 *
 * @param start - The element the walk starts at (visited first).
 * @param record - The per-element recording callback (mutates its
 *   own inventory).
 */
function walkElements(start: ModdleElement, record: (element: ModdleElement) => void): void {
  const seen = new Set<object>();

  const visit = (element: ModdleElement): void => {
    if (seen.has(element)) {
      return;
    }
    seen.add(element);
    record(element);
    for (const child of childReferences(element)) {
      visit(child);
    }
  };

  visit(start);
}

/**
 * Whether the element belongs in the addressable inventory: a
 * flow-model element -- a `bpmn:FlowElement` instance (the
 * process's flow model at any subprocess depth) or a
 * collaboration-scoped `bpmn:MessageFlow` (a plain `bpmn:BaseElement`
 * in the metamodel, matched by type).
 *
 * @param element - The visited element.
 */
function isAddressableElement(element: ModdleElement): boolean {
  return element.$instanceOf('bpmn:FlowElement') === true || element.$type === 'bpmn:MessageFlow';
}

/**
 * Records the element in the addressable inventory when it is a
 * flow-model element carrying a non-empty `id`: in `elements` with
 * its id, type, and name (omitted when the name is absent or
 * empty), and -- for a sequence or message flow -- additionally in
 * `flows`.
 *
 * @param element - The visited element.
 * @param inventory - The inventory being built (mutated).
 */
function recordAddressableElement(element: ModdleElement, inventory: AddressableInventory): void {
  const id = element.id;
  if (typeof id !== 'string' || id.length === 0) {
    return;
  }
  if (!isAddressableElement(element)) {
    return;
  }
  const name = element.name;
  const entry: AddressableElement = { id, type: element.$type };
  if (typeof name === 'string' && name.length > 0) {
    entry.name = name;
  }
  inventory.elements.push(entry);
  const flow = toFlowRef(element, id);
  if (flow !== undefined) {
    inventory.flows.push(flow);
  }
}

/**
 * The flow entry of the addressable inventory for a sequence or
 * message flow element, or `undefined` for every other element type
 * (`kind` is `sequence` or `message` only -- any other flow-like
 * type, expect none in Stage 1 diagrams, is not an addressable
 * flow).
 *
 * @param element - The visited flow-model element.
 * @param id - The element's non-empty BPMN `id` (checked by the
 *   caller).
 */
function toFlowRef(element: ModdleElement, id: string): AddressableFlow | undefined {
  let kind: FlowKind | undefined;
  if (element.$type === 'bpmn:SequenceFlow') {
    kind = 'sequence';
  } else if (element.$type === 'bpmn:MessageFlow') {
    kind = 'message';
  }
  if (kind === undefined) {
    return undefined;
  }
  const source = referenceId(element.sourceRef);
  const target = referenceId(element.targetRef);
  const condition = conditionText(element);
  const flow: AddressableFlow = { id, kind };
  if (source !== undefined) {
    flow.source = source;
  }
  if (target !== undefined) {
    flow.target = target;
  }
  if (condition !== undefined) {
    flow.conditionExpression = condition;
  }
  return flow;
}

/**
 * The BPMN `id` an element reference resolves to: a resolved
 * reference yields the referenced element's id, a raw string
 * reference its own value (defensive -- a full parse leaves
 * unresolvable references unset), and every other value nothing.
 *
 * @param reference - The reference value (a `sourceRef`/`targetRef`).
 */
function referenceId(reference: unknown): string | undefined {
  if (typeof reference === 'string' && reference.length > 0) {
    return reference;
  }
  if (isModdleElement(reference) && typeof reference.id === 'string' && reference.id.length > 0) {
    return reference.id;
  }
  return undefined;
}

/**
 * The text of the element's `conditionExpression` child (a
 * `bpmn:FormalExpression` carrying its expression in `body`), when
 * present and non-empty -- a missing child or an empty text counts
 * as absent, as for `name`. A `bpmn:MessageFlow` carries no
 * `conditionExpression` property at all.
 *
 * @param element - The visited flow element.
 */
function conditionText(element: ModdleElement): string | undefined {
  const expression = element.conditionExpression;
  if (!isModdleElement(expression)) {
    return undefined;
  }
  const body = expression.body;
  return typeof body === 'string' && body.length > 0 ? body : undefined;
}

/**
 * The moddle elements this element directly references: the values
 * of its many-valued properties that are element arrays, plus the
 * values of its single-valued element-reference properties.
 *
 * @param element - The visited element.
 */
function childReferences(element: ModdleElement): ModdleElement[] {
  const children: ModdleElement[] = [];
  const descriptor = element.$descriptor;
  if (descriptor === undefined || !Array.isArray(descriptor.properties)) {
    return children;
  }
  for (const property of descriptor.properties) {
    const value = element[property.name];
    if (property.isMany && Array.isArray(value)) {
      for (const child of value) {
        if (isModdleElement(child)) {
          children.push(child);
        }
      }
    } else if (isModdleElement(value)) {
      children.push(value);
    }
  }
  return children;
}

/**
 * Converts the parse input to the string form the underlying reader
 * requires (raw bytes are decoded as UTF-8).
 *
 * @param input - The parse input.
 */
function toParseInput(input: string | Uint8Array): string {
  return typeof input === 'string' ? input : Buffer.from(input).toString('utf8');
}

/**
 * The single-line message of a cause: its `message` (or its string
 * form) with every whitespace run collapsed to one space.
 *
 * @param cause - The original error value.
 */
function causeMessage(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : String(cause);
  return oneLine(message);
}

/** Collapses every whitespace run of a string to a single space. */
export function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Type guard: is this value a moddle element (anything carrying a string `$type`)? */
export function isModdleElement(value: unknown): value is ModdleElement {
  return value !== null && typeof value === 'object' && typeof (value as ModdleElement).$type === 'string';
}

/** The deterministic inventory order: by type, then by id. */
function compareElementRefs(a: BpmnElementRef, b: BpmnElementRef): number {
  if (a.type !== b.type) {
    return a.type < b.type ? -1 : 1;
  }
  if (a.id !== b.id) {
    return a.id < b.id ? -1 : 1;
  }
  return 0;
}

/** The deterministic flow order: by id. */
function compareFlowRefs(a: AddressableFlow, b: AddressableFlow): number {
  if (a.id !== b.id) {
    return a.id < b.id ? -1 : 1;
  }
  return 0;
}
