function navigateBack() {
    window.history.replaceState({}, document.title, '/homePage');
    location.reload();
}
async function fetchTopSongs() {
    try {
      const response = await fetch('/top10Songs');
      const data = await response.json();
      const songList = data.songs;

      const container = document.getElementById('song-list-container');

      songList.forEach((song, index) => {
        // Create a div to contain the image and the name
        const div = document.createElement('div');
        div.className = 'song-item';

        // Create the image element
        const img = document.createElement('img');
        img.src = song.imageUrl;
        img.width = 400;
        img.height = 400;
        div.appendChild(img);

        // Create the name element
        const name = document.createElement('p');
        name.textContent = `${song.name} by ${song.artist}`;
        div.appendChild(name);

        container.appendChild(div);

        // Add a line break after every third item
        if ((index + 1) % 3 === 0) {
          container.appendChild(document.createElement('br'));
        }
      });
    } catch (error) {
      console.error('Error fetching top 10 songs:', error);
    }
}

fetchTopSongs();
