const path = require('path');
const crypto = require('crypto');

const { getAssets } = require('./state');

const getStringHash = (str) => {
  const hash = crypto.createHash('md5');

  hash.update(str);

  return hash.digest('hex').slice(0, 10);
};

exports.getAsset = ({ fileName, content }) => {
  const hash = getStringHash(content);
  const ext = path.extname(fileName).slice(1);
  const name = path.basename(fileName, path.extname(fileName));
  const publicDir = `/${path.relative('src/', path.dirname(fileName))}`;
  const publicFileName = [
    name,
    process.env.ELEVENTY_ENV === 'production' && hash,
    ext,
  ]
  .filter(Boolean)
  .join('.');

  // Normalize path structure to POSIX
  const localFileName = `/${path.relative('src/', fileName)}`.replace(/\\/g,'/');
  const publicUrl = path.join(publicDir, publicFileName).replace(/\\/g,'/');

  return {
    content,
    publicUrl,
    localFileName,
  };
};

exports.getAssetPublicUrl = function getAssetPublicUrl({ assetPath, callee }) {
  // if passed path is not absolute, consider it relative to the page url
  const localPath = path.isAbsolute(assetPath)
    ? assetPath
    // Normalize path structure to POSIX
    : path.join('/', path.relative('src', path.dirname(callee)), assetPath).replace(/\\/g,'/');

  const foundAsset = getAssets().find((asset) => {
    return asset.localFileName === localPath;
  });

  if (foundAsset == null) {
    return null;
  }

  return foundAsset.publicUrl;
};
