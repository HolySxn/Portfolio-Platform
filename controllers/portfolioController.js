const Portfolio = require('../models/Portfolio');

// Get all posts for the logged-in user
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Portfolio.find({ userId: req.user._id });

        // Convert image data to Base64 for rendering
        const postsWithImages = posts.map((post) => ({
            ...post._doc,
            images: post.images.map((img) => ({
                data: img.data.toString('base64'),
                contentType: img.contentType,
            })),
        }));

        res.json(postsWithImages);
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
exports.createPostBinary = async (req, res) => {
    const { title, description, images } = req.body;

    if (!title || !description || !images) {
        return res.status(400).json({ error: 'Title, description, and images are required.' });
    }

    try {
        // Convert Base64-encoded image data to Buffer
        const processedImages = images.map((img) => ({
            data: Buffer.from(img.data, 'base64'),
            contentType: img.contentType,
        }));

        const newPost = new Portfolio({
            userId: req.user._id,
            title,
            description,
            images: processedImages,
        });

        await newPost.save();
        res.status(201).json({ message: "Portfolio post created successfully.", post: newPost });
    } catch (error) {
        console.error("Error creating portfolio post:", error);
        res.status(500).json({ error: "Error creating post." });
    }
};



// Update an existing portfolio post
exports.updatePostBinary = async (req, res) => {
    const { title, description, images } = req.body;

    if (!title || !description || !images) {
        return res.status(400).json({ error: 'Title, description, and images are required.' });
    }

    try {
        const post = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Convert Base64-encoded image data to Buffer
        const processedImages = images.map((img) => ({
            data: Buffer.from(img.data, 'base64'),
            contentType: img.contentType,
        }));

        post.title = title;
        post.description = description;
        post.images = processedImages;

        await post.save();
        res.json({ message: 'Post updated successfully.', post });
    } catch (error) {
        console.error('Error updating portfolio post:', error);
        res.status(500).json({ error: 'Error updating post.' });
    }
};


exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure only admins can delete posts
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete posts.' });
        }

        const post = await Portfolio.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Error deleting post.' });
    }
};

exports.getPostImages = async (req, res) => {
    try {
        const post = await Portfolio.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Serve images as Base64
        const images = post.images.map((img) => ({
            data: img.data.toString('base64'),
            contentType: img.contentType,
        }));

        res.json({ images });
    } catch (error) {
        console.error('Error fetching post images:', error);
        res.status(500).json({ error: 'Error fetching images.' });
    }
};

