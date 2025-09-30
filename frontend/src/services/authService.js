import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class AuthService {
  constructor() {
    this.token = null;
    this.api = axios.create({
      baseURL: `${API_URL}/api/auth`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token) {
    this.token = token;
  }

  removeToken() {
    this.token = null;
  }

  async demoLogin(credentials) {
    try {
      const response = await this.api.post('/demo-login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get('/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get user data');
    }
  }

  async logout() {
    try {
      await this.api.post('/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
  }

  async getGitHubAuthUrl() {
    try {
      const response = await this.api.get('/github');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get GitHub auth URL');
    }
  }
}

export const authService = new AuthService();