const API_BASE_URL = 'http://3.85.166.171:8080/api';

/**
 * Fetch the grid state from the server (for Display page).
 * @param {Function} updateGrid - Function to update the Display page's grid.
 */
export async function fetchGridState(updateGrid) {
    try {
        const response = await fetch(`${API_BASE_URL}/grid`);
        const data = await response.json();
        updateGrid(data.grid);
    } catch (error) {
        console.error('Error fetching grid state:', error);
    }
}

/**
 * Send a grid update to the server (for Control page).
 * @param {Array} gridState - The current state of the grid.
 */
export async function sendGridUpdate(gridState) {
    try {
        await fetch(`${API_BASE_URL}/grid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grid: gridState }),
        });
        console.log('Grid update sent successfully.');
    } catch (error) {
        console.error('Error sending grid update:', error);
    }
}