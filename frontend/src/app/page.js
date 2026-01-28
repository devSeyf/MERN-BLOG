'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);

  };

  // Dummy data for recent blog posts
  const recentPosts = [
    {
      id: 1,
      title: 'Bill Walsh leadership lessons',
      excerpt: 'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty? Insights from one of the greatest professional sport coaches of all time.',
      author: 'Alec Whitten',
      date: '17 Jan 2022',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      tags: ['Design', 'Research', 'Presentation'],
    },
    {
      id: 2,
      title: 'Building your API Stack',
      excerpt: 'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing...',
      author: 'Lana Steiner',
      date: '18 Jan 2022',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
      tags: ['Design', 'Research'],
    },
    {
      id: 3,
      title: 'Migrating to Linear 101',
      excerpt: 'Linear helps streamline software projects, sprints, tasks, and bug tracking. Here\'s how to get...',
      author: 'Phoenix Baker',
      date: '19 Jan 2022',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
      tags: ['Design', 'Research'],
    },
  ];

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

          {/* Search Bar - للبحث عن المقالات */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                {/* Search Icon */}
                <div className="absolute left-4 pointer-events-none">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Search Input */}
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
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-50 mb-10">
            Recent blog posts
          </h2>

          {/* Blog Cards Grid - Layout like the reference image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Large Featured Post - Takes 2 rows on large screens */}
            <article className="lg:row-span-2 bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 hover:shadow-xl transition-all cursor-pointer group">
              {/* Post Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={recentPosts[0].image}
                  alt={recentPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Post Content */}
              <div className="p-8">
                {/* Author and Date */}
                <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400 mb-4">
                  <span className="font-semibold">{recentPosts[0].author}</span>
                  <span>•</span>
                  <span>{recentPosts[0].date}</span>
                </div>

                {/* Title with Arrow */}
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors flex items-start justify-between gap-4">
                  <span>{recentPosts[0].title}</span>
                  <svg className="w-6 h-6 flex-shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h3>

                {/* Excerpt */}
                <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
                  {recentPosts[0].excerpt}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {recentPosts[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-sm font-medium rounded-full bg-[#F9F5F0] dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 border border-stone-200 dark:border-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Small Posts on the right */}
            {recentPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 hover:shadow-xl transition-all cursor-pointer group">
                {/* Post Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Author and Date */}
                  <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400 mb-3">
                    <span className="font-semibold">{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  {/* Title with Arrow */}
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors flex items-start justify-between gap-3">
                    <span>{post.title}</span>
                    <svg className="w-5 h-5 flex-shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm font-medium rounded-full bg-[#F9F5F0] dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 border border-stone-200 dark:border-stone-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
