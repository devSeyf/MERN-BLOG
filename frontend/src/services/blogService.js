import api from './api';

class BlogService {
  async createBlog(blogData) {
    const formData = new FormData();

    formData.append('title', blogData.title);
    formData.append('content', blogData.content);

    if (blogData.category) {
      formData.append('category', blogData.category);
    }

    if (blogData.tags && blogData.tags.length > 0) {
      formData.append('tags', JSON.stringify(blogData.tags));
    }

    if (blogData.image) {
      formData.append('coverImage', blogData.image);
    }

    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getAllBlogs(params = {}) {
    const response = await api.get('/blogs', { params });
    return response.data;
  }

  async getBlogById(id) {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  }

  async updateBlog(id, blogData) {
    const formData = new FormData();

    formData.append('title', blogData.title);
    formData.append('content', blogData.content);

    if (blogData.category) {
      formData.append('category', blogData.category);
    }

    if (blogData.tags && blogData.tags.length > 0) {
      formData.append('tags', JSON.stringify(blogData.tags));
    }

    if (blogData.image && typeof blogData.image !== 'string') {
      formData.append('coverImage', blogData.image);
    }

    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async deleteBlog(id) {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  }

  async getSimilarBlogs(id) {
    const response = await api.get(`/blogs/${id}/similar`);
    return response.data;
  }

  async getCategories() {
    const defaultCategories = ['Design', 'Research', 'Presentation', 'Product', 'Leadership', 'Technology'];

    try {
      const response = await api.get('/blogs');

      if (response.data.blogs && response.data.blogs.length > 0) {
        const existingCategories = [...new Set(
          response.data.blogs
            .map(blog => blog.category)
            .filter(cat => cat)
        )];

        const allCategories = [...new Set([...defaultCategories, ...existingCategories])];
        return allCategories.sort();
      }

      return defaultCategories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return defaultCategories;
    }
  }
}

export default new BlogService();
