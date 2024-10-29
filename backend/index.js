// backend/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose(); // Use SQLite3 library
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// Initialize SQLite database
const db = new sqlite3.Database('./comments.db', (err) => {
    if (err) {
        console.error("Failed to connect to database", err.message);
    } else {
        console.log("Connected to SQLite database");
        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            comment TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

const sessions = {};

// Add a simple route for the root URL
app.get('', (req, res) => {
    res.send('Welcome to the Comments API! Use /api/login and /api/comments endpoints.');
});

// POST /api/login - Generates a session ID for a user
app.post('/api/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const sessionId = `${username}-${Date.now()}`;
    sessions[sessionId] = username;

    res.json({ sessionId });
});

// GET /api/comments - Retrieves all comments
app.get('/api/comments', (req, res) => {
    db.all('SELECT * FROM comments ORDER BY timestamp DESC', (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// POST /api/comments - Adds a new comment and broadcasts it
app.post('/api/comments', (req, res) => {
    const { sessionId, comment } = req.body;
    const username = sessions[sessionId];

    if (!username || !comment) return res.status(400).json({ error: 'Invalid session or missing comment' });

    const query = 'INSERT INTO comments (username, comment) VALUES (?, ?)';
    db.run(query, [username, comment], function (err) {
        if (err) return res.status(500).send(err.message);

        const newComment = {
            id: this.lastID,
            username,
            comment,
            timestamp: new Date()
        };

        // Broadcast the new comment
        io.emit('newComment', newComment);

        res.status(201).json(newComment);
    });
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => console.log('User disconnected'));
});

// Start the server
const port = 3001; // Keep the same port
const hostname = 'localhost'; // Change to 'localhost'
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
