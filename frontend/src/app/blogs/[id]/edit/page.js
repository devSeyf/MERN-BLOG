'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';
import dynamic from 'next/dynamic';
import blogService from '@/services/blogService';
import authService from '@/services/authService';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    image: null,
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const categories = ['Design', 'Research', 'Presentation', 'Product', 'Leadership', 'Technology'];

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  // Load existing blog data
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadBlogData = async () => {
      setIsLoading(true);
      try {
        const blogData = await blogService.getBlogById(params.id);

        // Check if user is the author
        const currentUser = authService.getCurrentUser();
        // Backend populate author might return object or ID depending on query
        const authorId = typeof blogData.author === 'object' ? blogData.author._id : blogData.author;

        if (authorId !== currentUser?.id && !currentUser?.isAdmin) {
          router.push('/my-blogs');
          return;
        }

        setFormData({
          title: blogData.title,
          excerpt: blogData.excerpt || '',
          content: blogData.content,
          category: blogData.category,
          tags: blogData.tags || [],
          image: null,
          status: blogData.status || 'published',
        });

        if (blogData.coverImage) {
          const imgUrl = `http://localhost:5000/${blogData.coverImage}`;
          setImagePreview(imgUrl);
          setOriginalImage(imgUrl);
        }
      } catch (error) {
        console.error('Failed to load blog data:', error);
        router.push('/my-blogs');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadBlogData();
    }
  }, [params.id, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
    setErrors({ ...errors, content: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select an image file' });
        return;
      }

      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setErrors({ ...errors, image: '' });
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.content || formData.content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (newStatus = null) => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('status', newStatus || formData.status);
      data.append('tags', JSON.stringify(formData.tags));
      if (formData.excerpt) data.append('excerpt', formData.excerpt);
      if (formData.image) {
        data.append('coverImage', formData.image);
      }

      await blogService.updateBlog(params.id, data);
      router.push(`/blogs/${params.id}`);
    } catch (error) {
      console.error('Failed to update blog:', error);
      setErrors({ submit: error.message || 'Failed to update blog' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () => {
    handleUpdate('draft');
  };

  const handlePublish = () => {
    handleUpdate('published');
  };

  const handleUnpublish = () => {
    handleUpdate('draft');
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(params.id);
        router.push('/my-blogs');
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="min-h-screen py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300 flex items-center justify-center">
          <Container>
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-primary-700 dark:text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg text-primary-700 dark:text-white">Loading blog data...</p>
            </div>
          </Container>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold text-primary-700 dark:text-white mb-2">
                  Edit Blog Post
                </h1>
                <p className="text-primary-700 dark:text-white/80">
                  Update your blog post content and settings
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-700 dark:text-white/80">Status:</span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${formData.status === 'published'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                {formData.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div className="card p-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title for your blog post"
                    className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.title
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                      }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                  <p className="mt-1 text-xs text-primary-700 dark:text-white/60">
                    {formData.title.length} characters
                  </p>
                </div>

                {/* Excerpt */}
                <div className="card p-6">
                  <label
                    htmlFor="excerpt"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Excerpt *
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Write a brief summary of your blog post"
                    className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.excerpt
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                      }`}
                  />
                  {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
                  )}
                  <p className="mt-1 text-xs text-primary-700 dark:text-white/60">
                    {formData.excerpt.length} characters
                  </p>
                </div>

                {/* Content Editor */}
                <div className="card p-6">
                  <label
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Content *
                  </label>
                  <div className={`border-2 rounded-lg overflow-hidden ${errors.content
                    ? 'border-red-500'
                    : 'border-primary-700 dark:border-white'
                    }`}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your blog content here..."
                      className="bg-white dark:bg-stone-800 text-primary-700 dark:text-white min-h-[400px]"
                    />
                  </div>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Update Actions */}
                <div className="card p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-white mb-4">
                    Actions
                  </h3>

                  <div className="space-y-3">
                    {/* Save/Update Button */}
                    <button
                      type="button"
                      onClick={() => handleUpdate()}
                      disabled={isSaving}
                      className="w-full px-6 py-3 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>

                    {/* Status Change Buttons */}
                    {formData.status === 'draft' ? (
                      <button
                        type="button"
                        onClick={handlePublish}
                        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Publish Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleUnpublish}
                        className="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Unpublish
                      </button>
                    )}

                    <div className="border-t-2 border-primary-700/20 dark:border-white/20 my-4"></div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Post
                    </button>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-white mb-4">
                    Featured Image *
                  </h3>

                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setImagePreview(originalImage);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <label className="absolute bottom-2 right-2 cursor-pointer">
                          <div className="px-3 py-1 bg-primary-700 dark:bg-white text-white dark:text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-800 dark:hover:bg-white/90 transition-colors">
                            Change
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-primary-700/5 dark:hover:bg-white/5 transition-colors ${errors.image
                          ? 'border-red-500'
                          : 'border-primary-700 dark:border-white'
                          }`}>
                          <svg className="w-12 h-12 mx-auto mb-3 text-primary-700 dark:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-primary-700 dark:text-white mb-1">
                            Click to upload image
                          </p>
                          <p className="text-xs text-primary-700 dark:text-white/60">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    {errors.image && (
                      <p className="text-sm text-red-500">{errors.image}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-white mb-4">
                    Category *
                  </h3>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white focus:outline-none focus:ring-2 transition-colors ${errors.category
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                      }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-white mb-4">
                    Tags *
                  </h3>

                  <form onSubmit={handleAddTag} className="mb-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-medium rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-700 dark:bg-white text-white dark:text-primary-700 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-white/20 dark:hover:bg-primary-700/20 rounded-full p-0.5"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.tags && (
                    <p className="mt-2 text-sm text-red-500">{errors.tags}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Container>
      </section>
    </MainLayout>
  );
}
