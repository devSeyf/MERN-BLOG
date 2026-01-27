const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Add a comment (requires authentication)
router.post('/:blogId/comments', verifyToken, commentController.addComment);

// Delete a comment (requires authentication + ownership or admin)
router.delete('/:blogId/comments/:commentId', verifyToken, commentController.deleteComment);

// Toggle like (requires authentication)
router.post('/:blogId/like', verifyToken, commentController.toggleLike);

module.exports = router;
