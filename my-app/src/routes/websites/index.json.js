const projects = [
  {
    url: 'https://github.com/kaisermann/kaisermann',
    name: 'kaisermann.me',
    description: 'this website',
  },
  {
    url: 'https://copymoji.kaisermann.me',
    name: 'copymoji',
    description: 'front-end',
  },
  {
    url: 'http://playground.kaisermann.me',
    name: 'my work desk',
    description: 'design/front-end/back-end',
  },
  {
    url: 'http://10de10.com.br',
    name: '10de10',
    description: 'design/front-end/back-end',
  },
  {
    url: 'https://solardancer.kaisermann.me',
    name: 'solar.dance',
    description: 'front-end',
  },
  {
    url: 'http://grupoaguasdobrasil.com.br',
    name: 'grupo águas do brasil',
    description: 'front-end/back-end',
  },
  {
    url: 'http://tuut.com.br',
    name: 'tuut',
    description: 'front-end/back-end',
  },
  {
    url: 'http://marcelod2.com.br',
    name: 'marcelod2',
    description: 'front-end/back-end',
  },
];

export function get(_req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  res.end(JSON.stringify(projects));
}
