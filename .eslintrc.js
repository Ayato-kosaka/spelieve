module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: './',
    project: ['./tsconfig.json']
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'unused-imports'
  ],
  "ignorePatterns": ["build"], 
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'react/style-prop-object': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    "@typescript-eslint/no-floating-promises": "warn",
  },
};
