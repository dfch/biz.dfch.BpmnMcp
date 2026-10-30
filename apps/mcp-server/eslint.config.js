// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Cyclomatic complexity measurement (QA 0.0240): the common
      // ecosystem starting value, adjustable config default, not a
      // user requirement.
      complexity: ['error', 10],

      // Naming conventions (QA 0.0250, Google TypeScript Style Guide).
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['typeLike', 'enumMember'],
          format: ['PascalCase'],
        },
        {
          selector: ['variableLike', 'memberLike'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
      ],

      // Nothing in the process may write to stdout except the MCP
      // SDK's protocol frames (REQ-006); console.log et al. are
      // banned at the source level (0.0140).
      'no-console': 'error',
    },
  },
  // eslint-config-prettier last: turns off ESLint's stylistic rules
  // so they never conflict with Prettier (QA 0.0280).
  eslintConfigPrettier,
);
