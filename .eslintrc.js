module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    eqeqeq: 'warn',
    'no-unused-vars': 'off',
    'space-before-function-paren': 'off',
    'no-empty-function': 'off',
    camelcase: 'off',
    'no-empty': 'off',
    'no-new': 'off',
    'no-useless-constructor': 'off',
    'no-extra-semi': 'off',
    'no-debugger': 'off',
    // 注释后后面保持有一个空格
    'spaced-comment': ['error', 'always', { block: { balanced: true } }],

    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    'vue/multi-word-component-names': 'off'
  }
};
