const mongoose = require('mongoose');
// Define Comment Schema as a sub-document
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: { type: String, required: true }, // Store username for fast display
    text: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});



const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 150 },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true },
    tags: [String],
    coverImage: { type: String }, // Path to the uploaded image
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    comments: [commentSchema]
}, { timestamps: true });

blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);


