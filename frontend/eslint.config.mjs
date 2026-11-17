import js from '@eslint/js';
import ts from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
export default ts.config(
  { ignores: ['node_modules/**', 'src/**', 'tests/**'] },
  { files: ['ui/src/**/*.{ts,tsx}'], extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.jest } },
    plugins: { 'react-hooks': hooks }, rules: { ...hooks.configs.recommended.rules } }
);
