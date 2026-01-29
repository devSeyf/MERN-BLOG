const Blog = require('../models/Blog');
const asyncHandler = require("express-async-handler");

// Add a comment to a blog post
exports.addComment = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const { text } = req.body;
    // Find the blog post
    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Create the comment object
    const comment = {
        user: req.user.id,
        username: req.user.username, // We'll pass this from middleware
        text: text,
        createdAt: new Date()
    };

    // Add comment to the beginning of the array (newest first)
    blog.comments.unshift(comment);
    await blog.save();

    res.status(201).json({ message: "Comment added", comment });
});

// Delete a comment (only by comment author or admin)
exports.deleteComment = asyncHandler(async (req, res) => {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Find the comment
    const comment = blog.comments.id(commentId);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }

    // Check authorization (only comment owner or admin can delete)
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to delete this comment");
    }

    // Remove the comment using pull method
    blog.comments.pull(commentId);
    await blog.save();

    res.status(200).json({ message: "Comment deleted" });
});

// Toggle like on a blog post
exports.toggleLike = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Check if user already liked the blog
    const likedIndex = blog.likedBy.indexOf(userId);

    if (likedIndex === -1) {
        // User hasn't liked yet, add like
        blog.likedBy.push(userId);
        blog.likes += 1;
    } else {
        // User already liked, remove like (unlike)
        blog.likedBy.splice(likedIndex, 1);
        blog.likes -= 1;
    }

    await blog.save();

    res.status(200).json({
        message: likedIndex === -1 ? "Liked" : "Unliked",
        likes: blog.likes
    });
});
