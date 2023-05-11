const playlistsList = document.getElementById('playlists-list');
const accessToken = getCookie('access_token');

function navigateBack() {
    window.history.replaceState({}, document.title, '/homePage');
    location.reload();
}

async function getUserPlaylists() {
  try {
    const response = await fetch('/myPlaylists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const playlists = await response.json();

      // add the playlists to the ul element
      playlists.forEach((playlist) => {
        const li = document.createElement('li');
        li.innerText = playlist.name;
        playlistsList.appendChild(li);
      });
    } else {
      throw new Error('Failed to retrieve user playlists');
    }
  } catch (error) {
    console.error('Error retrieving user playlists:', error);
    alert('An error occurred while retrieving your playlists');
  }
}
function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : null;
}
  
getUserPlaylists();
