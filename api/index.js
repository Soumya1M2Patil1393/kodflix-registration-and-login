const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['https://kodflix-registration-and-login.vercel.app', 'http://localhost:5174', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./auth');
const movieRoutes = require('./movies');

// Routes (without /api prefix - Vercel rewrite handles that)
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'KodFlix API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For Vercel serverless - export the handler
module.exports = (req, res) => {
    return app(req, res);
};
