module.exports = {
  printWidth: 120,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  arrowParens: 'always',
  trailingComma: 'all',

  plugins: [require('prettier-plugin-packagejson'), require('prettier-plugin-organize-attributes')],
};
