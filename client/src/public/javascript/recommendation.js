const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResultsDiv = document.getElementById('search-results');

function navigateBack() {
  window.history.replaceState({}, document.title, '/homePage');
  location.reload();
}

searchButton.addEventListener('click', async () => {
  const songName = searchInput.value.trim();

  if (!songName) {
    alert('Please enter a song name');
    return;
  }

  try {
    const response = await fetch(`/recommendations?q=${songName}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No recommendations found');
    }

    searchResultsDiv.innerHTML = '';

    data.forEach(recommendation => {
      const title = document.createElement('p');
      title.textContent = `${recommendation.name} | Artist: ${recommendation.artists[0].name}`;
      searchResultsDiv.appendChild(title);
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    searchResultsDiv.innerHTML = `<p>${error.message}</p>`;
  }
});
