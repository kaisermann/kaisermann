const env = (dev, prod = dev) => {
  if (process.env.ELEVENTY_ENV === 'development') {
    return dev;
  }

  return prod;
};

module.exports = {
  title: 'Kaisermann | web development',
  description: 'Coding for humans. Come say hi 🌳',
  twitter: 'kiwistian',
  baseUrl: env('https://kaisermann.me'),
  thumb: '/assets/images/big-rainbow-static.gif',
};
