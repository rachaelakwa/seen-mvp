import { apiClient } from './api.js';

export const authService = {
  signup: async (email, password) => {
    const { user, accessToken } = await apiClient.post('/auth/signup', { email, password });
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  login: async (email, password) => {
    const { user, accessToken } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  getMe: async () => {
    const { user } = await apiClient.get('/auth/me');
    return user;
  },

  updateProfile: async (username, firstName, lastName) => {
    const { user } = await apiClient.put('/auth/profile', { username, firstName, lastName });
    localStorage.setItem('user', JSON.stringify(user));
    return { user };
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put('/auth/password', { currentPassword, newPassword });
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
