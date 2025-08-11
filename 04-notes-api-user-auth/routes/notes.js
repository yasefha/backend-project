"use strict";

const express = require('express');
const Note = require('../models/note');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = new Note({ title, content, user: req.user.userId });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ ALL  (user-spesific)
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;