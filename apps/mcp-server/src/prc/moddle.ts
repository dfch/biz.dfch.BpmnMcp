// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { BpmnModdle } from 'bpmn-moddle';
import type { ModdleElement } from 'moddle';

/**
 * The bpmn-moddle wrappers (REQ-001, REQ-006): a process-wide
 * `BpmnModdle` singleton, parsing with structured error wrapping,
 * serialization with `format: true`, and the tree helpers the store
 * and the tests share (the document's process `id`, the element
 * inventory). This module owns every `bpmn-moddle` touch point, so
 * the rest of the core never sees the library's raw API.
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
 * is metamodel-driven (each element's own descriptor: its many-
 * valued child properties and its single-valued element references,
 * cycle-safe through a visited set), so it covers the process model
 * and the BPMNDI interchange information alike -- including
 * elements reachable only through attribute references (the
 * diagram's `bpmnElement`, the plane's `planeElement`, a flow's
 * `sourceRef`/`targetRef`).
 *
 * @param rootElement - The parsed document root.
 */
export function collectElementInventory(rootElement: BpmnRootElement): BpmnElementRef[] {
  const refs: BpmnElementRef[] = [];
  const seen = new Set<object>();

  const visit = (element: ModdleElement): void => {
    if (seen.has(element)) {
      return;
    }
    seen.add(element);
    recordRef(element, refs);
    for (const child of childReferences(element)) {
      visit(child);
    }
  };

  visit(rootElement);
  return refs.sort(compareElementRefs);
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
function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Type guard: is this value a moddle element (anything carrying a string `$type`)? */
function isModdleElement(value: unknown): value is ModdleElement {
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
