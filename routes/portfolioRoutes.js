const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getUserPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/portfolioController');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads')); // Save files to public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames
    },
});
const upload = multer({ storage });

// Routes

// Get all posts for the logged-in user
router.get('/', protect, getUserPosts);

// Get a specific post by ID
router.get('/:id', protect, getPostById);

// Create a new portfolio post (supports file uploads and external URLs)
router.post('/create', protect, authorize('editor', 'admin'), upload.array('images', 3), createPost);

// Update an existing portfolio post
router.put('/:id', protect, authorize('editor', 'admin'), upload.array('images', 3), updatePost);

// Delete a portfolio post
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;
