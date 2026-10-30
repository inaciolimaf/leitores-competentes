import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const RAW_COLOUR = '/#[0-9a-fA-F]{3,8}\\b|\\b(oklch|rgba?|hsla?)\\(/'
const PALETTE_CLASS =
  '/\\b(text|bg|border|ring|from|to)-(white|black|slate|gray|zinc|neutral|red|blue|green|emerald|amber|yellow)\\b/'

export default defineConfig([
  globalIgnores(['dist', 'e2e/.output', 'test-results', 'playwright-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'max-lines': ['error', { max: 300, skipBlankLines: true }],
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'no-restricted-imports': ['error', {
        paths: [{ name: 'lucide-react', message: 'Icons are drawn in the project (spec 01).' }],
        patterns: [{ group: ['@/components/ui/*'], message: 'Screens are built from @/book (spec 01).' }],
      }],
      'no-restricted-syntax': ['error',
        { selector: `Literal[value=${RAW_COLOUR}]`, message: 'Colour only through tokens (spec 01).' },
        { selector: `TemplateElement[value.raw=${RAW_COLOUR}]`, message: 'Colour only through tokens (spec 01).' },
        { selector: `Literal[value=${PALETTE_CLASS}]`, message: 'Colour only through tokens (spec 01).' },
        { selector: `TemplateElement[value.raw=${PALETTE_CLASS}]`, message: 'Colour only through tokens (spec 01).' },
        { selector: "CallExpression[callee.property.name='addEventListener'][arguments.0.value='keydown']", message: 'No global keyboard listeners outside one place.' },
      ],
    },
  },
  {
    files: ['src/routes/*.lazy.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
