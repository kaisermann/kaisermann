const env = (dev, prod = dev) => {
  if (process.env.ELEVENTY_ENV === 'development') {
    return dev;
  }

  return prod;
};

module.exports = {
  title: 'kaisermann | web dev',
  description: 'Coding for humans. Come say hi 🌳',
  twitter: 'kiwistian',
  baseUrl: env('https://kaisermann.me'),
  thumb: '/assets/images/big-rainbow-static.jpg',
};
