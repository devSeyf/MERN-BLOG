'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';
import Link from 'next/link';

export default function BlogDetailPage() {
    const params = useParams();
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Dummy blog post data (سنستبدلها بـ API لاحقاً)
    const post = {
        id: params.id,
        title: 'Bill Walsh leadership lessons',
        content: `
      <p>Bill Walsh is one of the most legendary coaches in NFL history. He transformed the San Francisco 49ers from a struggling franchise into a dynasty that won three Super Bowls during his tenure.</p>
      
      <h2>Early Career and Philosophy</h2>
      <p>Walsh developed his coaching philosophy over many years as an assistant coach. He believed in meticulous preparation, innovative offensive schemes, and treating players with respect. His "West Coast Offense" revolutionized professional football.</p>
      
      <h2>Key Leadership Principles</h2>
      <p>Walsh's leadership style was characterized by several key principles:</p>
      
      <ul>
        <li><strong>Standard of Performance:</strong> Walsh believed in establishing a clear standard of performance for everyone in the organization, from players to secretaries.</li>
        <li><strong>Attention to Detail:</strong> Every aspect of the team's operation was scrutinized and optimized.</li>
        <li><strong>Innovation:</strong> Walsh constantly sought new ways to gain competitive advantages.</li>
        <li><strong>Teaching:</strong> He saw himself as a teacher first, helping players reach their full potential.</li>
      </ul>
      
      <h2>Building a Winning Culture</h2>
      <p>When Walsh took over the 49ers in 1979, the team had won only two games the previous season. Rather than focusing solely on winning, he focused on building the right culture and processes. The wins followed naturally.</p>
      
      <blockquote>
        "The score will take care of itself when you take care of the details that lead to victory."
      </blockquote>
      
      <h2>Legacy and Impact</h2>
      <p>Walsh's influence extends far beyond his championship rings. Many of his assistant coaches went on to become successful head coaches themselves, spreading his philosophy throughout the NFL. His emphasis on preparation, innovation, and treating people with dignity remains relevant for leaders in any field.</p>
      
      <h2>Lessons for Modern Leaders</h2>
      <p>Today's leaders can learn valuable lessons from Walsh's approach:</p>
      
      <ol>
        <li>Establish clear standards and hold everyone accountable</li>
        <li>Pay attention to the smallest details</li>
        <li>Never stop innovating and learning</li>
        <li>Invest in developing your team members</li>
        <li>Focus on the process, not just the results</li>
      </ol>
    `,
        author: {
            name: 'Olivia Rhye',
            role: 'Product Designer',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            bio: 'Olivia is a product designer with a passion for creating beautiful and functional user experiences.',
        },
        date: '20 Jan 2022',
        readTime: '8 min read',
        views: 1234,
        likes: 89,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
        category: 'Leadership',
        tags: ['Leadership', 'Management', 'Presentation'],
    };

    // Dummy comments
    const [comments, setComments] = useState([
        {
            id: 1,
            name: 'John Doe',
            date: '2 days ago',
            content: 'Great article! I really enjoyed reading about Bill Walsh\'s leadership principles.',
        },
        {
            id: 2,
            name: 'Jane Smith',
            date: '3 days ago',
            content: 'The section on building a winning culture was particularly insightful. Thanks for sharing!',
        },
    ]);

    // Similar posts
    const similarPosts = [
        {
            id: 2,
            title: 'PM mental models',
            excerpt: 'Mental models are simple expressions of complex processes or relationships.',
            author: 'Demi Wilkinson',
            date: '16 Jan 2022',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
            tags: ['Product', 'Research'],
        },
        {
            id: 3,
            title: 'What is Wireframing?',
            excerpt: 'Introduction to Wireframing and its Principles.',
            author: 'Candice Wu',
            date: '15 Jan 2022',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
            tags: ['Design', 'Research'],
        },
        {
            id: 4,
            title: 'How collaboration makes us better',
            excerpt: 'Collaboration can make our teams stronger.',
            author: 'Natali Craig',
            date: '14 Jan 2022',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
            tags: ['Design', 'Research'],
        },
    ];

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            id: comments.length + 1,
            name,
            date: 'Just now',
            content: comment,
        };
        setComments([newComment, ...comments]);
        setComment('');
        setName('');
        setEmail('');
    };

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
                                src={post.author.avatar}
                                alt={post.author.name}
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
                                    Comments ({comments.length})
                                </h2>

                                {/* Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-12 p-6 card">
                                    <h3 className="text-xl font-semibold text-primary-700 dark:text-white mb-4">
                                        Leave a comment
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            required
                                            className="px-4 py-3 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors"
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email"
                                            required
                                            className="px-4 py-3 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors"
                                        />
                                    </div>
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
                                        className="px-6 py-3 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 transition-colors"
                                    >
                                        Post Comment
                                    </button>
                                </form>

                                {/* Comments List */}
                                <div className="space-y-6">
                                    {comments.map((c) => (
                                        <div key={c.id} className="p-6 card">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-primary-700 dark:text-white">
                                                    {c.name}
                                                </h4>
                                                <span className="text-sm text-primary-700 dark:text-white/60">
                                                    {c.date}
                                                </span>
                                            </div>
                                            <p className="text-primary-700 dark:text-white/90">
                                                {c.content}
                                            </p>
                                        </div>
                                    ))}
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
                                            key={similar.id}
                                            href={`/blogs/${similar.id}`}
                                            className="block card hover:shadow-xl transition-all group"
                                        >
                                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                                <img
                                                    src={similar.image}
                                                    alt={similar.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-primary-700 dark:text-white/80 mb-2">
                                                    {similar.author} • {similar.date}
                                                </p>
                                                <h4 className="text-lg font-bold text-primary-700 dark:text-white mb-2 group-hover:underline">
                                                    {similar.title}
                                                </h4>
                                                <p className="text-sm text-primary-700 dark:text-white/80 line-clamp-2">
                                                    {similar.excerpt}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
