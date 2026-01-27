const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
// Process and compress uploaded image
exports.processImage = async (req, res, next) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return next(); // No image, skip processing
        }
        const originalPath = req.file.path;
        const filename = `compressed-${req.file.filename}`;
        const compressedPath = path.join('uploads/blog-images', filename);
        // Compress and resize image
        await sharp(originalPath)
        .resize(1200, 800, { 
                fit: 'inside', 
                withoutEnlargement: true 
            })
            .jpeg({ quality: 85 })
            .toFile(compressedPath);

        // Delete original (uncompressed) file
        await fs.unlink(originalPath);

        // Update req.file to point to compressed file
        req.file.path = compressedPath;
        req.file.filename = filename;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error processing image', error: error.message });
    }
};
