'use strict';

const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { uploadPath, upload } = require('../middleware/uploadMiddleware');

exports.uploadSingle = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const f = req.file;
        res.json({
            message: 'File uploaded',
            file: {
                originalname: f.originalname,
                filename: f.filename,
                mimetype: f.mimetype,
                size: f.size
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
        const files = req.files.map(f => ({
            originalname: f.originalname,
            filename: f.filename,
            mimetype: f.mimetype,
            size: f.size
        }));
        res.json({ message: 'Files uploaded', files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listFiles = async (req, res) => {
    try {
        const items = await fs.readdir(uploadPath);
        const list = await Promise.all(items.map(async (filename) => {
            const filepath = path.join(uploadPath, filename);
            const stat = await fs.stat(filepath);
            return {
                filename,
                size: stat.size,
                url: `/files/${encodeURIComponent(filename)}`
            };
        }));
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const filename = req.params.filename;

        // Ensure filename is a String
        if (typeof filename !== 'string') {
            return res.status(400).json({ error: 'Invalid filename type' });
        }

        // prevent path traversal
        if (filename.includes('..')) return res.status(404).json({ error: 'Invalid filename'});

        const filePath = path.join(uploadPath, filename);
        const resolved = path.resolve(filePath);

        if (!resolved.startsWith(path.resolve(uploadPath))) {
            return res.status(400).json({ error: 'Invalid filename' });
        }

        if (!fsSync.existsSync(resolved)) {
            return res.status(404).json({ error: 'File not found' });
        }

        return res.download(resolved, filename);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        if (filename.includes('..')) return res.status(400).json({ error: 'Invalid filename' });
        const filePath = path.join(uploadPath, filename);
        const resolved = path.resolve(filePath);
        if (!resolved.startsWith(path.resolve(uploadPath))) return res.status(400).json({ error: 'Invalid filename' });
        if (!fsSync.existsSync(resolved)) return res.status(404).json({ error: 'File not found' });
        await fs.unlink(resolved);
        res.json({ message: 'File deleted', filename });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};