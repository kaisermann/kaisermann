module.exports = {
  self: true,
  ...require("./app.json"),
  asset(assetPath) {
    if (process.env.SITE_URL) {
      return `//${process.env.SITE_URL}/${assetPath}?c=${Math.random() *
        10000}`;
    }

    return `${process.env.SITE_URL || "."}/${assetPath}`;
  }
};
