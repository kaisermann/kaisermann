const crypto = require('crypto');

exports.getStringHash = (str) => {
  const hash = crypto.createHash('md5');

  hash.update(str);

  return hash.digest('hex').slice(0, 10);
};
