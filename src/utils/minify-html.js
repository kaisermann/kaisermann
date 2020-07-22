const htmlmin = require('html-minifier');

module.exports = (content, outputPath) => {
  if (outputPath.endsWith('.html')) {
    const minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });

    return minified;
  }

  return content;
};
