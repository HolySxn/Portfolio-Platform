const express = require('express');
const passport = require('passport');
const path = require('path');
const { registerUser, loginUser, enable2FA, disable2FA } = require('../controllers/authController');

const router = express.Router();

// Serve the static HTML for the register page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/register.html')); // Adjust path if necessary
});

// Serve the login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

// API Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/2fa/setup', passport.authenticate('jwt', { session: false }), enable2FA);
router.post('/2fa/disable', passport.authenticate('jwt', { session: false }), disable2FA);

module.exports = router;
