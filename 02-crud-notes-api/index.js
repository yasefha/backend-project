'use strict';

const express = require('express');
const app = express();
const PORT = 3000;

let notes = [
    {id: 1, title: "Belajar Express", content: "Bikin Hello API"},
    {id: 2, title: "Latihan CRUD", content: "Bikin Notes API"}
];

app.use(express.json());

// GET REQUEST
app.get('/', (req, res) => {
    res.json({"message": "Hello from backend!"})
});

app.get('/notes', (req, res) => {
    res.json(notes);
})

app.get('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(note => note.id === id);

    if(note) {
        res.json(note);
    } else {
        res.status(404).send('Item not found');
    }
});

// POST REQUEST
app.post('/notes', (req, res) => {
    const { title } = req.body;
    const { content } = req.body;
    const newNote = { id: notes.length + 1, title, content}
    notes.push(newNote);
    res.status(201).json(newNote);
});

// PUT REQUEST
app.put('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {title} = req.body;
    const {content} = req.body;
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex > -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        res.json(notes[noteIndex]);
    } else {
        res.status(404).send('Item not found');
    }
})

    app.delete('/notes/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const initialLength = notes.length;
        notes = notes.filter(note => note.id !== id);
        if (notes.length < initialLength) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).send('Item not found');
        }
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});