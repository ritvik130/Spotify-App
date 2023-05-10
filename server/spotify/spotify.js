const axios = require("axios");
const SpotifyWebApi = require('spotify-web-api-node');

// Create the Spotify API client
const spotifyApi = new SpotifyWebApi();

// Code for access token obtained from https://developer.spotify.com/documentation/web-api/tutorials/code-flow
async function getAccessToken(clientId, clientSecret, code, redirectUri) {
  let spotifyApiConfig = {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    params: {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    },
  };

  try {
    const response = await axios(spotifyApiConfig);
    console.log(response.data);
    access_token = response.data.access_token;
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.response.data);
    throw error;
  }
}


async function fetchProfile(token) {
  const result = {
    url: 'https://api.spotify.com/v1/me',
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  };

  const response = await axios(result);
  console.log(response.data);
  return response.data;
}

async function getTop10Songs(access_token) {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(access_token);

  try {
    const data = await spotifyApi.getMyTopTracks({ limit: 10 });
    return data.body.items; 
  } catch (error) {
    console.error("Error getting top 10 songs:", error);
    throw error;
  }
}

module.exports = {getAccessToken, fetchProfile, getTop10Songs}