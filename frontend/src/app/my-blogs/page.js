'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';

export default function MyBlogsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('published'); // published, drafts, all
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy user blogs data (سنستبدلها بـ API لاحقاً)
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Bill Walsh leadership lessons',
      excerpt: 'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      category: 'Leadership',
      tags: ['Leadership', 'Management', 'Presentation'],
      status: 'published',
      views: 1234,
      likes: 89,
      comments: 23,
      createdAt: '2022-01-20',
      updatedAt: '2022-01-20',
    },
    {
      id: 2,
      title: 'How to build a successful startup',
      excerpt: 'Key insights from building multiple successful startups from scratch.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      category: 'Product',
      tags: ['Startup', 'Business', 'Growth'],
      status: 'published',
      views: 856,
      likes: 45,
      comments: 12,
      createdAt: '2022-01-18',
      updatedAt: '2022-01-19',
    },
    {
      id: 3,
      title: 'The future of AI in design',
      excerpt: 'Exploring how artificial intelligence is transforming the design industry.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
      category: 'Design',
      tags: ['AI', 'Design', 'Technology'],
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: '2022-01-15',
      updatedAt: '2022-01-17',
    },
    {
      id: 4,
      title: 'Mastering React Hooks',
      excerpt: 'A comprehensive guide to understanding and using React Hooks effectively.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      category: 'Technology',
      tags: ['React', 'JavaScript', 'Web Development'],
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: '2022-01-10',
      updatedAt: '2022-01-12',
    },
  ]);

  // Filter blogs based on active tab and search
  const filteredBlogs = blogs.filter(blog => {
    const matchesTab = activeTab === 'all' || blog.status === activeTab;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
    totalViews: blogs.reduce((sum, b) => sum + b.views, 0),
    totalLikes: blogs.reduce((sum, b) => sum + b.likes, 0),
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setBlogs(blogs.filter(b => b.id !== blogToDelete.id));
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const handleDuplicate = (blog) => {
    const newBlog = {
      ...blog,
      id: Math.max(...blogs.map(b => b.id)) + 1,
      title: `${blog.title} (Copy)`,
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBlogs([newBlog, ...blogs]);
  };

  return (
    <MainLayout>
      <section className="min-h-screen py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary-700 dark:text-white mb-2">
                My Blogs
              </h1>
              <p className="text-primary-700 dark:text-white/80">
                Manage your blog posts and drafts
              </p>
            </div>
            <Link href="/create">
              <button className="px-6 py-3 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Post
              </button>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card p-4">
              <p className="text-sm text-primary-700 dark:text-white/80 mb-1">Total Posts</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-white">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-primary-700 dark:text-white/80 mb-1">Published</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-white">{stats.published}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-primary-700 dark:text-white/80 mb-1">Drafts</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-white">{stats.drafts}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-primary-700 dark:text-white/80 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-white">{stats.totalViews}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-primary-700 dark:text-white/80 mb-1">Total Likes</p>
              <p className="text-3xl font-bold text-primary-700 dark:text-white">{stats.totalLikes}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-primary-700 dark:bg-white text-white dark:text-primary-700'
                      : 'bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'published'
                      ? 'bg-primary-700 dark:bg-white text-white dark:text-primary-700'
                      : 'bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10'
                  }`}
                >
                  Published ({stats.published})
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'drafts'
                      ? 'bg-primary-700 dark:bg-white text-white dark:text-primary-700'
                      : 'bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10'
                  }`}
                >
                  Drafts ({stats.drafts})
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-primary-700 dark:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your posts..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Blogs List */}
          {filteredBlogs.length === 0 ? (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-primary-700 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-primary-700 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-primary-700 dark:text-white/80 mb-6">
                {searchQuery ? 'Try adjusting your search query' : 'Start creating your first blog post'}
              </p>
              {!searchQuery && (
                <Link href="/create">
                  <button className="px-6 py-3 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 transition-all">
                    Create Your First Post
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="card p-6 hover:shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="md:w-48 flex-shrink-0">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-32 md:h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-primary-700 dark:text-white">
                              {blog.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              blog.status === 'published'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {blog.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-primary-700 dark:text-white/80 mb-3 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-700 dark:text-white/80">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {blog.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {blog.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {blog.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {blog.comments}
                            </span>
                            <span className="text-xs">
                              Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions Menu */}
                        <div className="flex gap-2">
                          {blog.status === 'published' && (
                            <Link href={`/blogs/${blog.id}`}>
                              <button 
                                className="p-2 border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all"
                                title="View"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </Link>
                          )}
                          <Link href={`/blogs/${blog.id}/edit`}>
                            <button 
                              className="p-2 border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDuplicate(blog)}
                            className="p-2 border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all"
                            title="Duplicate"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(blog)}
                            className="p-2 border-2 border-red-500 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-beige-100 dark:bg-primary-700 rounded-xl p-8 max-w-md w-full shadow-2xl border-2 border-primary-700 dark:border-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-700 dark:text-white mb-2">
                Delete Blog Post?
              </h3>
              <p className="text-primary-700 dark:text-white/80">
                Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border-2 border-primary-700 dark:border-white text-primary-700 dark:text-white font-semibold rounded-lg hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
