'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController');

// Setup multer from image upload
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/images/');
    }, 
    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

// Routes
router.post('/', protect, upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', protect, upload.single('image'), postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;