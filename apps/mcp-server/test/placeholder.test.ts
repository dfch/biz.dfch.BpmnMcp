// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { describe, expect, it } from 'vitest';
import { greet } from '../src/placeholder.js';

describe('greet', () => {
  it('greets the given name', () => {
    expect(greet('world')).toBe('Hello, world!');
  });
});
