'use strict';

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const uploadPath = path.resolve(process.cwd(), UPLOAD_DIR);

// ensure upload folder exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // safe filename: timestamp-random-originalname (replace spaces)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const safeName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${uniqueSuffix}-${safeName}`);
    }
});

// allowed types from env
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg, image/png, application/pdf').split(',');

function fileFilter(req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
}

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 2097152;

const upload = multer ({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

// exports middleware
module.exports = {
    uploadSingle: upload.single('file'), // form field: file
    uploadMultiple: upload.array('files', 10), // form field: files, max 10
    upload, // raw upload object in case want to custom
    uploadPath
};