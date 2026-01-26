const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');  

// link to add : POST http://localhost:5000/api/blogs
router.post('/', blogController.createBlog);

// link to get : GET http://localhost:5000/api/blogs
router.get('/', blogController.getAllBlogs);

module.exports = router;
