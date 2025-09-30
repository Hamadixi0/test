module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
  },
  overrides: [
    {
      // Backend (Node.js + TypeScript)
      files: ['backend/**/*.ts', 'backend/**/*.js'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      env: {
        node: true,
        es2021: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/ban-types': 'warn',
      },
    },
    {
      // Mobile (Expo/React Native + TypeScript)
      files: ['mobile/**/*.ts', 'mobile/**/*.tsx', 'mobile/**/*.js', 'mobile/**/*.jsx'],
      extends: [
        'expo',
        'eslint:recommended',
      ],
      env: {
        browser: true,
        es2021: true,
      },
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
      },
    },
  ],
};
