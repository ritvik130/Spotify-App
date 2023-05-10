async function searchSongs(query) {
    try {
      const response = await fetch(`/searchSong?q=${query}`);
      const data = await response.json();
      console.log('searchSongs data:', data);
      return data.song;
    } catch (error) {
      console.error('Error searching for songs:', error);
      throw error;
    }
}
  
function renderSearchResults(songs) {
    console.log('renderSearchResults songs:', songs);
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    
    songs.forEach((song) => {
      const div = document.createElement('div');
      div.className = 'song-item';
    
      const img = document.createElement('img');
      img.src = song.imageUrl;
      img.width = 100;
      img.height = 100;
      div.appendChild(img);
    
      const name = document.createElement('p');
      name.textContent = `${song.name} by ${song.artist}`;
      div.appendChild(name);
    
      container.appendChild(div);
    });
  }
  
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const songs = await searchSongs(query);
    renderSearchResults(songs);
});
  