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
  return response.data;
}

async function getTop10Songs(token) {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(token);

  try {
    const data = await spotifyApi.getMyTopTracks({ limit: 10 });
    return data.body.items; 
  } catch (error) {
    console.error("Error getting top 10 songs:", error);
    throw error;
  }
}

async function getTop10Artist(token){
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
    try {
        const data = await spotifyApi.getMyTopArtists({ limit: 10 });
        return data.body.items; 
    } catch (error) {
        console.error("Error getting top 10 songs:", error);
        throw error;
    }
}

async function getUserPlaylists(token) {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
    try {
      const data = await spotifyApi.getUserPlaylists({ limit: 5 });
      return data.body.items;
    } catch (error) {
      console.error("Error getting user's playlists:", error);
      throw error;
    }
}

async function getRecommendations(token, songName) {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
    try {
      const response = await spotifyApi.searchTracks(songName, { limit: 1 });
      const trackId = response.body.tracks.items[0].id;
      const recommendations = await spotifyApi.getRecommendations({
        seed_tracks: [trackId],
      });
      return recommendations.body.tracks;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
}
async function searchSong(token, query) {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
    try {
      const response = await spotifyApi.searchTracks(query, { limit: 1 });
      const track = response.body.tracks.items[0];
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        imageUrl: track.album.images[0].url,
      };
    } catch (error) {
      console.error("Error searching for song:", error);
      throw error;
    }
}
  

module.exports = {getAccessToken, fetchProfile, getTop10Songs, getTop10Artist, getUserPlaylists, getRecommendations, searchSong}