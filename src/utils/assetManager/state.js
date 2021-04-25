let assets = [];

exports.setAssets = (newAssets) => {
  assets = newAssets;

  return newAssets;
};

exports.getAssets = () => {
  return assets;
};
