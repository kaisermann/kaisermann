const { getAssetPublicUrl } = require('./utils');

module.exports = (config) => {
  function assetStylesheet(assetPath) {
    const assetPublicUrl = getAssetPublicUrl({
      assetPath,
      callee: this.page.inputPath,
    });

    if (!assetPublicUrl) return '';

    return `
    <link rel="preload" href="${assetPublicUrl}" as="style" />
    <link rel="stylesheet" href="${assetPublicUrl}" />`;
  }

  function assetScript(assetPath, type = 'module', async = true) {
    const assetPublicUrl = getAssetPublicUrl({
      assetPath,
      callee: this.page.inputPath,
    });

    if (!assetPublicUrl) return '';

    return `<script ${
      async ? 'async' : ''
    } type="${type}" src="${assetPublicUrl}"></script>`;
  }

  function assetFilter(fileName) {
    const url = getAssetPublicUrl({
      assetPath: fileName,
      callee: this.ctx.page.inputPath,
    });

    if (url == null) return '';

    return config.getFilter('url')(url);
  }

  config.addShortcode('assetStylesheet', assetStylesheet);
  config.addShortcode('assetScript', assetScript);
  config.addFilter('assetUrl', assetFilter);
};
