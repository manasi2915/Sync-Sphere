import { apiRequest } from './api';

export const auth = {
  async register({ name, email, password, role = 'student' }) {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });

    localStorage.setItem('sync_token', data.token);
    localStorage.setItem('sync_user', JSON.stringify(data.user));
    return data.user;
  },

  async login({ email, password }) {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('sync_token', data.token);
    localStorage.setItem('sync_user', JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    localStorage.removeItem('sync_token');
    localStorage.removeItem('sync_user');
  },

  user() {
    const s = localStorage.getItem('sync_user');
    return s ? JSON.parse(s) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem('sync_token');
  }
};
