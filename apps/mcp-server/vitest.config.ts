// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // Required by the archunit `toPassAsync()` Vitest matcher
    // (CONSTITUTION §4, QA 7.0030).
    globals: true,
    // Test files run one at a time: the packed-artifact leg
    // (`mcp-server.packed.test.ts`, feat-11) runs `npm pack` (whose
    // `prepack` re-emits `dist/`) and a registry install, and the
    // spawn suite launches the built `dist/index.js` -- serialized
    // files keep the re-emit (and the install's CPU load) from
    // overlapping the spawned servers' start-up.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
