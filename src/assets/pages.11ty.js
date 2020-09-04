const REDIRECTS = [
  {
    aliases: ['github', 'repositories'],
    url: 'https://github.com/kaisermann',
    external: 1,
  },
  {
    aliases: ['twitter', 'kiwi'],
    url: 'https://twitter.com/kiwistian',
    external: 1,
  },
  {
    aliases: ['instagram', 'photos'],
    url: 'https://instagram.com/kiwistian',
    external: 1,
  },
];

module.exports = class {
  data() {
    return {
      permalink: 'assets/pages.json',
    };
  }

  render({ collections }) {
    const localPages = collections.all
      .filter((i) => i.data.page.outputPath.endsWith('html'))
      .map((i) => {
        const {
          textNav: { external = false, aliases: dataAliases = [] } = {},
        } = i.data;

        const { fileSlug } = i.data.page;
        const aliases = [];

        if (fileSlug.length > 0) {
          aliases.push(fileSlug);
        }

        if (Array.isArray(dataAliases)) {
          aliases.push(...dataAliases);
        } else if (typeof dataAliases === 'string') {
          aliases.push(dataAliases);
        }

        const page = {
          aliases: Array.from(new Set(aliases)),
          url: i.data.page.url,
        };

        if (external) {
          page.external = 1;
        }

        return page;
      });

    return JSON.stringify(localPages.concat(REDIRECTS));
  }
};
