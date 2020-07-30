const preprocess = require('svelte-preprocess');

module.exports = {
  preprocess: preprocess({
    defaults: {
      css: 'postcss',
    },
    postcss: true,
  }),
};
