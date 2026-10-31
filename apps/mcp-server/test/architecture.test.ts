// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import { describe, expect, it } from 'vitest';
import type { CheckOptions } from 'archunit';
import { projectFiles } from 'archunit';

// Type the archunit `toPassAsync()` matcher (vitest custom-matcher
// augmentation, per the vitest docs): archunit registers the matcher at
// runtime via the global `expect` (hence `globals: true` in
// vitest.config.ts), but its own declaration targets a global
// `VitestAssertion` interface vitest's `Assertion` does not reference.
declare module 'vitest' {
  // The type parameters are unused in this member but must mirror
  // vitest's own `Assertion` declaration exactly for the interface
  // merge to type-check.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<R extends void | Promise<void> = void, T = unknown> {
    toPassAsync(options?: CheckOptions): Promise<void>;
  }
}

// The rules below are the machine home of CONSTITUTION §4 (architecture
// as tested code) and of QA 7.0030. They encode the layering decided in
// QA 7.0010 (the BPMN core module with thin protocol adapters) so that
// the Stage 2 canvas-server split stays possible: the core never
// depends on the MCP adapter layer or the protocol itself, and the
// adapters never own the filesystem.
//
// Intra-project boundaries use archunit's `dependOnFiles` (exact
// module-graph matching); external dependencies (the MCP SDK, node
// builtins) are matched against the import statements in the file
// content, because archunit's project file set is the component's
// TypeScript sources. A forbidden specifier written in a comment or a
// string literal trips the gate -- do not do that in the core.

// `import ... from '@modelcontextprotocol/sdk[...]'`, including
// `import type`, namespace/default named imports, multi-line import
// clauses, and side-effect imports.
const SDK_IMPORT = /import\s+(?:type\s+)?(?:[\w${}\s,*]+from\s+)?['"]@modelcontextprotocol\/sdk[^'"]*['"]/;

// `import ... from 'fs' | 'node:fs' | 'node:fs/promises'` (and the
// `node:`-prefixed and type-only spellings).
const FS_IMPORT = /import\s+(?:type\s+)?(?:[\w${}\s,*]+from\s+)?['"](node:)?fs(\/promises)?['"]/;

describe('architecture (CONSTITUTION §4, QA 7.0030)', () => {
  it('src: no circular dependencies', async () => {
    const rule = projectFiles().inPath('src/**').should().haveNoCycles();
    await expect(rule).toPassAsync();
  });

  it('src: production code does not depend on test code', async () => {
    const rule = projectFiles().inPath('src/**').shouldNot().dependOnFiles().inPath('test/**');
    await expect(rule).toPassAsync();
  });

  it('src/prc (core): does not depend on the MCP adapter layer (server.ts, index.ts)', async () => {
    const rule = projectFiles()
      .inPath('src/prc/**')
      .shouldNot()
      .dependOnFiles()
      .inPath(/^src\/(server|index)\.ts$/);
    // `src/prc/` does not exist yet (feat-2-prc-import-export); the rule
    // bites as soon as the core lands, so an empty subject set passes.
    await expect(rule).toPassAsync({ allowEmptyTests: true });
  });

  it('src/prc (core): does not import the MCP protocol (@modelcontextprotocol/sdk)', async () => {
    const rule = projectFiles()
      .inPath('src/prc/**')
      .shouldNot()
      .adhereTo(
        (file) => SDK_IMPORT.test(file.content),
        'the prc core must not import @modelcontextprotocol/sdk (QA 7.0010: thin protocol adapters over the core)',
      );
    await expect(rule).toPassAsync({ allowEmptyTests: true });
  });

  it('adapters (server.ts, index.ts): do not import the filesystem (node:fs)', async () => {
    const rule = projectFiles()
      .inPath(/^src\/(server|index)\.ts$/)
      .shouldNot()
      .adhereTo(
        (file) => FS_IMPORT.test(file.content),
        'the MCP adapters must not import node:fs (QA 7.0010: the core owns the filesystem)',
      );
    await expect(rule).toPassAsync();
  });
});
