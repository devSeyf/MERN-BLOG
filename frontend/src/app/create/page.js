'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import blogService from '@/services/blogService';
import authService from '@/services/authService';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    image: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      const cats = await blogService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories(['Design', 'Research', 'Presentation', 'Product', 'Leadership', 'Technology']);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link'
  ];

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

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content || formData.content.trim().length === 0) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category || formData.category.trim().length === 0) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting blog:', formData);

      const createdBlog = await blogService.createBlog(formData);

      console.log('Blog created:', createdBlog);

      router.push('/blogs');
    } catch (error) {
      console.error('Create blog error:', error);
      console.error('Error details:', error.response?.data);

      setErrors({
        submit: error.response?.data?.message || 'Failed to create blog. Please try again.'
      });
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-700 dark:text-white mb-2">
              Create New Blog Post
            </h1>
            <p className="text-primary-700 dark:text-white/80">
              Share your knowledge and ideas with the community
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                {errors.submit}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
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
                </div>

                <div className="card p-6">
                  <label className="block text-sm font-semibold text-primary-700 dark:text-white mb-2">
                    Content *
                  </label>
                  <div
                    className={`border-2 rounded-lg overflow-hidden ${errors.content
                      ? 'border-red-500'
                      : 'border-primary-700 dark:border-white'
                      }`}
                  >
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                      className="bg-white dark:bg-stone-800 text-primary-700 dark:text-white min-h-[400px]"
                    />
                  </div>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-primary-700 dark:text-white mb-3">
                    Publish
                  </h3>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="solid"
                    size="sm"
                    fullWidth
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      'Publish'
                    )}
                  </Button>
                </div>

                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-primary-700 dark:text-white mb-3">
                    Featured Image
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
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-primary-700/5 dark:hover:bg-white/5 transition-colors border-primary-700 dark:border-white">
                          <svg
                            className="w-12 h-12 mx-auto mb-3 text-primary-700 dark:text-white/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
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
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-primary-700 dark:text-white mb-3">
                    Category
                  </h3>

                  <div className="space-y-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white focus:outline-none focus:ring-2 transition-colors cursor-pointer ${errors.category
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                        }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <div className="text-center text-xs text-primary-700 dark:text-white/60">
                      or
                    </div>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Type a new category"
                      className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.category
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                        }`}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-primary-700 dark:text-white mb-3">
                    Tags
                  </h3>

                  <div className="mb-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
                              setFormData({
                                ...formData,
                                tags: [...formData.tags, tagInput.trim()],
                              });
                              setTagInput('');
                            }
                          }
                        }}
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, tagInput.trim()],
                            });
                            setTagInput('');
                          }
                        }}
                        className="px-4 py-2 bg-[#0f766e] text-white font-medium rounded-lg hover:bg-[#115e59] transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#0f766e] text-white rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Container>
      </section>
    </MainLayout>
  );
}
