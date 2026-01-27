const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    try {
        // Extract token from Authorization header (format: "Bearer <token>")
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify token and extract user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next(); // Allow the request to proceed
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

// Middleware to check if user is Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is admin, proceed
    } else {
        res.status(403).json({ message: "Admin access required" });
    }
};
