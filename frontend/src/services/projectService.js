import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ProjectService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/projects`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      if (authService.token) {
        config.headers.Authorization = `Bearer ${authService.token}`;
      }
      return config;
    });
  }

  async getProjects() {
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load projects');
    }
  }

  async getProject(projectId) {
    try {
      const response = await this.api.get(`/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load project');
    }
  }

  async createProject(projectData) {
    try {
      const response = await this.api.post('/', projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create project');
    }
  }

  async updateProject(projectId, updates) {
    try {
      const response = await this.api.put(`/${projectId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update project');
    }
  }

  async deleteProject(projectId) {
    try {
      const response = await this.api.delete(`/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
  }
}

export const projectService = new ProjectService();