const Blog = require('../models/Blog');
const User = require('../models/User');
const asyncHandler = require("express-async-handler");

// Get dashboard statistics
exports.getDashboardStats = asyncHandler(async (req, res) => {
    // Total counts
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total views and likes
    const blogStats = await Blog.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: '$views' },
                totalLikes: { $sum: '$likes' }
            }
        }
    ]);

    const totalViews = blogStats.length > 0 ? blogStats[0].totalViews : 0;
    const totalLikes = blogStats.length > 0 ? blogStats[0].totalLikes : 0;

    // Top 5 blogs by views
    const topBlogsByViews = await Blog.find()
        .sort({ views: -1 })
        .limit(5)
        .select('title views likes createdAt')
        .populate('author', 'username');

    // Top 5 blogs by likes
    const topBlogsByLikes = await Blog.find()
        .sort({ likes: -1 })
        .limit(5)
        .select('title views likes createdAt')
        .populate('author', 'username');

    // Recent 5 blogs
    const recentBlogs = await Blog.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title views likes createdAt')
        .populate('author', 'username');

    // Category distribution
    const categoryDistribution = await Blog.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    // Tags distribution (top 10 tags)
    const tagsDistribution = await Blog.aggregate([
        {
            $unwind: '$tags'
        },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 10
        }
    ]);

    // Blogs per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const blogsPerMonth = await Blog.aggregate([
        {
            $match: {
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    res.status(200).json({
        overview: {
            totalBlogs,
            totalUsers,
            totalViews,
            totalLikes
        },
        topBlogsByViews,
        topBlogsByLikes,
        recentBlogs,
        categoryDistribution,
        tagsDistribution,
        blogsPerMonth
    });
});
