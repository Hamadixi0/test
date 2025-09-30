import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// AI Service
export const aiService = {
  startConversation: (sessionId) => 
    api.post('/ai/conversation/start', { sessionId }),
    
  sendMessage: (sessionId, message) => 
    api.post('/ai/conversation/message', { sessionId, message }),
    
  generateSpecification: (sessionId) => 
    api.post('/ai/generate-specification', { sessionId }),
    
  getConversationHistory: (sessionId) => 
    api.get(`/ai/conversation/${sessionId}/history`),
    
  clearConversation: (sessionId) => 
    api.delete(`/ai/conversation/${sessionId}`),
    
  healthCheck: () => 
    api.get('/ai/health')
};

// Games Service
export const gamesService = {
  generateGame: (gameSpec, sessionId) => 
    api.post('/games/generate', { gameSpec, sessionId }),
    
  getGame: (gameId) => 
    api.get(`/games/${gameId}`),
    
  listGames: () => 
    api.get('/games'),
    
  deleteGame: (gameId) => 
    api.delete(`/games/${gameId}`),
    
  validateGame: (gameId) => 
    api.post(`/games/${gameId}/validate`),
    
  getGameAssets: (gameId, assetPath) => 
    api.get(`/games/${gameId}/assets/${assetPath}`),
    
  getGameSource: (gameId, sourcePath) => 
    api.get(`/games/${gameId}/src/${sourcePath}`)
};

// Build Service
export const buildService = {
  buildGame: (gameId, platforms = ['web']) => 
    api.post(`/build/${gameId}`, { platforms }),
    
  getBuildInfo: (gameId) => 
    api.get(`/build/${gameId}`),
    
  downloadBuild: (gameId, platform) => 
    `${API_BASE_URL}/build/${gameId}/download/${platform}`,
    
  listBuilds: () => 
    api.get('/build'),
    
  cleanBuilds: (gameId, platforms) => 
    api.delete(`/build/${gameId}`, { data: { platforms } }),
    
  getBuildStats: (gameId) => 
    api.get(`/build/${gameId}/stats`)
};

// GitHub Service
export const githubService = {
  startAuth: () => 
    api.get('/github/auth'),
    
  handleAuthCallback: (code, state) => 
    api.post('/github/auth/callback', { code, state }),
    
  createRepo: (gameId, userId, repoName, description, isPrivate = false) => 
    api.post('/github/create-repo', { gameId, userId, repoName, description, isPrivate }),
    
  pushUpdates: (gameId, userId, repoName, commitMessage) => 
    api.post('/github/push-updates', { gameId, userId, repoName, commitMessage }),
    
  getRepos: (userId) => 
    api.get(`/github/repos/${userId}`),
    
  getAuthStatus: (userId) => 
    api.get(`/github/auth/status/${userId}`),
    
  revokeAuth: (userId) => 
    api.delete(`/github/auth/${userId}`)
};

// Utility functions
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default api;