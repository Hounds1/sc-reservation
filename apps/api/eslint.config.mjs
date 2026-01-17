// @ts-check
import nestjsConfig from '@repo/eslint-config/nestjs';

export default [
  ...nestjsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
