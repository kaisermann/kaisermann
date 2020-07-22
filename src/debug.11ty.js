module.exports = class Test {
  data() {
    return {
      permalink: '/debug.json',
    };
  }

  render(data) {
    // eslint-disable-next-line global-require
    const stringify = require('util').inspect(data);

    return stringify;
  }
};
