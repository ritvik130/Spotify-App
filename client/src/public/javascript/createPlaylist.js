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
  console.log(playlistName);
  if (!playlistName) {
    alert('Please enter a playlist name');
    return;
  }

  try {
    const response = await fetch('/createPlaylist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ playlistName: playlistName })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert(`Playlist "${playlistName}" created with ID: ${data.playlistId}`);
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
    const response = await fetch('/addSong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ playlistName, songName })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
  