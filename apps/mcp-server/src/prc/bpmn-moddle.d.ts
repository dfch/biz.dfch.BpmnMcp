// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Type declarations for the `bpmn-moddle` main entry point (REQ-001).
 *
 * The npm package ships its generated element types under the
 * `bpmn-moddle/types` subpath only; its `exports["."]` entry carries
 * no `types` condition, so the named ESM import
 * `import { BpmnModdle } from 'bpmn-moddle'` has no declarations of
 * its own. This ambient declaration maps the runtime `BpmnModdle`
 * class (verified against the package's `dist`: it exports the
 * `SimpleBpmnModdle` subclass of `moddle`'s `Moddle` under the name
 * `BpmnModdle`) onto the `moddle` base class plus the two XML
 * operations this component uses. The `moddle` package is
 * bpmn-moddle's own committed dependency (pinned in the workspace
 * lock file), so its types resolve without any extra manifest entry;
 * the import here is type-only and adds no runtime coupling.
 */
declare module 'bpmn-moddle' {
  import type { Moddle } from 'moddle';
  import type { ModdleElement } from 'moddle';

  /**
   * The bpmn-moddle parse result (the moddle-xml `ParseResult` shape,
   * verified at runtime by the feat-2 Task 100.100 interop check):
   * `rootElement` is the parsed document root (typically an
   * instance of `bpmn:Definitions`), `elementsById` a null-prototype
   * mapping of each element `id` to its element, `references` the
   * collected unresolved references, and `warnings` the parse
   * warnings.
   */
  export interface BpmnParseResult {
    rootElement: ModdleElement;
    elementsById: Record<string, ModdleElement>;
    references: unknown[];
    warnings: string[];
  }

  /** The bpmn-moddle serialization result. */
  export interface BpmnSerializeResult {
    xml: string;
  }

  export class BpmnModdle extends Moddle {
    /**
     * Creates the BPMN moddle with the BPMN 2.0 metamodel already
     * registered (the runtime `SimpleBpmnModdle` constructor takes
     * no arguments; the declaration must override the base class'
     * package-taking constructor for that to type-check).
     */
    constructor();

    /**
     * Parses a BPMN 2.0 XML document (a string -- the underlying
     * reader rejects anything else) into a moddle element tree.
     *
     * @param xml - The XML document to parse.
     * @param typeName - The expected root element type (defaults to
     *   `bpmn:Definitions`).
     * @param options - Options for the underlying reader.
     */
    fromXML(xml: string, typeName?: string, options?: Record<string, unknown>): Promise<BpmnParseResult>;

    /**
     * Serializes a moddle element tree (typically the parsed
     * `bpmn:Definitions` root) back to BPMN 2.0 XML.
     *
     * @param element - The root element to serialize.
     * @param options - Options for the underlying writer
     *   (e.g. `{ format: true }` for indented output).
     */
    toXML(element: ModdleElement, options?: Record<string, unknown>): Promise<BpmnSerializeResult>;
  }
}
