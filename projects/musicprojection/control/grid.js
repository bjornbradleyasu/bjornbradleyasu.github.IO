document.addEventListener('DOMContentLoaded', () => {
    const sendDataButton = document.getElementById('send-data-button');
    sendDataButton.addEventListener('click', saveGridState);
});

let draggedAlbum = null; // Global variable to track the dragged album

export function handleDragStart(event) {
    if (event.target.tagName === 'IMG') {
        draggedAlbum = event.target; // Reference the dragged album
        console.log('Drag started for album:', draggedAlbum.src); // Debug log
    } else {
        console.warn('DragStart event fired on non-IMG element.');
    }
}

export function handleDrop(event) {
    event.preventDefault(); // Prevent default behavior for drop
    const dropzone = event.currentTarget; // Identify the drop zone

    if (!draggedAlbum) {
        console.error('No album is being dragged!');
        return;
    }

    // Remove any existing album from the drop zone
    const existingAlbum = dropzone.querySelector('img');
    if (existingAlbum) {
        dropzone.removeChild(existingAlbum);
    }

    // Remove the dragged album from its original parent
    if (draggedAlbum.parentNode) {
        draggedAlbum.parentNode.removeChild(draggedAlbum);
    }

    // Append the dragged album to the new drop zone
    draggedAlbum.style.width = '100%';
    draggedAlbum.style.height = '100%';
    draggedAlbum.style.objectFit = 'cover';
    dropzone.appendChild(draggedAlbum);

    // Re-attach dragstart to ensure the album remains draggable
    draggedAlbum.addEventListener('dragstart', handleDragStart);

    console.log('Album dropped into drop zone:', dropzone); // Debug log

    // Reset draggedAlbum and save state
    draggedAlbum = null;
    saveGridState();
}

export function saveGridState() {
    const gridState = [...document.querySelectorAll('.dropzone')].map((zone, index) => {
        const img = zone.querySelector('img');
        return img
            ? {
                  location: `grid-item-${index + 1}`, // Unique location ID
                  album: img.src, // Use the image source URL
              }
            : null; // No album in this dropzone
    }).filter(item => item !== null); // Remove null values

    sendGridUpdate(gridState); // Send updated grid state to the server
    console.log('Grid state saved and sent:', gridState);
}

export async function sendGridUpdate(gridState) {
    try {
        const response = await fetch('http://3.85.166.171:8080/api/grid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grid: gridState }),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error sending grid update:', error);
    }
}

export function clearGrid(libraryGrid, dropZones) {
    dropZones.forEach((zone) => {
        const img = zone.querySelector('img');
        if (img) {
            // Remove the image from the grid
            zone.removeChild(img);

            // Create a new library item
            const libraryItem = document.createElement('div');
            libraryItem.className = 'library-item';
            libraryItem.draggable = true;

            const clonedImg = img.cloneNode(true);
            clonedImg.style.width = '50px';
            clonedImg.style.height = '50px';
            clonedImg.style.objectFit = 'cover';
            clonedImg.style.borderRadius = '4px';

            libraryItem.appendChild(clonedImg);
            libraryItem.addEventListener('dragstart', handleDragStart); // Attach dragstart

            // Append the new library item to the bottom of the library
            libraryGrid.appendChild(libraryItem);
        }
    });

    saveState();
    console.log('Grid cleared. State saved.');
}

export function saveState() {
    const gridState = [...document.querySelectorAll('.dropzone')].map((zone) => {
        const img = zone.querySelector('img');
        return img ? img.src : null; // Save the image source or null if empty
    });

    const libraryState = [...document.querySelectorAll('.library-item')].map((item) => {
        const img = item.querySelector('img');
        return img ? img.src : null; // Save the image source for each library item
    });

    localStorage.setItem('gridState', JSON.stringify(gridState));
    localStorage.setItem('libraryState', JSON.stringify(libraryState));
    console.log('State saved:', { gridState, libraryState }); // Debugging log
}