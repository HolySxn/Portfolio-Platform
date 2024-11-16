require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false,
    })
);

// Passport.js setup
require('./config/passport')(passport); // Import and configure passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/portfolio', portfolioRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/html/404.html')); // Serve custom 404 page
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
