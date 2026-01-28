import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class BlogService {
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

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

    const response = await axios.post(`${API_URL}/blogs`, formData, {
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getAllBlogs(params = {}) {
    const response = await axios.get(`${API_URL}/blogs`, {
      params,
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getBlogById(id) {
    const response = await axios.get(`${API_URL}/blogs/${id}`, {
      headers: this.getAuthHeader(),
    });
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

    const response = await axios.put(`${API_URL}/blogs/${id}`, formData, {
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async deleteBlog(id) {
    const response = await axios.delete(`${API_URL}/blogs/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getSimilarBlogs(id) {
    const response = await axios.get(`${API_URL}/blogs/${id}/similar`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getCategories() {
    const defaultCategories = ['Design', 'Research', 'Presentation', 'Product', 'Leadership', 'Technology'];
    
    try {
      const response = await axios.get(`${API_URL}/blogs`, {
        headers: this.getAuthHeader(),
      });
      
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
