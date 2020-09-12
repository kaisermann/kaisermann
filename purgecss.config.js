module.exports = {
  content: ['public/*.html', 'public/**/*.html', 'src/**/*.svelte'],
  css: ['public/assets/styles/styles.css'],
  output: './public/assets/styles/',
  whitelist: ['html', 'body'],
  whiteListPatterns: [/svelte/, /^::/],
  whitelistPatternsChildren: [
    /^html/,
    /^body/,
    /svelte/,
    /^token/,
    /^pre/,
    /^code/,
  ],
  // safelist: {
  //   standard: ['html', 'body', /^::/],
  //   deep: [/^html/, /^body/, /^token/, /^pre/, /^code/],
  //   greedy: [/svelte/],
  // },
};
