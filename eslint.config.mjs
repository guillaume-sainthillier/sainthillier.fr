import globals from 'globals';
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
        ignores: ['public/**/*', 'resources/**/*', 'static/**/*', 'assets/js/polyfills.js'],
    },
    ...compat.extends('eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            'import/no-extraneous-dependencies': 'off',
            'func-names': 'off',
            'no-plusplus': 'off',
            'no-use-before-define': 'off',
            'no-param-reassign': 'off',
            'no-underscore-dangle': 'off',
            'max-len': 'off',
            'no-shadow': 'off',
            'no-console': 'off',
            'consistent-return': 'off',
            'no-multi-assign': 'off',
            'no-nested-ternary': 'off',
            'no-undef': 'off',
        },
    },
];
