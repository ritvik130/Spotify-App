const express = require('express');
const router = express.Router();
const path = require('path');
const spotify = require("../spotify/spotify")


// global.spotify_access_token = ""

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

// router.post("/login", (req, res) => {
//   spotify.getAccessToken(req.body.clientId, req.body.clientSecret)
//     .then((access_token) => {
//       global.spotify_access_token = access_token;

//       const redirectLink = 'http://localhost:5000/homePage';
//       const AUTHORIZE = 'https://accounts.spotify.com/authorize';

//       let url = AUTHORIZE;
//       url += '?client_id=' + req.body.clientId;
//       url += '&response_type=code';
//       url += "&redirect_uri=" + encodeURI(redirectLink);
//       url += "&show_dialog=true";
//       url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
//       res.redirect(url);
//     })
// })

router.post("/login", (req, res) => {
  const clientId = req.body.clientId;
  const clientSecret = req.body.clientSecret;
  const redirectLink = 'http://localhost:5000/callback'; // Replace with your Redirect URI
  const AUTHORIZE = 'https://accounts.spotify.com/authorize';
  res.cookie("clientId", clientId);
  res.cookie("clientSecret", clientSecret);
  let url = AUTHORIZE;
  url += '?client_id=' + clientId;
  url += '&response_type=code';
  url += "&redirect_uri=" + encodeURIComponent(redirectLink);
  url += "&show_dialog=true";
  url += "&scope=user-read-private user-read-email user-top-read user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  res.redirect(url);
});


router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const clientId = req.cookies.clientId;
  const clientSecret = req.cookies.clientSecret;
  const redirectUri = 'http://localhost:5000/callback'; 

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
    console.log(songs);

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

module.exports = router;
