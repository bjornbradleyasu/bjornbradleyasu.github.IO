const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

let gridState = [];

// Endpoint to fetch grid state
app.get('/api/grid', (req, res) => {
    res.json({ grid: gridState });
});

// Endpoint to update grid state
app.post('/api/grid', (req, res) => {
    const { grid } = req.body;
    if (!grid) {
        return res.status(400).json({ error: 'Invalid grid data.' });
    }
    gridState = grid;
    console.log('Grid state updated:', gridState);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://3.85.166.171:${PORT}`);
});