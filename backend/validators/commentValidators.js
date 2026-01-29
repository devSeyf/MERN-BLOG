const { body } = require('express-validator');

const createCommentValidator = [
    body('text')
        .trim()
        .notEmpty()
        .withMessage('Comment text is required')
        .isLength({ max: 500 })
        .withMessage('Comment cannot exceed 500 characters'),
];

module.exports = {
    createCommentValidator,
};
