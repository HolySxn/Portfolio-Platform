const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../config/nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

exports.registerUser = async (req, res) => {
    const { email, password, firstName, lastName, age, gender } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    try {
        const newUser = new User({ email, password, firstName, lastName, age, gender });
        console.log(newUser)
        await newUser.save();

        await sendWelcomeEmail(email);

        res.status(201).json({ message: 'User registered successfully. Please log in.' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error registering user.' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' }); // Ensure early return
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials.' }); // Ensure early return
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set token in a secure HTTP-only cookie
        res.cookie('jwt', token, { httpOnly: true, secure: false }); // Set `secure: true` in production
        return res.status(200).json({ message: 'Login successful.', token }); // Final response
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error.' }); // Ensure early return
    }
};


exports.enable2FA = async (req, res) => {
    const { user } = req;

    try {
        // Generate a new TOTP secret for the user
        const secret = speakeasy.generateSecret({
            length: 20,
            name: `Portfolio Platform (${user.email})`,
            issuer: 'Portfolio Platform'
        });

        // Generate QR code for the secret
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

        // Save the secret in the user's record
        await User.findByIdAndUpdate(user._id, { twoFactorSecret: secret.base32 });

        res.status(200).json({
            message: '2FA enabled successfully.',
            qrCode: qrCodeUrl,
            secret: secret.base32 // Share only in development/debugging, not production
        });
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ error: 'Error enabling 2FA.' });
    }
};

exports.disable2FA = async (req, res) => {
    const { user } = req; // Get the authenticated user

    try {
        // Clear the user's 2FA secret
        await User.findByIdAndUpdate(user._id, { twoFactorSecret: null });

        res.status(200).json({
            message: '2FA disabled successfully.'
        });
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        res.status(500).json({
            error: 'Error disabling 2FA.'
        });
    }
};
