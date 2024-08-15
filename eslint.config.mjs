import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist'], // 'dist' ディレクトリを無視する設定
  },
  {
    files: ['**/*.ts'], // TypeScriptファイルのみに対してLintを実行
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint, // TypeScript用のプラグイン
    },
    rules: {
      ...tseslint.configs.recommended.rules, // TypeScript ESLintの推奨ルール
      '@typescript-eslint/ban-ts-comment': 'warn', // ts-commentの使用を警告
    },
  },
]
