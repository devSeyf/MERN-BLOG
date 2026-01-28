const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const app = express();


// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/blogs', require('./routes/commentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));




// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
        console.log('Database:', mongoose.connection.name);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        console.error('Troubleshooting tips:');
        console.error('1. Check if your IP is whitelisted in MongoDB Atlas');
        console.error('2. Verify MONGO_URI in .env file');
        console.error('3. Ensure your internet connection is active');
        process.exit(1);
    });

// Handle disconnection
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

// Handle reconnection
mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully');
});




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
    console.log('API Base URL: http://localhost:' + PORT + '/api');
});
