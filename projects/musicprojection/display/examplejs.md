document.addEventListener('DOMContentLoaded', () => {
    console.log('Testing AudD API with microphone...');
    captureAudio(); // Start capturing audio from the microphone
});

// Function to capture microphone input
async function captureAudio() {
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

        console.log('Recording audio...');
        mediaRecorder.start();
        setTimeout(() => {
            mediaRecorder.stop(); // Stop recording after 10 seconds
        }, 10000);
    } catch (error) {
        console.error('Error accessing microphone:', error);
        document.getElementById('lyrics-content').innerText = 'Microphone access denied.';
    }
}

// Function to convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Function to identify the song using AudD API
async function identifySong(base64Audio) {
    const AUDD_API_KEY = '28779f209fc12d56610a40258178c916';
    const AUDD_ENDPOINT = 'http://localhost:3001/audd';

    try {
        console.log('Sending audio to AudD API...');
        const response = await fetch(AUDD_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_token: AUDD_API_KEY,
                audio: base64Audio,
                return: 'lyrics',
            }),
        });

        const songData = await response.json();
        console.log('AudD API Response:', songData);

        if (songData.status === 'success') {
            const result = songData.result;

            const artist = result.artist || "Unknown Artist";
            const album = result.album || "Unknown Album";

            console.log(`Parsed Song Info:`);
            console.log(`Title: ${result.title}`);
            console.log(`Artist: ${artist}`);
            console.log(`Album: ${album}`);

            document.getElementById('song-title').innerText = result.title || "Unknown Title";
            document.getElementById('song-artist').innerText = artist;

            // Fetch lyrics using title, artist, and album
            fetchLyrics(result.title, artist, album);
        } else {
            document.getElementById('lyrics-content').innerText = 'Song not identified.';
        }
    } catch (error) {
        console.error('Error identifying song:', error);
        document.getElementById('lyrics-content').innerText = 'Error identifying song.';
    }
}

// Function to fetch lyrics using Musixmatch API
async function fetchLyrics(songTitle, artist, album) {
    console.log(`Debug Info:`);
    console.log(`Song Title: ${songTitle}`);
    console.log(`Artist: ${artist}`);
    console.log(`Album: ${album}`);

    const MUSIXMATCH_API_KEY = 'fd59b804-a1f6-4623-99c7-8c75623d44a8';
    const MUSIXMATCH_ENDPOINT = 'http://localhost:3001/musixmatch';

    const queryTitle = encodeURIComponent(songTitle);
    const queryArtist = encodeURIComponent(artist);

    const searchURL = `${MUSIXMATCH_ENDPOINT}/track.search?q_track=${queryTitle}&q_artist=${queryArtist}&apikey=${MUSIXMATCH_API_KEY}`;
    console.log(`Search URL: ${searchURL}`);

    try {
        console.log(`Fetching lyrics for: ${songTitle} by ${artist}...`);
        const searchResponse = await fetch(searchURL);
        const searchData = await searchResponse.json();

        console.log(`Search Response Data:`, searchData);

        const trackList = searchData.message.body.track_list;
        if (trackList.length === 0) {
            console.log('Lyrics not found');
            document.getElementById('lyrics-content').innerText = 'Lyrics not available.';
            return;
        }

        const trackId = trackList[0].track.track_id;
        console.log(`Track ID: ${trackId}`);

        const lyricsResponse = await fetch(
            `${MUSIXMATCH_ENDPOINT}/track.lyrics.get?track_id=${trackId}&apikey=${MUSIXMATCH_API_KEY}`
        );
        const lyricsData = await lyricsResponse.json();

        console.log(`Lyrics Response Data:`, lyricsData);

        const lyrics = lyricsData.message.body.lyrics?.lyrics_body;
        if (lyrics) {
            const copyright = lyricsData.message.body.lyrics.lyrics_copyright;

            document.getElementById('lyrics-content').innerText = lyrics;
            if (copyright) {
                const copyrightElement = document.createElement('p');
                copyrightElement.innerText = `© ${copyright}`;
                document.getElementById('lyrics-content').appendChild(copyrightElement);
            }

            const backlink = lyricsData.message.body.lyrics.backlink_url;
            if (backlink) {
                const poweredBy = document.createElement('a');
                poweredBy.href = backlink;
                poweredBy.target = '_blank';
                poweredBy.innerHTML = '<img src="https://www.musixmatch.com/images/powered-by-musixmatch.svg" alt="Lyrics Powered by Musixmatch">';
                document.getElementById('lyrics-content').appendChild(poweredBy);
            }
        } else {
            console.log('Lyrics not found');
            document.getElementById('lyrics-content').innerText = 'Lyrics not available.';
        }
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        document.getElementById('lyrics-content').innerText = 'Error fetching lyrics.';
    }
}