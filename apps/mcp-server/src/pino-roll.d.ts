// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * `pino-roll` ships no type declarations (REQ-008). This minimal
 * ambient module declaration covers only the options this project
 * uses; see `logging.ts` for the actual usage.
 */
declare module 'pino-roll' {
  import type { Writable } from 'node:stream';

  interface PinoRollLimit {
    count?: number;
    removeOtherLogFiles?: boolean;
  }

  interface PinoRollOptions {
    file: string;
    frequency?: string | number;
    size?: string | number;
    extension?: string;
    symlink?: boolean;
    limit?: PinoRollLimit;
    dateFormat?: string;
    mkdir?: boolean;
  }

  export default function build(options: PinoRollOptions): Promise<Writable>;
}
