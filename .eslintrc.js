module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    camelcase: 0,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'max-len': 0,
  },
};
