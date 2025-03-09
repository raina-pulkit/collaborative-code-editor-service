import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import node from 'eslint-plugin-node';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js', '**/tsconfig.json', '**/.eslintrc.js'],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      node,
      import: importPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir:
          '/Users/pulkit.raina/Desktop/Personal/collaborative-code-editor-service',
      },
    },

    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      'node/no-extraneous-import': [
        'error',
        {
          allowModules: ['express'],
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.object.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true])), CallExpression[callee.object.property.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true]))',
          message:
            'Add "{ infer: true }" to configService.get() for correct typechecking. Example: configService.get("database.port", { infer: true })',
        },
        {
          selector:
            'CallExpression[callee.name=it][arguments.0.value!=/^should/]',
          message: '"it" should start with "should"',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
];
