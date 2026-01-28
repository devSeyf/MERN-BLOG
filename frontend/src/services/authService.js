import api from './api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, username, isAdmin } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username, isAdmin }));

            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            throw new Error(message);
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed. Please try again.';
            throw new Error(message);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            return null;
        }
    },

    getToken: () => localStorage.getItem('token'),

    isAuthenticated: () => !!localStorage.getItem('token'),

    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.isAdmin || false;
    },
};

export default authService;
