const axios = require('axios');

const AUTH_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = 'caaba35a777245c6851df2ad0f60a39a';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const USER_ID = '12142121799';

if (CLIENT_SECRET == null) {
  throw Error('SPOTIFY_CLIENT_SECRET not found');
}

async function getAccessToken() {
  const b64 = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  return (
    await axios({
      method: 'POST',
      url: AUTH_URL,
      data: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${b64}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  ).data;
}

async function getPlaylists(token) {
  return (
    await axios({
      method: 'GET',
      url: `${API_URL}/users/${USER_ID}/playlists`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      params: {
        limit: 50,
      },
    })
  ).data.items;
}

module.exports = async function fetchPlaylists() {
  if (process.env.ELEVENTY_ENV !== 'production') {
    return [
      {
        name: 'フロー flow',
        url: 'https://open.spotify.com/playlist/1oKT4BwzBziaqIs80UPbJq',
        description: 'for when you know you&#x27;re going to code for a while',
        image:
          'https://i.scdn.co/image/ab67706c0000bebba02d8328058f5aa25064d0ce',
      },
      {
        name: 'ローファイ  l o - f i ',
        url: 'https://open.spotify.com/playlist/6ou1L5R6RrPk9XhWnls1Lt',
        description: 'for any moment that you need to focus while head bobbing',
        image:
          'https://i.scdn.co/image/ab67706c0000bebb91471f262ee375f823633ee5',
      },
      {
        name: '寛ぐ gaming nostalgia',
        url: 'https://open.spotify.com/playlist/6aDjVGh6yqfGSevd8NBjMS',
        description: 'for chilled nostalgic gaming moments',
        image:
          'https://i.scdn.co/image/ab67706c0000bebbc79a05be2cd83766bd94ec67',
      },
      {
        name: 'p o s t - l i f e ',
        url: 'https://open.spotify.com/playlist/1DQm54uVNgsBrCuDiie6b2',
        description: 'post rock for contemplating life',
        image:
          'https://i.scdn.co/image/ab67706c0000bebb666bf1679f180a6ed8a26429',
      },
    ];
  }

  const { access_token: token } = await getAccessToken();

  const playlists = await getPlaylists(token);

  const relevantPlaylists = playlists
    .filter((p) => p.description.startsWith('@') && p.description.endsWith('@'))
    .map((p) => {
      return {
        name: p.name,
        url: p.external_urls.spotify,
        description: p.description.slice(1, p.description.length - 1).trim(),
        image: p.images[0].url,
      };
    });

  return relevantPlaylists;
};
