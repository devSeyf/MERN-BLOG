const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    category: { type: String, required: true },
    tags: [String],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
}, { timestamps: true }); 
module.exports = mongoose.model('Blog', blogSchema);
