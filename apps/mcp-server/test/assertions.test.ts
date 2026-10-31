// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { describe, expect, it } from 'vitest';
import { postcondition, precondition } from '../src/assertions.js';

/**
 * The assertion module's unit tests (REQ-009, ACC-010): a falsy
 * condition throws an `Error` carrying the given message, for both
 * helpers; a truthy condition passes; and the `asserts` signatures
 * narrow the asserted expression at the call site (compile-time
 * proof -- without the assertion, the narrowed use below would not
 * type-check under `strict`).
 */
describe('precondition (REQ-009, ACC-010)', () => {
  it('throws an Error carrying the given message on every falsy condition', () => {
    const falsyConditions: unknown[] = [false, 0, '', null, undefined, NaN];
    for (const condition of falsyConditions) {
      let caught: unknown;
      try {
        precondition(condition, 'the invariant must hold');
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(Error);
      expect((caught as Error).message).toBe('the invariant must hold');
    }
  });

  it('does not throw on a truthy condition', () => {
    expect(() => precondition(true, 'unused')).not.toThrow();
    expect(() => precondition(1, 'unused')).not.toThrow();
    expect(() => precondition('non-empty', 'unused')).not.toThrow();
    expect(() => precondition([], 'unused')).not.toThrow();
  });

  it('narrows the asserted condition at the call site', () => {
    const value: string | undefined = 'narrowed';
    precondition(value !== undefined, 'value is required');
    expect(value.length).toBe(8);
  });
});

describe('postcondition (REQ-009, ACC-010)', () => {
  it('throws an Error carrying the given message on every falsy condition', () => {
    const falsyConditions: unknown[] = [false, 0, '', null, undefined, NaN];
    for (const condition of falsyConditions) {
      let caught: unknown;
      try {
        postcondition(condition, 'the outcome must hold');
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(Error);
      expect((caught as Error).message).toBe('the outcome must hold');
    }
  });

  it('does not throw on a truthy condition', () => {
    expect(() => postcondition(true, 'unused')).not.toThrow();
    expect(() => postcondition(1, 'unused')).not.toThrow();
    expect(() => postcondition('non-empty', 'unused')).not.toThrow();
  });

  it('narrows the asserted condition at the call site', () => {
    const value: string | undefined = 'narrowed';
    postcondition(value !== undefined, 'value is required');
    expect(value.length).toBe(8);
  });
});
