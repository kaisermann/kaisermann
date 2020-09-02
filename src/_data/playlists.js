const axios = require('axios');

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
  ).data.items;
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

    throw err;
  }
};
