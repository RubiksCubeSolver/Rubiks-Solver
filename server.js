const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve node_modules files that we need
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Rubik's Cube Solver app listening at http://localhost:${port}`);
}); 