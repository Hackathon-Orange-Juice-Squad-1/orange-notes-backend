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
    "linebreak-style": 0,
    "comma-dangle": 0,
    "quotes": 0,
    "quote-props": 0,
    "import/newline-after-import": 0,
    "no-console": 0,
    "class-methods-use-this": 0,
    ""
  },
};
