const timestamp = new Date();

module.exports = {
  env: process.env,
  isProd: process.env.ELEVENTY_ENV === 'production',
  timestamp,
  id: timestamp.valueOf(),
};
