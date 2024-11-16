const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getUserPosts,
    getPostById,
    createPostBinary,
    updatePostBinary,
    deletePost,
    getPostImages,
} = require('../controllers/portfolioController');

const router = express.Router();

// Routes

// Get all posts for the logged-in user
router.get('/', protect, getUserPosts);

// Get a specific post by ID
router.get('/:id', protect, getPostById);

// Get images for a specific post
router.get('/:id/images', protect, getPostImages);

// Create a new portfolio post (accept binary image data)
router.post('/create', protect, authorize('editor', 'admin'), createPostBinary);

// Update an existing portfolio post (accept binary image data)
router.put('/:id', protect, authorize('editor', 'admin'), updatePostBinary);

// Delete a portfolio post
router.delete('/:id', protect, deletePost);

module.exports = router;
