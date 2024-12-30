// Sidebar open and close logic
document.getElementById('openSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').style.width = '250px';
});

document.getElementById('closeSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').style.width = '0';
});

// Navigation logic
document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Show the selected page
        const targetPageId = link.getAttribute('data-page-id');
        if (targetPageId) {
            document.getElementById(targetPageId).style.display = 'block';
        }

        // Close the sidebar
        document.getElementById('sidebar').style.width = '0';
    });
});

// Table initialization logic
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#gameTable tbody');
    const tableHeader = document.querySelector('#gameTable thead');

    const tableBodyBack = document.querySelector('#backNineTable tbody');
    const tableHeaderBack = document.querySelector('#backNineTable thead');

    if (tableBody && tableHeader && tableBodyBack && tableHeaderBack) {
        const createTable = (header, body, startHole, endHole) => {
            // Create header row
            const headerRow = document.createElement('tr');
            const emptyHeaderCell = document.createElement('th');
            emptyHeaderCell.textContent = '';
            headerRow.appendChild(emptyHeaderCell);

            for (let i = startHole; i <= endHole + 1; i++) {
                const headerCell = document.createElement('th');
                headerCell.textContent = i === endHole + 1 ? 'OUT' : `Hole ${i}`;
                headerRow.appendChild(headerCell);
            }
            header.appendChild(headerRow);

            // Create player rows
            for (let i = 1; i <= 4; i++) {
                const row = document.createElement('tr');
                const playerCell = document.createElement('td');
                const playerInput = document.createElement('input');
                playerInput.type = 'text';
                playerInput.placeholder = `Player ${i}`;
                playerCell.appendChild(playerInput);
                row.appendChild(playerCell);

                for (let j = startHole; j <= endHole + 1; j++) {
                    const holeCell = document.createElement('td');

                    if (j <= endHole) {
                        const container = document.createElement('div');
                        const minusButton = document.createElement('button');
                        minusButton.textContent = '-';
                        const valueDisplay = document.createElement('span');
                        valueDisplay.textContent = '0';
                        holeCell.dataset.value = '0';
                        const plusButton = document.createElement('button');
                        plusButton.textContent = '+';

                        minusButton.addEventListener('click', () => {
                            const currentValue = parseInt(holeCell.dataset.value || '0', 10);
                            const newValue = Math.max(0, currentValue - 1);
                            holeCell.dataset.value = newValue;
                            valueDisplay.textContent = newValue;
                            updateRowTotal(row, startHole, endHole);
                        });

                        plusButton.addEventListener('click', () => {
                            const currentValue = parseInt(holeCell.dataset.value || '0', 10);
                            const newValue = currentValue + 1;
                            holeCell.dataset.value = newValue;
                            valueDisplay.textContent = newValue;
                            updateRowTotal(row, startHole, endHole);
                        });

                        container.appendChild(minusButton);
                        container.appendChild(valueDisplay);
                        container.appendChild(plusButton);
                        holeCell.appendChild(container);
                    } else {
                        holeCell.textContent = '0';
                    }
                    row.appendChild(holeCell);
                }
                body.appendChild(row);
            }
        };

        // Function to update row total
        const updateRowTotal = (row, startHole, endHole) => {
            let total = 0;
            const cells = row.querySelectorAll('td');
            for (let i = startHole; i <= endHole; i++) {
                const holeCell = cells[i - startHole + 1];
                const cellValue = parseInt(holeCell.dataset.value || '0', 10);
                total += cellValue;
            }
            const outCell = cells[endHole - startHole + 2];
            outCell.textContent = total;
        };

        // Create front and back nine tables
        createTable(tableHeader, tableBody, 1, 9);
        createTable(tableHeaderBack, tableBodyBack, 10, 18);
    }
});

// Search bar logic
const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestions');

let golfCourses = [];
fetch('Golf Courses-USA.csv')
    .then(response => response.text())
    .then(csvText => {
        golfCourses = csvText.split('\n').map(row => row.split(',')[2]?.trim()).filter(Boolean);
    });

searchBar.addEventListener('input', () => {
    const query = searchBar.value.trim().toLowerCase();
    suggestionsBox.innerHTML = '';
    if (query) {
        golfCourses
            .filter(course => course.toLowerCase().includes(query))
            .forEach(course => {
                const suggestion = document.createElement('div');
                suggestion.textContent = course;
                suggestion.addEventListener('click', () => {
                    searchBar.value = course;
                    suggestionsBox.innerHTML = '';
                });
                suggestionsBox.appendChild(suggestion);
            });
    }
});

document.getElementById('saveScorecardButton').addEventListener('click', () => {
    const course = document.getElementById('searchBar').value.trim();
    const gameMode = document.getElementById('gameMode').value;
    const gameType = document.getElementById('gameType').checked ? 'Stroke' : 'Match';
    const date = new Date().toISOString().split('T')[0];

    if (!course) {
        alert('Please enter a course name!');
        return;
    }

    const scores = [];
    const frontNineTable = document.querySelector('#gameTable tbody');
    const backNineTable = document.querySelector('#backNineTable tbody');

    // Combine scores from front and back nine for each player
    for (let i = 0; i < frontNineTable.rows.length; i++) {
        const frontRow = frontNineTable.rows[i];
        const backRow = backNineTable.rows[i];

        const playerName = frontRow.querySelector('input').value.trim() || `Player ${i + 1}`;

        // Get front nine "Out" total
        const frontNineOut = parseInt(
            frontRow.querySelector('td:last-child').textContent || '0',
            10
        );

        // Get back nine "Out" total
        const backNineOut = parseInt(
            backRow.querySelector('td:last-child').textContent || '0',
            10
        );

        // Calculate combined total
        const total = frontNineOut + backNineOut;

        // Add player data to scores array
        scores.push({ playerName, total });
    }

    // Create the scorecard object
    const scorecard = { date, course, gameMode, gameType, scores };

    // Save to localStorage
    const scorecards = JSON.parse(localStorage.getItem('scorecards')) || [];
    scorecards.push(scorecard);
    localStorage.setItem('scorecards', JSON.stringify(scorecards));

    alert('Scorecard saved successfully!');
});

document.addEventListener('DOMContentLoaded', () => {
    const youtubePane = document.getElementById('youtubePane');
    const videoList = document.getElementById('videoList');

    const fetchYouTubeVideos = async () => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=golf&type=video&maxResults=10&key=AIzaSyD7c6_Gja8WOiv9bixazu3SMlo6FVJClu4`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();
            displayVideos(data.items);
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            videoList.innerHTML = `<p>Unable to load videos. Please try again later.</p>`;
        }
    };

    const displayVideos = (videos) => {
        videoList.innerHTML = ''; // Clear existing videos

        videos.forEach((video) => {
            const videoElement = document.createElement('div');
            videoElement.classList.add('videoPreview');
            videoElement.innerHTML = `
                <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
                <div class="title">${video.snippet.title}</div>
            `;

            // Open YouTube video in a new tab when clicked
            videoElement.addEventListener('click', () => {
                window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank');
            });

            videoList.appendChild(videoElement);
        });
    };

    fetchYouTubeVideos();
});