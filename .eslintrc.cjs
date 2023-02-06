module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:import/recommended',
    'airbnb-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules/*', '*.svg'],
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  rules: {
    "react/react-in-jsx-scope": "off",
  "react/jsx-uses-react": "off",
  "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error', // or "error"
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'naming-convention': 'off',
    '@typescript-eslint/naming-convention': ['error', {
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      selector: 'variable',
      leadingUnderscore: 'allow'
    }],
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'no-console': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
  },
}
