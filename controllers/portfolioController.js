const Portfolio = require('../models/Portfolio');

// Get all posts for the logged-in user
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Error fetching posts.' });
    }
};

// Get a specific post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Error fetching post.' });
    }
};

// Create a new portfolio post
exports.createPost = async (req, res) => {
    const { title, description, externalImageUrl } = req.body;

    try {
        // Process uploaded files
        const uploadedImagePaths = req.files
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];

        // Process external image URLs
        const externalImagePaths = externalImageUrl
            ? externalImageUrl.split(',').map((url) => url.trim())
            : [];

        // Combine all image paths
        const allImagePaths = [...uploadedImagePaths, ...externalImagePaths];

        const newPost = new Portfolio({
            userId: req.user._id,
            title,
            description,
            images: allImagePaths,
        });

        await newPost.save();
        res.status(201).json({ message: 'Portfolio post created successfully.', post: newPost });
    } catch (error) {
        console.error('Error creating portfolio post:', error);
        res.status(500).json({ error: 'Error creating post.' });
    }
};


// Update an existing portfolio post
exports.updatePost = async (req, res) => {
    const { title, description } = req.body;

    try {
        const post = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const updatedFields = { title, description };

        if (req.files && req.files.length > 0) {
            updatedFields.images = req.files.map((file) => `/uploads/${file.filename}`);
        }

        const updatedPost = await Portfolio.findByIdAndUpdate(req.params.id, updatedFields, {
            new: true,
        });

        res.json({ message: 'Post updated successfully.', post: updatedPost });
    } catch (error) {
        console.error('Error updating portfolio post:', error);
        res.status(500).json({ error: 'Error updating post.' });
    }
};

// Delete a portfolio post
exports.deletePost = async (req, res) => {
    try {
        const post = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        res.json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting portfolio post:', error);
        res.status(500).json({ error: 'Error deleting post.' });
    }
};
