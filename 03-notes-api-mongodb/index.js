'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// connect to mongodb
mongoose.connect(process.env.MONGODB_URl)
.then( () => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// import model
const Note = require('./models/Note');

// route test
app.get('/', (req, res) => {
    res.json({ message: "API is running"});
});

// CREATE - POST /notes
app.post('/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = new Note( { title, content });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ ALL - GET /notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ ONE - GET /notes/:id
app.get('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - PUT /notes/:id
app.put('/notes/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found'});
        }
        res.json(note);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - DELETE /notes/:id
app.delete('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});