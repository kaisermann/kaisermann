module.exports = {
	self: true,
	...require('./data/app.json'),
	projects: require('./data/projects.json'),
	url: process.env.SITE_URL,
	asset(assetPath) {
		if (process.env.SITE_URL) {
			return `//${process.env.SITE_URL}/${assetPath}?c=${
				Math.random() * 10000
			}`;
		}

		return `${process.env.SITE_URL || '.'}/${assetPath}`;
	},
};
