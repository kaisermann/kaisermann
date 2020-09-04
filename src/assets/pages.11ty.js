const REDIRECTS = [
  {
    aliases: ['github', 'repositories'],
    external: true,
    url: 'https://github.com/kaisermann',
  },
  {
    aliases: ['twitter', 'kiwi'],
    external: true,
    url: 'https://twitter.com/kiwistian',
  },
  {
    aliases: ['instagram', 'photos'],
    external: true,
    url: 'https://instagram.com/kiwistian',
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

        return {
          aliases: Array.from(new Set(aliases)),
          url: i.data.page.url,
          external: external ? 1 : 0,
        };
      });

    return JSON.stringify(localPages.concat(REDIRECTS));
  }
};
