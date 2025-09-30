module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
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
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
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
        'react-native/react-native': true,
      },
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
};
