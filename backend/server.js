const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Successfully connected to MongoDB'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});


app.use('/api/blogs', require('./routes/blogRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
