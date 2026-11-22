// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Type declarations for `prepare-publish.mjs` (the `prepack` pipeline,
 * feat-11 REQ-002, Task 100.110). The implementation is plain `.mjs`;
 * this sibling declaration lets the TypeScript tests import it under
 * `moduleResolution: NodeNext` without `allowJs`.
 */

/** The shebang line the packed bin carries (the `npx`/direct-exec requirement on Unix). */
export declare const SHEBANG: string;

/** The package directory the script ships in (`apps/mcp-server`). */
export declare const DEFAULT_PACKAGE_DIR: string;

/** The injectable lifecycle steps of `preparePublish` (tests stub `build`). */
export interface PreparePublishSteps {
  /** Runs the package build (defaults to `npm run build` in the package directory). */
  build?: (packageDir: string) => void;
}

/** Prepends the shebang to the file when absent (idempotent). */
export declare function ensureShebang(targetPath: string): void;

/** Adds the exec bit (user, group, other) to the file, keeping the other mode bits. */
export declare function ensureExecutable(targetPath: string): void;

/** Copies the repository-root `LICENSE` into the package directory (byte-identical). */
export declare function copyRootLicense(packageDir: string): void;

/** Runs `npm run build` in the package directory (the real build step). */
export declare function runBuild(packageDir: string): void;

/** The full prepack pipeline: build -> shebang + exec bit on `dist/index.js` -> `LICENSE` copy. */
export declare function preparePublish(packageDir?: string, steps?: PreparePublishSteps): void;
