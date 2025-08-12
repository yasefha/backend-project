'use strict';

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.get('/test', (req, res) => {
  res.send('Test route works!');
});


app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Middleware protect test
const { protect } = require('./middleware/authMiddleware');
app.get('/api/test', protect, (req, res) => {
    res.json({ message: `Halo ${req.user.name}, token kamu valid!`});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));