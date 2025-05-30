module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    '**/*.config.ts',
    'src/test/**',
    'src/lib/**',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off', // Turn off for now since stores define functions for later use
    'no-redeclare': 'off',
  },
};
