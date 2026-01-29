const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { createCommentValidator } = require('../validators/commentValidators');
const { mongoIdParamValidator } = require('../validators/commonValidators');
const { validate } = require('../middleware/validateMiddleware');

// Add a comment to a blog (requires authentication)
router.post('/:blogId/comments',
    verifyToken,
    mongoIdParamValidator(['blogId']),
    createCommentValidator,
    validate,
    commentController.addComment
);

// Delete a comment (requires authentication + ownership or admin)
router.delete('/:blogId/comments/:commentId',
    verifyToken,
    mongoIdParamValidator(['blogId', 'commentId']),
    validate,
    commentController.deleteComment
);

// Toggle like on a blog (requires authentication)
router.post('/:blogId/like',
    verifyToken,
    mongoIdParamValidator(['blogId']),
    validate,
    commentController.toggleLike
);

module.exports = router;
