import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
  {
    files: ['src/main/server.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['jest.config.js'],
    languageOptions: { globals: { module: 'writable' } },
  },
  prettier,
);
