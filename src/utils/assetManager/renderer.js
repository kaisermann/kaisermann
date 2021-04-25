class AssetRenderer {
  data() {
    return {
      permalink: ({ asset }) => {
        return asset.publicUrl;
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

exports.AssetRenderer = AssetRenderer;
