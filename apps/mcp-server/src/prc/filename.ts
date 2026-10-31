// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { randomUUID } from 'node:crypto';

/**
 * The `prc-<uuid>-<slug>.bpmn` filename scheme (REQ-002, QA pair
 * 0.0300): each BPMN process lives at `prc/prc-<uuid>-<slug>.bpmn`
 * under the resolved documents root, matching this repository's own
 * `<type>-<uuid>-<slug>` specification-document convention. The
 * UUID (v4) is the process identifier; the slug is cosmetic for
 * addressing, derived once at import.
 */

/** The fixed prefix every conforming prc filename starts with. */
const FILENAME_PREFIX = 'prc';

/** The fixed extension every conforming prc filename ends with. */
const FILENAME_EXTENSION = '.bpmn';

/** The UUID v4 shape (lowercase hex, version nibble `4`, variant `[89ab]`). */
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * The slug character class (REQ-002): one or more runs of Unicode
 * letters or numbers (`\p{L}`/`\p{N}`, `u` flag), separated by
 * single hyphens, no leading or trailing hyphen, non-empty.
 */
const SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

/**
 * The full conforming-filename shape: `prc-` + a UUID v4 + `-` + a
 * slug + `.bpmn`. The UUID's fixed shape makes the split between
 * uuid and slug unambiguous even though the slug may itself contain
 * (single) hyphens.
 */
const FILENAME_PATTERN = /^prc-([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})-(.+)\.bpmn$/;

/** A parsed conforming prc filename. */
export interface PrcFilename {
  /** The process UUID (v4, lowercase). */
  uuid: string;
  /** The cosmetic slug (see `SLUG_PATTERN`). */
  slug: string;
}

/**
 * Slugifies a value (REQ-002): lowercases it, collapses every run of
 * characters that is neither a Unicode letter nor a number
 * (`\p{L}`/`\p{N}` with the `u` flag) to a single hyphen, and strips
 * leading/trailing hyphens. An input that slugifies to nothing
 * (empty, or only separators) yields the empty string -- deciding
 * what to do about an empty slug is the caller's business (the
 * source filename's stem is the documented fallback, the import
 * operation the documented error).
 *
 * @param value - The value to slugify (e.g. the document's
 *   `<bpmn:process id>` or the source filename's stem).
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generates a fresh process UUID (v4) (REQ-002), from Node's built-in
 * `crypto.randomUUID()`.
 */
export function generateUuid(): string {
  return randomUUID();
}

/**
 * Builds a conforming prc filename (REQ-002). Throws an `Error` when
 * the inputs do not fit the scheme (a UUID that is not v4, an empty
 * or malformed slug) -- building a non-conforming name is a
 * programming error, not a tool-input error.
 *
 * @param uuid - The process UUID (must be v4).
 * @param slug - The cosmetic slug (must fit `SLUG_PATTERN`).
 */
export function buildPrcFilename(uuid: string, slug: string): string {
  if (!UUID_V4_PATTERN.test(uuid)) {
    throw new Error(`cannot build a prc filename: ${uuid} is not a UUID v4`);
  }
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`cannot build a prc filename: ${slug} is not a valid slug`);
  }
  return `${FILENAME_PREFIX}-${uuid}-${slug}${FILENAME_EXTENSION}`;
}

/**
 * Parses a conforming prc filename (REQ-002). Returns `null` for
 * every non-conforming name (wrong or missing prefix, a UUID that is
 * not v4, a missing or wrong extension, a slug outside the slug
 * character class) -- the inventory relies on this to ignore
 * foreign files in the `prc` directory.
 *
 * @param name - The bare filename (no directory part) to parse.
 */
export function parsePrcFilename(name: string): PrcFilename | null {
  const match = FILENAME_PATTERN.exec(name);
  if (match === null) {
    return null;
  }
  const slug = match[2];
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }
  return { uuid: match[1], slug };
}

/**
 * The stem of a filename: the name without its last extension
 * (`order-process.bpmn` -> `order-process`, a name without an
 * extension unchanged, a leading-dot-only name like `.bpmn` ->
 * empty). The slug fallback uses this on the import source's
 * filename (REQ-002).
 *
 * @param filename - The bare filename (no directory part).
 */
export function stemOf(filename: string): string {
  return filename.replace(/\.[^.]*$/, '');
}

/**
 * Derives the slug for a new import (REQ-002, Design Note 3):
 * the slugified `<bpmn:process id>` of the document, falling back
 * to the slugified source filename's stem when the document has no
 * usable process `id` (absent, or an `id` that slugifies to
 * nothing). May return the empty string when neither source yields
 * a slug -- the import operation turns that into a structured
 * error.
 *
 * @param processId - The document's `<bpmn:process id>`, if any.
 * @param sourceFilename - The import source's bare filename.
 */
export function deriveSlug(processId: string | undefined, sourceFilename: string): string {
  if (processId !== undefined) {
    const fromProcessId = slugify(processId);
    if (fromProcessId.length > 0) {
      return fromProcessId;
    }
  }
  return slugify(stemOf(sourceFilename));
}
