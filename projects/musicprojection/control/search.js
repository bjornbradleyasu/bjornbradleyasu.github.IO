import { addToLibrary } from './library.js';

export async function fetchRecommendations(apiKey, query, recommendations, searchBar) {
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.results && data.results.albummatches && data.results.albummatches.album.length > 0) {
            displayRecommendations(data.results.albummatches.album.slice(0, 8), recommendations, searchBar);
        } else {
            recommendations.innerHTML = '<li>No recommendations found.</li>';
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        recommendations.innerHTML = '<li>Error fetching recommendations. Please try again later.</li>';
    }
}

export async function displaySearchResults(apiKey, query, searchResults, libraryGrid) {
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.results && data.results.albummatches && data.results.albummatches.album.length > 0) {
            displayResults(data.results.albummatches.album.slice(0, 10), searchResults, libraryGrid);
        } else {
            searchResults.innerHTML = '<p>No albums found.</p>';
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResults.innerHTML = '<p>Error fetching search results. Please try again later.</p>';
    }
}

function displayRecommendations(albums, recommendations, searchBar) {
    recommendations.innerHTML = ''; // Clear previous recommendations

    albums.forEach((album) => {
        const listItem = document.createElement('li');
        listItem.className = 'recommendation-item';
        listItem.textContent = `${album.name} by ${album.artist}`;
        listItem.addEventListener('click', () => {
            searchBar.value = album.name; // Fill the search bar with the selected recommendation
            recommendations.innerHTML = ''; // Clear the dropdown
        });
        recommendations.appendChild(listItem);
    });
}

function displayResults(albums, searchResults, libraryGrid) {
    searchResults.innerHTML = ''; // Clear previous results

    const resultsList = document.createElement('ul');
    resultsList.className = 'results-list';

    albums.forEach((album) => {
        const listItem = document.createElement('li');
        listItem.className = 'results-item';

        const albumImage =
            album.image && album.image[2] && album.image[2]['#text']
                ? album.image[2]['#text']
                : 'https://via.placeholder.com/50';

        listItem.innerHTML = `
            <img src="${albumImage}" alt="${album.name} cover" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
            <strong>${album.name}</strong>
            <span>${album.artist}</span>
            <button class="add-button">Add</button>
        `;

        const addButton = listItem.querySelector('.add-button');
        addButton.addEventListener('click', () => {
            addToLibrary(album, libraryGrid);
        });

        resultsList.appendChild(listItem);
    });

    searchResults.appendChild(resultsList);
}