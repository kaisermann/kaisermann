const env = (dev, prod = dev) => {
  if (process.env.ELEVENTY_ENV === 'development') {
    return dev;
  }

  return prod;
};

module.exports = {
  title: 'kaisermann | web engineer',
  description: 'Coding for humans. Come say hi 🌳',
  twitter: 'kiwistian',
  baseUrl: env('localhost:8080', 'https://kaisermann.me'),
  thumb: '/assets/images/big-rainbow-static.jpg',
};
