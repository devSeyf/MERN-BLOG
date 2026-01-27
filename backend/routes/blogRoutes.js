const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes (anyone can access)
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes (require authentication)
router.post('/', verifyToken, blogController.createBlog);
router.put('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, isAdmin, blogController.deleteBlog);


// Advanced search endpoint (more intuitive URL)
router.get('/search', blogController.getAllBlogs);

module.exports = router;
