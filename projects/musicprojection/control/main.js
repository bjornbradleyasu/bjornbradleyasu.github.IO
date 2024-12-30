import { fetchRecommendations, displaySearchResults } from './search.js';
import { handleDragStart, handleDrop, clearGrid } from './grid.js';
import { addToLibrary } from './library.js';

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'ede0c224b7899ab5c2fd933fe8ebe3ac'; // Replace with your valid API key
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const recommendations = document.getElementById('recommendations');
    const searchResults = document.getElementById('search-results');
    const libraryGrid = document.getElementById('library-grid'); // Ensure this is correctly referenced
    const dropZones = document.querySelectorAll('.dropzone');
    const clearGridButton = document.getElementById('clear-grid-button');
    const existingItems = libraryGrid.querySelectorAll('.library-item');

    existingItems.forEach((item) => {
        item.addEventListener('dragstart', handleDragStart);
    });


    // Add drag-and-drop functionality for dropzones
    dropZones.forEach((dropzone) => {
        dropzone.addEventListener('dragover', (event) => event.preventDefault());
        dropzone.addEventListener('drop', (event) => handleDrop(event));
    });

    // Add event listener to the clear grid button
    clearGridButton.addEventListener('click', () => {
        clearGrid(libraryGrid, dropZones);
    });

    // Add event listeners for search functionality
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.trim();
        if (query) {
            fetchRecommendations(apiKey, query, recommendations, searchBar);
        } else {
            recommendations.innerHTML = ''; // Clear recommendations if input is empty
        }
    });

    searchButton.addEventListener('click', () => {
        const query = searchBar.value.trim();
        if (query) {
            displaySearchResults(apiKey, query, searchResults, libraryGrid);
        } else {
            alert('Please enter a valid search query.');
        }
    });

    // Add albums to the library when "Add" button is clicked
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-button')) {
            const album = JSON.parse(event.target.dataset.album);
            addToLibrary(album, libraryGrid);
        }
    });

    const existingLibraryItems = libraryGrid.querySelectorAll('.library-item img');
    existingLibraryItems.forEach((item) => {
        item.addEventListener('dragstart', handleDragStart);
    });

    // Attach dragstart to existing items in the drop zones
    dropZones.forEach((zone) => {
        const img = zone.querySelector('img');
        if (img) {
            img.addEventListener('dragstart', handleDragStart);
        }
    });
});
