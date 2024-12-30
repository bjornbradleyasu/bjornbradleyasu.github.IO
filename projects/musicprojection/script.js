document.addEventListener('DOMContentLoaded', () => {
    console.log('Starting application...');
    initAudioVisualizer();
    captureAndIdentifySong();
    console.log('Initializing display...');
    fetchGridState();
});

// Initialize the sound wave visualizer
async function initAudioVisualizer() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);

        // Create an analyser node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // Determines the resolution of the waveform
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        // Set up canvas
        const canvas = document.getElementById('visualizer');
        const canvasCtx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = 200;

        // Resize canvas when window size changes
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = 200;
        });

        // Function to draw the waveform
        function draw() {
            requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'black'; // Background color
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            canvasCtx.lineWidth = 2; // Line thickness
            canvasCtx.strokeStyle = 'lime'; // Waveform color
            canvasCtx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0; // Normalize data
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }

        draw(); // Start visualization
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Microphone access denied or unavailable.');
    }
}

// Capture audio and identify the song using AudD API
async function captureAndIdentifySong() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            console.log('Audio captured:', audioBlob);

            const base64Audio = await blobToBase64(audioBlob);
            await identifySong(base64Audio);
        };

        console.log('Recording audio for identification...');
        mediaRecorder.start();
        setTimeout(() => {
            mediaRecorder.stop(); // Stop recording after 10 seconds
        }, 10000);
    } catch (error) {
        console.error('Error accessing microphone for song identification:', error);
    }
}

// Convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Identify the song using AudD API
async function identifySong(base64Audio) {
    const AUDD_ENDPOINT = 'http://localhost:3001/audd'; // Use the proxy URL

    try {
        console.log('Sending audio to AudD API for identification...');
        const response = await fetch(AUDD_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_token: '28779f209fc12d56610a40258178c916', // Replace with your actual API key
                audio: base64Audio,
                return: 'apple_music,spotify',
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const songData = await response.json();
        console.log('AudD API Response:', songData);

        if (songData.status === 'success') {
            const result = songData.result;

            document.getElementById('song-title').innerText = result.title || "Unknown Title";
            document.getElementById('song-artist').innerText = result.artist || "Unknown Artist";
        } else {
            document.getElementById('song-title').innerText = "Song not identified.";
            document.getElementById('song-artist').innerText = "";
        }
    } catch (error) {
        console.error('Error identifying song:', error);
        document.getElementById('song-title').innerText = "Error identifying song.";
        document.getElementById('song-artist').innerText = "";
    }
}

import { initDisplay } from '../shared/serverCommunication.js';

document.addEventListener('DOMContentLoaded', () => {
    initDisplay(updateGrid); // Initialize WebSocket connection
});

function updateGrid(gridState) {
    gridState.forEach((cell) => {
        const gridCell = document.getElementById(cell.location);
        if (gridCell) {
            gridCell.innerHTML = ''; // Clear the cell

            if (cell.album) {
                const img = document.createElement('img');
                img.src = cell.album; // Album image
                img.alt = `Album by ${cell.artist || 'Unknown Artist'}`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';

                gridCell.appendChild(img); // Add the image to the cell
            }
        }
    });
}

export function updateGridDisplay(gridState) {
    const grid = document.getElementById('vinyl-grid');
    grid.innerHTML = ''; // Clear the grid

    gridState.forEach((cell) => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-cell');
        gridItem.dataset.location = cell.location;

        const albumInfo = document.createElement('div');
        albumInfo.textContent = `${cell.album} - ${cell.artist}`;
        gridItem.appendChild(albumInfo);

        grid.appendChild(gridItem);
    });
}

async function fetchGridState() {
    try {
        const response = await fetch('http://3.84.82.215:8080/receive'); // Replace with your EC2 IP
        const data = await response.json();

        updateGrid(data.data); // Update grid with the fetched state
    } catch (error) {
        console.error('Error fetching grid state:', error);
    }
}