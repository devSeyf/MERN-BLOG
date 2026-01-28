'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';
import Link from 'next/link';
import blogService from '@/services/blogService';
import authService from '@/services/authService';

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [similarPosts, setSimilarPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchBlogData();
        }
    }, [params.id]);

    const fetchBlogData = async () => {
        setIsLoading(true);
        try {
            const blogData = await blogService.getBlogById(params.id);
            setPost(blogData);

            // Fetch similar blogs
            const similar = await blogService.getSimilarBlogs(params.id);
            setSimilarPosts(similar);
        } catch (error) {
            console.error('Failed to fetch blog:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }

        setIsSubmittingComment(true);
        try {
            // Check if backend has a comment service/endpoint
            // Based on commentRoutes.js, it's POST /api/blogs/:blogId/comments
            const response = await fetch(`http://localhost:5000/api/blogs/${params.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: comment })
            });

            if (response.ok) {
                setComment('');
                fetchBlogData(); // Refresh to see new comment
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-screen bg-beige-100 dark:bg-primary-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700 dark:border-white"></div>
                </div>
            </MainLayout>
        );
    }

    if (!post) {
        return (
            <MainLayout>
                <div className="flex flex-col justify-center items-center min-h-screen bg-beige-100 dark:bg-primary-700 text-primary-700 dark:text-white">
                    <h1 className="text-4xl font-bold mb-4">Blog not found</h1>
                    <Link href="/blogs" className="underline">Back to all blogs</Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="py-12 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
                <Container>
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <Link href="/" className="text-primary-700 dark:text-white/80 hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li className="text-primary-700 dark:text-white/60">/</li>
                            <li>
                                <Link href="/blogs" className="text-primary-700 dark:text-white/80 hover:underline">
                                    Blogs
                                </Link>
                            </li>
                            <li className="text-primary-700 dark:text-white/60">/</li>
                            <li className="text-primary-700 dark:text-white font-medium truncate">
                                {post.title}
                            </li>
                        </ol>
                    </nav>

                    {/* Category Badge */}
                    <div className="mb-4">
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary-700 dark:bg-white text-white dark:text-primary-700">
                            {post.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 dark:text-white mb-6">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-primary-700 dark:text-white/80">
                        <div className="flex items-center gap-2">
                            <img
                                src={post.author?.avatar ? `http://localhost:5000/${post.author.avatar}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'}
                                alt={post.author?.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold">{post.author.name}</p>
                                <p className="text-sm">{post.author.role}</p>
                            </div>
                        </div>
                        <span className="text-primary-700 dark:text-white/60">•</span>
                        <span>{post.date}</span>
                        <span className="text-primary-700 dark:text-white/60">•</span>
                        <span>{post.readTime}</span>
                        <span className="text-primary-700 dark:text-white/60">•</span>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {post.likes}
                            </span>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Featured Image */}
            <section className="bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
                <Container>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Article Content */}
                        <div className="lg:col-span-8">
                            <article
                                className="prose prose-lg max-w-none
                  prose-headings:text-primary-700 dark:prose-headings:text-white
                  prose-p:text-primary-700 dark:prose-p:text-white/90
                  prose-li:text-primary-700 dark:prose-li:text-white/90
                  prose-strong:text-primary-700 dark:prose-strong:text-white
                  prose-a:text-primary-700 dark:prose-a:text-white prose-a:underline
                  prose-blockquote:border-l-primary-700 dark:prose-blockquote:border-l-white
                  prose-blockquote:text-primary-700 dark:prose-blockquote:text-white/90
                  prose-blockquote:italic"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-primary-700/20 dark:border-white/20">
                                <h3 className="text-lg font-semibold text-primary-700 dark:text-white mb-4">
                                    Tags
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blogs?tag=${tag}`}
                                            className="px-4 py-2 text-sm font-medium rounded-full border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white hover:bg-primary-700 hover:text-white dark:hover:bg-white dark:hover:text-primary-700 transition-all"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Author Card */}
                            <div className="mt-12 p-8 card">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-primary-700 dark:text-white mb-1">
                                            {post.author.name}
                                        </h3>
                                        <p className="text-primary-700 dark:text-white/80 mb-2">
                                            {post.author.role}
                                        </p>
                                        <p className="text-primary-700 dark:text-white/90">
                                            {post.author.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-16">
                                <h2 className="text-3xl font-bold text-primary-700 dark:text-white mb-8">
                                    Comments ({post.comments?.length || 0})
                                </h2>

                                {/* Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-12 p-6 card">
                                    <h3 className="text-xl font-semibold text-primary-700 dark:text-white mb-4">
                                        Leave a comment
                                    </h3>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write your comment..."
                                        rows="4"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors mb-4"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmittingComment}
                                        className="px-6 py-3 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 transition-colors disabled:opacity-50"
                                    >
                                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>

                                {/* Comments List */}
                                <div className="space-y-6">
                                    {post.comments?.map((c) => (
                                        <div key={c._id} className="p-6 card">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-primary-700 dark:text-white">
                                                    {c.username}
                                                </h4>
                                                <span className="text-sm text-primary-700 dark:text-white/60">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-primary-700 dark:text-white/90">
                                                {c.text}
                                            </p>
                                        </div>
                                    ))}
                                    {post.comments?.length === 0 && (
                                        <p className="text-center text-primary-700 dark:text-white/60 py-8">
                                            No comments yet. Be the first to share your thoughts!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            {/* Similar Posts */}
                            <div className="sticky top-24">
                                <h3 className="text-2xl font-bold text-primary-700 dark:text-white mb-6">
                                    Similar articles
                                </h3>
                                <div className="space-y-6">
                                    {similarPosts.map((similar) => (
                                        <Link
                                            key={similar._id}
                                            href={`/blogs/${similar._id}`}
                                            className="block card hover:shadow-xl transition-all group"
                                        >
                                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                                <img
                                                    src={similar.coverImage ? `http://localhost:5000/${similar.coverImage}` : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80'}
                                                    alt={similar.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-primary-700 dark:text-white/80 mb-2">
                                                    {similar.author?.username || 'Admin'} • {new Date(similar.createdAt).toLocaleDateString()}
                                                </p>
                                                <h4 className="text-lg font-bold text-primary-700 dark:text-white mb-2 group-hover:underline">
                                                    {similar.title}
                                                </h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    {similar.tags?.slice(0, 2).map(tag => (
                                                        <span key={tag} className="text-xs px-2 py-0.5 border border-primary-700 dark:border-white rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {similarPosts.length === 0 && (
                                        <p className="text-sm text-primary-700 dark:text-white/60">
                                            No similar articles found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
