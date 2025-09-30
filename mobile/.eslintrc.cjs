module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  extends: ['expo', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  ignorePatterns: ['dist/', 'build/']
};
