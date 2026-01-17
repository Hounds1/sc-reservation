// @ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { baseConfig } from './base.mjs';

/** @type {import('typescript-eslint').Config} */
export const nestjsConfig = tseslint.config(
  {
    ignores: ['dist/**', 'eslint.config.mjs'],
  },
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);

export default nestjsConfig;
