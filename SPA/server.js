const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());               // parse JSON body
app.use(express.urlencoded({ extended: false }));
app.use('/exampleapp', express.static(path.join(__dirname, 'public')));

// GET notes
app.get('/exampleapp/data.json', (req, res) => {
  fs.readFile('notes.json', 'utf8', (err, data) => {
    if (err || !data.trim()) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// POST new note
app.post('/exampleapp/new_note', (req, res) => {
  const newNote = { content: req.body.note };

  fs.readFile('notes.json', 'utf8', (err, data) => {
    let notes = [];
    if (!err && data.trim()) notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('notes.json', JSON.stringify(notes, null, 2), err => {
      if (err) return res.status(500).json({ error: "Failed to save note" });
      res.json({ success: true });
    });
  });
});

// Serve index.html
app.get('/exampleapp/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log("Server running at http://localhost:3000/exampleapp/notes"));
