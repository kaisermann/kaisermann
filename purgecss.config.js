module.exports = {
  content: ['public/*.html', 'public/**/*.html'],
  css: ['public/assets/styles/main.css'],
  output: './public/assets/styles/',
  whitelist: ['html', 'body'],
  whitelistPatternsChildren: [/^html/, /^body/, /^token/, /^pre/, /^code/],
};
