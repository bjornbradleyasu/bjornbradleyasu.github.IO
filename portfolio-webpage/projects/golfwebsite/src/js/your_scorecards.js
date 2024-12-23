// Save scorecard logic
document.getElementById('saveScorecardButton').addEventListener('click', () => {
    // Collect data from the Game Page
    const course = document.getElementById('searchBar').value.trim();
    const gameMode = document.getElementById('gameMode').value;
    const gameType = document.getElementById('gameType').checked ? 'Stroke' : 'Match';
    const date = new Date().toISOString().split('T')[0];

    if (!course) {
        alert('Please enter a course name!');
        return;
    }

    const scores = [];
    document.querySelectorAll('#gameTable tbody tr, #backNineTable tbody tr').forEach(row => {
        const playerName = row.querySelector('input').value.trim() || 'Player';
        const holes = [...row.querySelectorAll('td[data-value]')].map(cell =>
            parseInt(cell.dataset.value || '0', 10)
        );
        const total = holes.reduce((acc, score) => acc + score, 0);
        scores.push({ playerName, holes, total });
    });

    if (scores.length === 0) {
        alert('No player scores to save!');
        return;
    }

    // Create the scorecard object
    const scorecard = { date, course, gameMode, gameType, scores };

    // Save to localStorage
    const scorecards = JSON.parse(localStorage.getItem('scorecards')) || [];
    scorecards.push(scorecard);
    localStorage.setItem('scorecards', JSON.stringify(scorecards));

    alert('Scorecard saved successfully!');

    // Render updated scorecards
    renderScorecards();
});

// Render saved scorecards
const renderScorecards = () => {
    const scorecardsTable = document.querySelector('#scorecardsTable tbody');
    const scorecards = JSON.parse(localStorage.getItem('scorecards')) || [];

    // Clear the table first
    scorecardsTable.innerHTML = '';

    // Populate the table with scorecards
    scorecards.forEach((scorecard, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${scorecard.date}</td>
            <td>${scorecard.course}</td>
            <td>${scorecard.gameMode} - ${scorecard.gameType}</td>
            <td>${scorecard.scores.map(s => `${s.playerName}: ${s.total}`).join('<br>')}</td>
            <td><button data-index="${index}" class="delete-scorecard">Delete</button></td>
        `;
        scorecardsTable.appendChild(row);
    });

    // Add delete functionality
    document.querySelectorAll('.delete-scorecard').forEach(button => {
        button.addEventListener('click', event => {
            const index = event.target.dataset.index;
            const scorecards = JSON.parse(localStorage.getItem('scorecards')) || [];
            scorecards.splice(index, 1); // Remove the selected scorecard
            localStorage.setItem('scorecards', JSON.stringify(scorecards));
            renderScorecards(); // Re-render the table
        });
    });
};

// Render scorecards when the page loads
document.addEventListener('DOMContentLoaded', renderScorecards);