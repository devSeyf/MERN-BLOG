const Blog = require("../models/Blog");
// Get all blogs with search, filter, pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const { search, category, tags, author, sortBy, order, page, limit } =
      req.query;
    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    if (author) {
      filter.author = author;
    }

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.find(filter)
      .populate("author", "username")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

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

// Get a single blog by ID (and increment views)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.user", "username");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment views without triggering 'save' middleware/validation
    await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new blog post with optional cover image
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id,
    };

    // If tags were sent as a JSON string (via FormData), parse them
    if (typeof req.body.tags === 'string') {
      try {
        blogData.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // Fallback or ignore if not valid JSON
      }
    }

    if (req.file) {
      blogData.coverImage = req.file.path;
    }

    if (!blogData.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check authorization: author or admin
    if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    const updateData = { ...req.body };

    // If tags were sent as a JSON string (via FormData), parse them
    if (typeof req.body.tags === 'string') {
      try {
        updateData.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // Fallback
      }
    }

    if (req.file) {
      updateData.coverImage = req.file.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Check authorization: author or admin
    if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get similar blogs based on category and tags
exports.getSimilarBlogs = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Get the current blog to find its category and tags
    const currentBlog = await Blog.findById(blogId);

    if (!currentBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find similar blogs (same category OR matching tags)
    const similarBlogs = await Blog.find({
      _id: { $ne: blogId }, // Exclude current blog
      $or: [
        { category: currentBlog.category }, // Same category
        { tags: { $in: currentBlog.tags } } // Matching tags
      ]
    })
      .sort({ views: -1 }) // Sort by most viewed
      .limit(5) // Return max 5 similar blogs
      .select('title category tags views likes createdAt coverImage')
      .populate('author', 'username');

    res.status(200).json(similarBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

