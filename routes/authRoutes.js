const express = require('express');
const passport = require('passport');
const path = require('path');
const { registerUser, loginUser, enable2FA, disable2FA, check2FAStatus, getUserDetails } = require('../controllers/authController');

const router = express.Router();

// Serve the static HTML for the register page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/register.html')); // Adjust path if necessary
});

// Serve the login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    res.status(200).json({ message: 'Logged out successfully.' });
});

// API Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
// 2FA status
router.get('/2fa/status', passport.authenticate('jwt', { session: false }), check2FAStatus);

// Enable 2FA
router.post('/2fa/enable', passport.authenticate('jwt', { session: false }), enable2FA);

// Disable 2FA
router.post('/2fa/disable', passport.authenticate('jwt', { session: false }), disable2FA);

router.get('/user', passport.authenticate('jwt', { session: false }), getUserDetails);


module.exports = router;
