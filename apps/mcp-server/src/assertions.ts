// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The in-house design-by-contract assertion module (REQ-009, QA
 * pair 0.0260): small `asserts`-signature helpers that throw an
 * `Error` carrying the given message on a falsy condition and let
 * the compiler narrow the asserted expression at the call site.
 *
 * `precondition` guards invariants at operation entry;
 * `postcondition` verifies the outcome at operation exit. There is
 * no framework dependency; zod remains the boundary validator for
 * data crossing tool and module lines.
 */

/**
 * Asserts that the condition holds at operation entry (QA pair
 * 0.0260). On a falsy condition, throws an `Error` carrying
 * `message`; on a truthy condition, narrows `condition` for the
 * code that follows the call.
 *
 * @param condition - The invariant to assert (any expression).
 * @param message - The message the thrown `Error` carries.
 */
export function precondition(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Asserts that the condition holds at operation exit (QA pair
 * 0.0260). On a falsy condition, throws an `Error` carrying
 * `message`; on a truthy condition, narrows `condition` for the
 * code that follows the call.
 *
 * @param condition - The outcome to verify (any expression).
 * @param message - The message the thrown `Error` carries.
 */
export function postcondition(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
