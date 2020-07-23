const timestamp = new Date();

module.exports = {
  env: process.env,
  timestamp,
  id: timestamp.valueOf(),
};
