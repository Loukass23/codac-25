import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Enforce naming conventions
      camelcase: ['warn', { properties: 'never', ignoreDestructuring: false }],

      // Prefer named exports
      'import/prefer-default-export': 'off',
      // 'import/no-default-export': 'warn',

      // TypeScript specific rules - STRICTER
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error', // Changed from warn to error
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // React specific rules - STRICTER
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'error', // Changed from warn to error
      'react/display-name': 'error', // Enforce display names
      'react-hooks/exhaustive-deps': 'warn',

      // General code quality - STRICTER
      'no-console': ['error', { allow: ['warn', 'error'] }], // Changed from warn to error
      'prefer-const': 'error', // Changed from warn to error
      'no-var': 'error', // Changed from warn to error
      'no-unused-expressions': 'error',
      'no-debugger': 'error',

      // Import organization - ENHANCED
      'import/order': [
        'error', // Changed from warn to error
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
    },
  },
  {
    files: ['app/**/*.tsx', 'app/**/*.ts'],
    rules: {
      // Allow default exports for Next.js app router pages
      'import/no-default-export': 'off',
    },
  },
];

export default eslintConfig;
