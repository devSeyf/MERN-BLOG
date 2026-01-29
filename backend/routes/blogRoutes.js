const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const { processImage } = require('../middleware/imageProcessor');
const { createBlogValidator, updateBlogValidator } = require('../validators/blogValidators');
const { mongoIdParamValidator } = require('../validators/commonValidators');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', mongoIdParamValidator(), validate, blogController.getBlogById);
router.get('/:id/similar', mongoIdParamValidator(), validate, blogController.getSimilarBlogs);

// Protected routes
router.post('/',
    verifyToken,
    upload.single('coverImage'),
    processImage,
    createBlogValidator,
    validate,
    blogController.createBlog
);

router.put('/:id',
    verifyToken,
    mongoIdParamValidator(),
    upload.single('coverImage'),
    processImage,
    updateBlogValidator,
    validate,
    blogController.updateBlog
);

router.delete('/:id', verifyToken, mongoIdParamValidator(), validate, blogController.deleteBlog);

module.exports = router;
