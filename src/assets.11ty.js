const path = require('path');

function getAssetPath(asset) {
  const fileName = [
    asset.baseName,
    process.env.ELEVENTY_ENV === 'production' && `.${asset.hash}`,
    asset.ext,
  ]
    .filter(Boolean)
    .join('');

  if (asset.root.startsWith('assets')) {
    return path.join(asset.root, fileName);
  }

  return path.join(asset.root, 'assets', fileName);
}

class Asset {
  data() {
    return {
      eleventyComputed: {
        assetKey: ({ asset }) => {
          return asset.filename;
        },
      },
      permalink: ({ asset }) => {
        const assetPath = getAssetPath(asset);
        console.log(`Building asset: ${assetPath}`);

        return assetPath;
      },
      pagination: {
        addAllPagesToCollections: true,
        alias: 'asset',
        data: 'assets',
        size: 1,
      },
      layout: '',
      tags: ['_assets'],
    };
  }

  render({ asset }) {
    return asset.content;
  }
}

module.exports = Asset;
