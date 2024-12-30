document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing display...');
    fetchGridState(); // Initial fetch to populate the grid
    setInterval(fetchGridState, 2000); // Fetch updates every 2 seconds
});

function updateGrid(gridState) {
    gridState.forEach((cell) => {
        const gridCell = document.getElementById(cell.location);
        if (gridCell) {
            gridCell.innerHTML = ''; // Clear the cell's content

            // Check if album (image URL) exists
            if (cell.album) {
                const albumImg = document.createElement('img');
                albumImg.src = cell.album; // Use the album URL as the image source
                albumImg.alt = 'Album cover'; // Alt text for accessibility
                albumImg.style.width = '100%';
                albumImg.style.height = '100%';
                albumImg.style.objectFit = 'cover';

                gridCell.appendChild(albumImg); // Append the album image to the cell
            } else {
                console.warn(`Missing album data for cell: ${cell.location}`);
            }
        } else {
            console.warn(`Grid cell not found for location: ${cell.location}`);
        }
    });
}

// Function to fetch the grid state from the server
async function fetchGridState() {
    try {
        const response = await fetch('http://3.85.166.171:8080/api/grid'); // Use REST API endpoint
        const data = await response.json();
        updateGrid(data.grid); // Update the grid with the fetched state
    } catch (error) {
        console.error('Error fetching grid state:', error);
    }
}