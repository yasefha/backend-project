'use strict';

const express = require('express');
const router = express.Router();

const fileController = require('../controller/fileController');
const { uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');

// Upload single
router.post('/upload/single', uploadSingle, fileController.uploadSingle);

// Upload multiple
router.post('/upload/multiple', uploadMultiple, fileController.uploadMultiple);

// List files
router.get('/files', fileController.listFiles);

// Download file
router.get('/files/:filename', fileController.downloadFile);

// Delete file
router.delete('/files/:filename', fileController.deleteFile);

module.exports = router;