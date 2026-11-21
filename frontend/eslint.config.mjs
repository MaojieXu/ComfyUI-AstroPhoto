import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
export default ts.config(
  { ignores: ['**/node_modules/**'] },
  { files: ['frontend/src/**/*.{ts,tsx,vue}', 'extension/**/*.{ts,tsx,vue}'],
    extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: { globals: globals.browser },
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  ...vue.configs['flat/essential'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: ts.parser } } },
  { files: ['**/*.tsx'], rules: { 'vue/multi-word-component-names': 'off' } },
  { files: ['frontend/src/vendor/**/*.ts', 'frontend/src/vendor/**/*.vue'], rules: { '@typescript-eslint/no-unused-vars': 'off' } },
);
