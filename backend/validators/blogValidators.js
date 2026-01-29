const { body } = require('express-validator');

const createBlogValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 150 })
        .withMessage('Title cannot exceed 150 characters'),
    body('content')
        .notEmpty()
        .withMessage('Content is required'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    body('tags')
        .optional()
        .custom((value) => {
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed);
                } catch (e) {
                    return false;
                }
            }
            return Array.isArray(value);
        })
        .withMessage('Tags must be an array or a JSON array string'),
];

const updateBlogValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage('Title cannot exceed 150 characters'),
    body('content')
        .optional()
        .notEmpty()
        .withMessage('Content cannot be empty'),
    body('category')
        .optional()
        .trim(),
    body('tags')
        .optional()
        .custom((value) => {
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed);
                } catch (e) {
                    return false;
                }
            }
            return Array.isArray(value);
        })
        .withMessage('Tags must be an array or a JSON array string'),
];

module.exports = {
    createBlogValidator,
    updateBlogValidator,
};
