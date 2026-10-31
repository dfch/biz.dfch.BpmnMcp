// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { describe, expect, it } from 'vitest';
import {
  buildPrcFilename,
  deriveSlug,
  generateUuid,
  parsePrcFilename,
  slugify,
  stemOf,
} from '../../src/prc/filename.js';

/** The UUID v4 shape (lowercase hex, version nibble `4`, variant `[89ab]`). */
const UUID_V4_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** A fixed, valid UUID v4 for deterministic expectations. */
const FIXED_UUID = '123e4567-e89b-42d3-a456-426614174000';

describe('slugify (REQ-002)', () => {
  it('lowercases and collapses runs of non-letter/non-number characters to a single hyphen', () => {
    expect(slugify('Order Process')).toBe('order-process');
    expect(slugify('a  b--c')).toBe('a-b-c');
    expect(slugify('file_2.name')).toBe('file-2-name');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('--foo--')).toBe('foo');
    expect(slugify('...')).toBe('');
  });

  it('keeps Unicode letters and numbers (the \\p{L}/\\p{N} class, u flag)', () => {
    expect(slugify('Über-Prozess')).toBe('über-prozess');
    expect(slugify('café_1')).toBe('café-1');
    expect(slugify('π-Δ process')).toBe('π-δ-process');
  });

  it('yields the empty string for empty or separator-only input', () => {
    expect(slugify('')).toBe('');
    expect(slugify('!!!')).toBe('');
  });
});

describe('generateUuid (REQ-002)', () => {
  it('returns UUID v4 values', () => {
    for (let i = 0; i < 5; i += 1) {
      expect(generateUuid()).toMatch(UUID_V4_SHAPE);
    }
  });

  it('returns distinct values', () => {
    expect(generateUuid()).not.toBe(generateUuid());
  });
});

describe('buildPrcFilename (REQ-002)', () => {
  it('builds prc-<uuid>-<slug>.bpmn', () => {
    expect(buildPrcFilename(FIXED_UUID, 'order-process')).toBe(
      'prc-123e4567-e89b-42d3-a456-426614174000-order-process.bpmn',
    );
  });

  it('rejects a UUID that is not v4', () => {
    expect(() => buildPrcFilename('123e4567-e89b-12d3-a456-426614174000', 'slug')).toThrow(/not a UUID v4/);
    expect(() => buildPrcFilename('123E4567-E89B-42D3-A456-426614174000', 'slug')).toThrow(/not a UUID v4/);
    expect(() => buildPrcFilename('not-a-uuid', 'slug')).toThrow(/not a UUID v4/);
  });

  it('rejects an empty or malformed slug', () => {
    const uuid = generateUuid();
    expect(() => buildPrcFilename(uuid, '')).toThrow(/not a valid slug/);
    expect(() => buildPrcFilename(uuid, '-leading')).toThrow(/not a valid slug/);
    expect(() => buildPrcFilename(uuid, 'trailing-')).toThrow(/not a valid slug/);
    expect(() => buildPrcFilename(uuid, 'a--b')).toThrow(/not a valid slug/);
    expect(() => buildPrcFilename(uuid, 'a.b')).toThrow(/not a valid slug/);
  });
});

describe('parsePrcFilename (REQ-002)', () => {
  it('round-trips a built filename', () => {
    const uuid = generateUuid();
    const built = buildPrcFilename(uuid, 'order-process');
    expect(parsePrcFilename(built)).toEqual({ uuid, slug: 'order-process' });
  });

  it('parses a slug that contains single hyphens', () => {
    expect(parsePrcFilename('prc-123e4567-e89b-42d3-a456-426614174000-a-b-c.bpmn')).toEqual({
      uuid: FIXED_UUID,
      slug: 'a-b-c',
    });
  });

  it('returns null for every non-conforming name', () => {
    const nonConformingNames = [
      'notes.bpmn',
      'prc-x.bpmn',
      `prc-${FIXED_UUID}.bpmn`,
      `prc-${FIXED_UUID}-slug`,
      `prc-${FIXED_UUID}-slug.bpmnx`,
      `prc-${FIXED_UUID}-a.b.bpmn`,
      `prc-${FIXED_UUID}--leading.bpmn`,
      `prc-${FIXED_UUID}-trailing-.bpmn`,
      `prc-${FIXED_UUID}-a--b.bpmn`,
      'prc-not-a-uuid-slug.bpmn',
      `prc-123E4567-E89B-42D3-A456-426614174000-slug.bpmn`,
      'PRC-123e4567-e89b-42d3-a456-426614174000-slug.bpmn',
    ];
    for (const name of nonConformingNames) {
      expect(parsePrcFilename(name), `expected ${name} to be rejected`).toBeNull();
    }
  });
});

describe('stemOf (REQ-002 fallback)', () => {
  it('strips the last extension', () => {
    expect(stemOf('order-process.bpmn')).toBe('order-process');
    expect(stemOf('archive.tar.gz')).toBe('archive.tar');
    expect(stemOf('no-extension')).toBe('no-extension');
    expect(stemOf('.bpmn')).toBe('');
  });
});

describe('deriveSlug (REQ-002, Design Note 3)', () => {
  it('slugifies the process id when it yields a slug', () => {
    expect(deriveSlug('Order Process', 'source.bpmn')).toBe('order-process');
  });

  it('falls back to the source filename stem when the document has no process id', () => {
    expect(deriveSlug(undefined, 'my-diagram.bpmn')).toBe('my-diagram');
  });

  it('falls back to the stem when the process id slugifies to nothing', () => {
    expect(deriveSlug('!!!', 'fallback-name.bpmn')).toBe('fallback-name');
  });

  it('returns the empty string when neither source yields a slug', () => {
    expect(deriveSlug(undefined, '!!!.bpmn')).toBe('');
  });
});
