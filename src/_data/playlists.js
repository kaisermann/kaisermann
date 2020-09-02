const axios = require('axios');

const FALLBACK_PLAYLISTS = [
  {
    name: 'フロー flow',
    url:
      'https://open.spotify.com/playlist/1oKT4BwzBziaqIs80UPbJq?si=12VNRvN7QbKEPsIY804g8A',
    description: "for when you know you're going to code for a while",
  },
  {
    name: 'ローファイ  l o - f i ',
    url:
      'https://open.spotify.com/playlist/6ou1L5R6RrPk9XhWnls1Lt?si=Ll16QnE3TRqL3ROq-Wj0Cg',
    description: 'for any moment that you need to focus while head bobbing',
  },
  {
    name: '寛ぐ feels like a game song',
    url:
      'https://open.spotify.com/playlist/6aDjVGh6yqfGSevd8NBjMS?si=sV_n7oljSXqtEEYNkfpI8Q',
    description: 'for chilled nostalgic gaming moments',
  },
];

const AUTH_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = 'caaba35a777245c6851df2ad0f60a39a';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const USER_ID = '12142121799';

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
  ).data;
}

module.exports = async function fetchPlaylists() {
  try {
    const { access_token: token } = await getAccessToken();

    const playlists = await getPlaylists(token);

    return playlists
      .filter(
        (p) => p.description.startsWith('@') && p.description.endsWith('@'),
      )
      .map((p) => {
        return {
          name: p.name,
          url: p.external_urls.spotify,
          description: p.description.slice(1, p.description.length - 1).trim(),
        };
      });
  } catch (err) {
    console.log('Something went wrong when retrieving an access token', err);

    return FALLBACK_PLAYLISTS;
  }
};
