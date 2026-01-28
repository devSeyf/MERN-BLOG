const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const { processImage } = require('../middleware/imageProcessor');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById)
router.get('/:id/similar', blogController.getSimilarBlogs);;



// Protected routes
router.post('/',
    verifyToken,
    upload.single('coverImage'),
    processImage,
    blogController.createBlog
);

router.put('/:id',
    verifyToken,
    upload.single('coverImage'),
    processImage,
    blogController.updateBlog
);


router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports = router;
