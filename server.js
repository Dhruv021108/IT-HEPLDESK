const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to handle JSON and large files (images/videos)
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public')); // Serves files from the 'public' folder

const DB_FILE = path.join(__dirname, 'issues.json');

// Helper to read database
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_FILE));
    } catch (e) {
        return [];
    }
};

// Helper to write database
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API: Get all issues
app.get('/issues', (req, res) => {
    res.json(readDB());
});

// API: Add new issue
app.post('/issues', (req, res) => {
    const issues = readDB();
    issues.push(req.body);
    writeDB(issues);
    res.status(201).json({ message: 'Issue created' });
});

// API: Update issue
app.put('/issues/:id', (req, res) => {
    const issues = readDB();
    const id = parseInt(req.params.id);
    const index = issues.findIndex(i => i.id === id);
    
    if (index !== -1) {
        issues[index] = req.body;
        writeDB(issues);
        res.json({ message: 'Issue updated' });
    } else {
        res.status(404).json({ message: 'Issue not found' });
    }
});

// API: Delete issue
app.delete('/issues/:id', (req, res) => {
    let issues = readDB();
    const id = parseInt(req.params.id);
    const newIssues = issues.filter(i => i.id !== id);
    writeDB(newIssues);
    res.json({ message: 'Issue deleted' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});