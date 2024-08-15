import tseslint from '@typescript-eslint/eslint-plugin' // Import TypeScript specific ESLint plugin
import tsParser from '@typescript-eslint/parser' // Import TypeScript parser for ESLint
import globals from 'globals' // Import global variables (like window, document, etc.)

export default [
  {
    // ESLint will ignore files in the 'dist' and 'node_modules' directories
    ignores: ['dist', 'node_modules'],
  },
  {
    // Apply the following settings to all TypeScript files
    files: ['**/*.{ts}'],
    languageOptions: {
      globals: globals.browser, // Specify browser global variables (like window, document, etc.)
      parser: tsParser, // Use TypeScript parser to parse TypeScript code
    },
    plugins: {
      '@typescript-eslint': tseslint, // Register TypeScript-specific ESLint plugin
    },
    rules: {
      // Extend recommended ESLint rules for TypeScript
      ...tseslint.configs.recommended.rules,
    },
  },
]
