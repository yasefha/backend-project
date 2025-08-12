'use strict';

const Post = require('../models/post');

exports.createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const image = req.file? req.file.filename: null;

        const post = new Post({
            title,
            content,
            category,
            image,
            user: req.user._id
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('category', 'name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('category', 'name')
            .populate('user', 'name email');
        
            if (!post) return res.status(404).json({ message: 'Post not found'});

            res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const image = req.file? req.file.filename: null;

        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        if (image) post.image = image;

        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.remove();

        res.json({ message: 'Post deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};