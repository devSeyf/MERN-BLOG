const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get dashboard statistics (admin only)
router.get('/stats', verifyToken, isAdmin, dashboardController.getDashboardStats);

module.exports = router;
