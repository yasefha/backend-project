'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API is running" });
});

const PORT = process.env.PORT || 3000;

// connect to mongodb
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected to mongodb');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
})
.catch(err => {
    console.error('Mongodb connection error:', err);
    process.exit(1);
});

