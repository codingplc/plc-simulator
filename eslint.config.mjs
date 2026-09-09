import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  // tests/ holds an unwired enzyme template full of __COMPONENT_NAME__
  // placeholders, so it does not parse as real source
  { ignores: ['build/**', 'dev-dist/**', 'tests/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: { '@typescript-eslint': tsPlugin, react },
    // pinned rather than 'detect': eslint-plugin-react's version probe uses
    // context.getFilename(), which eslint 10 removed
    settings: { react: { version: '19.2' } },
    rules: {
      // turns off the base rules that TypeScript itself already reports
      ...tsPlugin.configs['eslint-recommended'].overrides[0].rules,
      ...react.configs.recommended.rules,
      'no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  prettier,
];
