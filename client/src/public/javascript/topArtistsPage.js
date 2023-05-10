function navigateBack() {
    window.history.replaceState({}, document.title, '/homePage');
    location.reload();
}
async function fetchTopArtists() {
    try {
      const response = await fetch('/top10Artists');
      const data = await response.json();
      const artistList = data.artists;

      const container = document.getElementById('artist-list-container');

      artistList.forEach((artist, index) => {
        // Create a div to contain the image and the name
        const div = document.createElement('div');
        div.className = 'artist-item';

        // Create the image element
        const img = document.createElement('img');
        img.src = artist.imageUrl;
        img.width = 400;
        img.height = 400;
        div.appendChild(img);

        // Create the name element
        const name = document.createElement('p');
        name.textContent = `${artist.name}`;
        div.appendChild(name);

        container.appendChild(div);

        // Add a line break after every third item
        if ((index + 1) % 3 === 0) {
          container.appendChild(document.createElement('br'));
        }
      });
    } catch (error) {
      console.error('Error fetching top 10 artists:', error);
    }
}

fetchTopArtists();