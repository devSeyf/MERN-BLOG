const Blog = require("../models/Blog");
// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      ...req.body,
      author: req.user.id, // Get user ID from the verified token
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// all posts
// Get a single blog by ID (and increment views)
// Get all blogs with advanced search, filter, and pagination
exports.getAllBlogs = async (req, res) => {
  try {
    // Extract query parameters from URL
    const {
      search, // Search keyword
      category, // Filter by category
      tags, // Filter by tags
      author, // Filter by author ID
      sortBy, // Sort field (e.g., "views", "likes", "createdAt")
      order, // Sort order ("asc" or "desc")
      page, // Page number for pagination
      limit, // Items per page
    } = req.query;

    // Build the filter object dynamically
    let filter = {};

    // Search in title and content using regex (case-insensitive, partial match)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category (exact match)
    if (category) {
      filter.category = category;
    }

    // Filter by tags (match any tag in the array)
    if (tags) {
      // Tags can be sent as comma-separated string: "tech,ai,web"
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    // Filter by author ID
    if (author) {
      filter.author = author;
    }

    // Determine sort options (default: newest first)
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    // Pagination setup
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Execute the query with all filters, sorting, and pagination
    const blogs = await Blog.find(filter)
      .populate("author", "username")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination metadata
    const totalBlogs = await Blog.countDocuments(filter);

    res.status(200).json({
      blogs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalBlogs / limitNum),
        totalBlogs,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
