/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const postcssEngine = postcss(
  [
    require('postcss-import'),
    require('postcss-preset-env')({
      features: {
        'nesting-rules': true,
      },
    }),
    process.env.ELEVENTY_ENV === 'production' && require('cssnano'),
    false &&
      process.env.ELEVENTY_ENV === 'production' &&
      purgecss({
        content: ['./dist/**/*.html'],
        extractors: [
          {
            extractor: class TailwindExtractor {
              static extract(content) {
                console.log(content);

                return content.match(/[A-Za-z0-9-_:/]+/g) || [];
              }
            },
            extensions: ['css', 'html', 'vue'],
          },
        ],
      }),
  ].filter(Boolean),
);

module.exports = class {
  async data() {
    const rawFilepath = path.join(__dirname, 'styles', 'main.pcss');

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
