'use client';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';
import Link from 'next/link';
import blogService from '@/services/blogService';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);

    const categories = ['All', 'Design', 'Research', 'Presentation', 'Product', 'Leadership', 'Technology'];

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, selectedCategory]);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 6,
                category: selectedCategory === 'All' ? '' : selectedCategory,
                search: searchQuery
            };
            const data = await blogService.getAllBlogs(params);
            setBlogs(data.blogs);
            setTotalPages(data.pagination.totalPages);
            setTotalBlogs(data.pagination.totalBlogs);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBlogs();
    };

    const currentPosts = blogs;

    return (
        <MainLayout>
            {/* Header Section */}
            <section className="py-12 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-700 dark:text-white mb-4">
                        All blog posts
                    </h1>
                    <p className="text-lg text-primary-700 dark:text-white/90">
                        Explore our collection of articles, tutorials, and insights
                    </p>
                </Container>
            </section>

            {/* Filters and Search */}
            <section className="py-8 bg-beige-100 dark:bg-primary-700 border-b border-primary-700/20 dark:border-white/20 transition-colors duration-300">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                        ? 'bg-primary-700 dark:bg-white text-white dark:text-primary-700'
                                        : 'bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="w-full lg:w-auto">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-primary-700 dark:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full lg:w-80 pl-10 pr-4 py-2 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Results count */}
                    <p className="mt-4 text-sm text-primary-700 dark:text-white/80">
                        Showing {currentPosts.length} of {totalBlogs} articles
                    </p>
                </Container>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
                <Container>
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700 dark:border-white"></div>
                        </div>
                    ) : currentPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto mb-4 text-primary-700 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-primary-700 dark:text-white mb-2">
                                No articles found
                            </h3>
                            <p className="text-primary-700 dark:text-white/80">
                                Try adjusting your filters or search query
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentPosts.map((post) => (
                                <Link href={`/blogs/${post._id}`} key={post._id}>
                                    <article className="card hover:shadow-2xl transition-all cursor-pointer group h-full flex flex-col">
                                        {/* Post Image */}
                                        <div className="aspect-video overflow-hidden rounded-t-xl">
                                            <img
                                                src={post.coverImage ? `http://localhost:5000/${post.coverImage}` : (post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80')}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Post Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Author and Date */}
                                            <div className="flex items-center gap-3 text-sm text-primary-700 dark:text-white/80 mb-3">
                                                <span className="font-semibold">{post.author?.username || 'Admin'}</span>
                                                <span>•</span>
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            {/* Title with Arrow */}
                                            <h3 className="text-xl font-bold text-primary-700 dark:text-white mb-2 group-hover:underline transition-all flex items-start justify-between gap-3">
                                                <span>{post.title}</span>
                                                <svg className="w-5 h-5 flex-shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-primary-700 dark:text-white/80 mb-4 line-clamp-2 flex-1">
                                                {post.excerpt}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex gap-2 flex-wrap mt-auto">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 text-xs font-medium rounded-full border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white font-medium hover:bg-primary-700/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first, last, current, and pages around current
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === pageNumber
                                                ? 'bg-primary-700 dark:bg-white text-white dark:text-primary-700'
                                                : 'border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }
                                // Show ellipsis
                                if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                    return <span key={pageNumber} className="text-primary-700 dark:text-white">...</span>;
                                }
                                return null;
                            })}

                            {/* Next Button */}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white font-medium hover:bg-primary-700/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </Container>
            </section>
        </MainLayout>
    );
}
