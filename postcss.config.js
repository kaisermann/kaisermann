module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
      },
    },
    ...(process.env.ELEVENTY_ENV === 'production' && { cssnano: {} }),
  },
};
