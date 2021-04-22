const path = require('path');

class Scripts {
  data() {
    return {
      eleventyComputed: {
        assetKey: ({ script }) => {
          return script.filename;
        },
      },
      permalink: ({ script }) => {
        const filepath = [
          '/js/',
          path.dirname(script.filename),
          '/',
          script.basename,
          process.env.NODE_ENV === 'production' && `.${script.hash}`,
          '.js',
        ]
          .filter(Boolean)
          .join('');

        return filepath;
      },
      pagination: {
        addAllPagesToCollections: true,
        alias: 'script',
        data: 'scripts',
        size: 1,
      },
      layout: '',
      tags: ['_scripts'],
    };
  }

  render(e) {
    return e.script.content;
  }
}

module.exports = Scripts;
