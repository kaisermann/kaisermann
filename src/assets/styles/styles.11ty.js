/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const postcssEngine = postcss(
  [
    require('postcss-import'),
    require('postcss-preset-env')({
      features: {
        'nesting-rules': true,
      },
    }),
    process.env.ELEVENTY_ENV === 'prod' && require('cssnano'),
  ].filter(Boolean)
);

module.exports = class {
  async data() {
    const rawFilepath = path.join(__dirname, 'main.pcss');

    return {
      rawFilepath,
      permalink: 'assets/styles/main.css',
      rawCss: fs.readFileSync(rawFilepath),
    };
  }

  render({ rawCss, rawFilepath }) {
    return postcssEngine
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};
