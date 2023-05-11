function navigateBack() {
    window.history.replaceState({}, document.title, '/homePage');
    location.reload();
}
  
// get the DOM elements
const playlistNameInput = document.getElementById('playlist-name');
const searchInput = document.getElementById('search-input');
const searchResultsDiv = document.getElementById('search-results');
  
// get the access token from the cookies
const accessToken = getCookie('access_token');
  
async function createNewPlaylist() {
    const playlistName = playlistNameInput.value.trim();
  
    if (!playlistName) {
      alert('Please enter a playlist name');
      return;
    }
  
    try {
      const playlist = await createPlaylistOnSpotify(accessToken, playlistName);
  
      alert(`Playlist "${playlist.name}" created!`);
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('An error occurred while creating the playlist');
    }
}
  
async function addSongToPlaylist() {
    const playlistName = playlistNameInput.value.trim();
    const songName = searchInput.value.trim();
  
    if (!playlistName) {
      alert('Please enter a playlist name');
      return;
    }
  
    if (!songName) {
      alert('Please enter a song name');
      return;
    }
  
    try {
      await addSongToSpotifyPlaylist(accessToken, playlistName, songName);
  
      alert(`Song "${songName}" added to playlist "${playlistName}"`);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert('An error occurred while adding the song to the playlist');
    }
}
  
function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : null;
}
  