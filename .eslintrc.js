module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true // Defines things like process.env when generating through node
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    // 'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser', // Uses @babel/eslint-parser transforms.
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true
    },
    babelOptions: {
      'presets': ['@babel/preset-react']
    },
    ecmaVersion: 12, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  plugins: ['import', 'unused-imports'],
  root: true, // For configuration cascading.
  rules: {
    // "prettier/prettier": "warn",
    indent: ['warn', 2],
    quotes: ['warn', 'single'],
    'react/prop-types': 'off',
    'no-console': 'warn',
    'no-duplicate-imports': 'error',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
    ],
    'max-len': ['warn', { code: 200 }],
    'import/order': ['warn', {
      alphabetize: {
        caseInsensitive: true,
        order: 'asc'
      },
      groups: [
        'builtin',
        'external',
        'index',
        'sibling',
        'parent',
        'internal'
      ]
    }
    ],
    'no-restricted-imports': ['error', {
      paths: [
        {
          message: 'Please use import foo from \'lodash-es/foo\' instead.',
          name: 'lodash'
        },
        {
          message: 'Avoid using chain since it is non tree-shakable. Try out flow instead.',
          name: 'lodash-es/chain'
        },
        {
          importNames: ['chain'],
          message: 'Avoid using chain since it is non tree-shakable. Try out flow instead.',
          name: 'lodash-es'
        },
        {
          message: 'Please use import foo from \'lodash-es/foo\' instead.',
          name: 'lodash-es'
        }
      ],
      patterns: [
        'lodash/**',
        'lodash/fp/**'
      ]
    }
    ],
    'react/jsx-indent': ['warn', 2, {
      checkAttributes: true,
      indentLogicalExpressions: true
    }
    ],
    'react/jsx-indent-props': ['error', 2],
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/no-static-element-interactions':'off',
    'jsx-a11y/click-events-have-key-events': 'warn',
  },
  settings: {
    react: {
      version: 'detect' // Detect react version
    }
  }
};