import { saveState } from './grid.js';
import { handleDragStart } from './grid.js'; // Ensure dragstart is imported

export function addToLibrary(album, libraryGrid) {
    const albumImage =
        album.image && album.image[2] && album.image[2]['#text']
            ? album.image[2]['#text']
            : 'https://via.placeholder.com/50';

    const libraryItem = document.createElement('div');
    libraryItem.className = 'library-item';
    libraryItem.draggable = true;

    libraryItem.innerHTML = `
        <img src="${albumImage}" data-artist="${album.artist || 'Unknown Artist'}" alt="${album.name} cover" 
             style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
    `;

    libraryItem.addEventListener('dragstart', handleDragStart);

    libraryGrid.appendChild(libraryItem);
    saveState();
}