const express = require('express');
const router = express.Router();
const path = require('path');
const spotify = require("../spotify/spotify")


let clientId, clientSecret;

const homePagePath = path.join('../../client/src/pages/homePage.html');
const loginPagePath = path.join('../../client/src/pages/loginPage.html');
const topSongsPagePath = path.join('../../client/src/pages/topSongsPage.html');
const topArtistPagePath = path.join('../../client/src/pages/topArtistPage.html');
const myPlaylistsPagePath = path.join('../../client/src/pages/myPlaylistsPage.html');
const createPlaylistPagePath = path.join('../../../client/src/pages/createPlaylistPage.html');
const searchPagePath = path.join('../../../client/src/pages/searchPage.html');
const recommendationPagePath = path.join('../../../client/src/pages/recommendationPage.html');
const suggestionsPagePath = path.join('../../../client/src/pages/suggestionsPage.html');
// Route for the login page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, loginPagePath));
});

router.post("/login", (req, res) => {
    clientId = req.body.clientId;
    clientSecret = req.body.clientSecret;
    const redirectLink = 'http://localhost:5000/callback';
    const AUTHORIZE = 'https://accounts.spotify.com/authorize';
  
    let url = AUTHORIZE;
    url += '?client_id=' + clientId;
    url += '&response_type=code';
    url += "&redirect_uri=" + encodeURIComponent(redirectLink);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-top-read user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    console.log('Req body:', req.body);
    res.redirect(url);
});
  
router.get("/callback", async (req, res) => {
    const { code } = req.query;
    const redirectUri = 'http://localhost:5000/callback';
    console.log('/callback: ', clientId );
  
    try {
      const accessToken = await spotify.getAccessToken(clientId, clientSecret, code, redirectUri);
      global.spotify_access_token = accessToken;
  
      res.redirect('/homePage');
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
});
//Route fot the home page
router.get('/homePage', (req, res) => {
  res.append('Set-Cookie', 'access_token=' + global.spotify_access_token);
  res.sendFile(path.join(__dirname, homePagePath));
});
// Route for the top songs page
router.get('/topSongsPage', (req, res) => {
  res.sendFile(path.join(__dirname, topSongsPagePath));
});


// Route for the top artist page
router.get('/topArtistPage', (req, res) => {
  res.sendFile(path.join(__dirname, topArtistPagePath));
});

// Route for the my playlists page
router.get('/myPlaylistsPage', (req, res) => {
  res.sendFile(path.join(__dirname, myPlaylistsPagePath));
});

// Route for the create playlist page
router.get('/createPlaylistPage', (req, res) => {
  res.sendFile(path.join(__dirname + createPlaylistPagePath));
});

// Route for the search page
router.get('/searchPage', (req, res) => {
  res.sendFile(path.join(__dirname + searchPagePath));
});

// Route for the recommendation page
router.get('/recommendationPage', (req, res) => {
  res.sendFile(path.join(__dirname + recommendationPagePath));
});

// Route for the suggestions page
router.get('/suggestionsPage', (req, res) => {
  res.sendFile(path.join(__dirname + suggestionsPagePath));
});

router.get('/displayName', async (req, res) => {
  try {
    const access_token = req.cookies.access_token;
    const profile = await spotify.fetchProfile(access_token);
    console.log(profile);

    const displayName = profile.display_name;
    const imageUrl = profile.images.length > 0 ? profile.images[0].url : null;

    res.json({
      displayName: displayName,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/top10Songs', async (req, res) => {
  try{
    const access_token = req.cookies.access_token;
    const songs = await spotify.getTop10Songs(access_token);
    const songData = songs.map((item) => { 
      return {
        name: item.name,
        artist: item.artists[0].name,
        imageUrl: item.album.images[0]?.url
      };
    });
    res.json({
      songs: songData
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/top10Artists', async (req, res) => {
    try {
        const access_token = req.cookies.access_token;
        const artists = await spotify.getTop10Artist(access_token);
        const artistData = artists.map((item) => {
            return {
                name: item.name,
                imageUrl: item.images[0]?.url
            };
        });
        res.json({
            artists: artistData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/search', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const query = req.query.q;
    const song = await spotify.searchSong(accessToken, query);
    res.json(song);
  } catch (error) {
    console.error('Error searching for song:', error);
    res.status(500).json({ error: 'An error occurred while searching for the song' });
  }
});

router.post('/createPlaylist', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const { playlistName } = req.body;

    const playlist = await spotify.createPlaylist(accessToken, playlistName);

    res.json({ playlistId: playlist.body.id });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/addSong', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const { playlistName, songName } = req.body;

    await addSong(accessToken, playlistName, songName);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/myPlaylists', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const playlists = await spotify.getUserPlaylists(accessToken);
    res.status(200).send(playlists);
  } catch (error) {
    console.error('Error getting user playlists:', error);
    res.status(error.statusCode || 500).send(error.message);
  }
});
module.exports = router;
