const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResultsDiv = document.getElementById('search-results');


function navigateBack() {
  window.history.replaceState({}, document.title, '/homePage');
  location.reload();
}

searchButton.addEventListener('click', async () => {
  const query = searchInput.value.trim();

  if (!query) {
    alert('Please enter a search query');
    return;
  }
  try {
    const response = await fetch(`/search?q=${query}`);
    const data = await response.json();
    if (!data.name || !data.artist) {
      throw new Error('No songs found');
    }
    const image = document.createElement('img');
    image.src = data.imageUrl;
    const title = document.createElement('p');
    title.textContent = `Song: ${data.name} | Artist: ${data.artist}`;
    searchResultsDiv.innerHTML = '';
    searchResultsDiv.appendChild(image);
    searchResultsDiv.appendChild(title);
  } catch (error) {
    console.error('Error searching for song:', error);
    searchResultsDiv.innerHTML = `<p>${error.message}</p>`;
  }
});