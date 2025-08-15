'use strict';

require('dotenv').config();
const express = require('express');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple health
app.get('/', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// routes
app.use('/', fileRoutes);

// global error handler (include multer errors)
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === 'MulterError') {
        return res.status(400).json({ error: err.message });
    }

    // custom fileFilter error handling
    if (err.message === 'File type not allowed') {
        return res.status(400).json({ error: err.message });
    }
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;