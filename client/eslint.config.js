import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    name: 'crm-eslint',
    linterOptions: {
      noInlineConfig: false
    },
    rules: {
      '@typescript-eslint/no-array-constructor': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    },
    settings: {},
    languageOptions: {
      globals: {
        system: true,
        process: true
      }
    }
  }
];
