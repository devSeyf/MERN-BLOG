'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';
import blogService from '@/services/blogService';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setIsLoading(true);
      try {
        const data = await blogService.getAllBlogs({ limit: 3 });
        setRecentPosts(data.blogs);
      } catch (error) {
        console.error('Failed to fetch recent posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blogs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/blogs');
    }
  };

  return (
    <MainLayout>
      {/* Hero Section with Search Bar */}
      <section className="py-16 bg-[#F9F5F0] dark:bg-stone-900 transition-colors duration-300">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 mb-3 uppercase tracking-wide">
              Our blog
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-50 mb-6">
              The Untitled UI <span className="italic font-serif">journal</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed">
              The Untitled UI Journal features carefully selected good works from studios<br className="hidden md:block" />
              and designers from around the globe. Subscribe for new posts in your inbox.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-4 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </form>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-3 text-center">
              Search by title, author, or tags
            </p>
          </div>
        </Container>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-16 bg-white dark:bg-stone-900 transition-colors duration-300">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-50">
              Recent blog posts
            </h2>
            <Link href="/blogs" className="text-emerald-700 dark:text-emerald-500 font-semibold hover:underline">
              View all posts
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Large Featured Post */}
              {recentPosts[0] && (
                <Link href={`/blogs/${recentPosts[0]._id}`} className="lg:row-span-2">
                  <article className="h-full bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={recentPosts[0].coverImage ? `http://localhost:5000/${recentPosts[0].coverImage}` : 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'}
                        alt={recentPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400 mb-4">
                        <span className="font-semibold">{recentPosts[0].author?.username || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(recentPosts[0].createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors flex items-start justify-between gap-4">
                        <span>{recentPosts[0].title}</span>
                        <svg className="w-6 h-6 flex-shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: recentPosts[0].content }}>
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-[#F9F5F0] dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 border border-stone-200 dark:border-stone-600">
                          {recentPosts[0].category}
                        </span>
                        {recentPosts[0].tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 text-sm font-medium rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Small Posts */}
              <div className="space-y-8">
                {recentPosts.slice(1).map((post) => (
                  <Link key={post._id} href={`/blogs/${post._id}`}>
                    <article className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                        <img
                          src={post.coverImage ? `http://localhost:5000/${post.coverImage}` : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400 mb-3">
                          <span className="font-semibold">{post.author?.username || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: post.content }}>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#F9F5F0] dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 border border-stone-200 dark:border-stone-600">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-stone-600 dark:text-stone-400">No blog posts found.</p>
            </div>
          )}
        </Container>
      </section>
    </MainLayout>
  );
}
