const Blog = require('../models/Blog'); 

// Create now post 
exports.createBlog = async (req, res) => {
    try {
        // req.body 
        const newBlog = new Blog(req.body); 
        const savedBlog = await newBlog.save();  
        res.status(201).json(savedBlog);  
    } catch (error) {
        res.status(400).json({ message: error.message });  
    }
};

// 2. all posts
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); 
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
