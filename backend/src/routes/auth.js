const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Note: express-validator would be used in production
// For demo purposes, we'll do simple validation
const logger = require('../utils/logger');

const router = express.Router();

// Mock user store (in production, this would be a database)
const users = new Map();

// GitHub OAuth placeholder (to be implemented with actual OAuth)
router.get('/github', (req, res) => {
  // In production, redirect to GitHub OAuth
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user:email`;
  res.json({ 
    message: 'GitHub OAuth integration placeholder',
    authUrl: githubAuthUrl,
    instructions: 'This would redirect to GitHub OAuth in production'
  });
});

// GitHub OAuth callback placeholder
router.get('/github/callback', (req, res) => {
  // In production, handle GitHub OAuth callback
  const { code } = req.query;
  
  // Mock successful authentication
  const mockUser = {
    id: 'github_123',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar_url: 'https://github.com/identicons/demo.png',
    github_token: 'mock_github_token'
  };

  const token = jwt.sign(
    { userId: mockUser.id, username: mockUser.username },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  users.set(mockUser.id, mockUser);

  res.json({
    success: true,
    token,
    user: {
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      avatar_url: mockUser.avatar_url
    }
  });
});

// Demo login for development
router.post('/demo-login', (req, res) => {
  // Simple validation
  if (!req.body.username || req.body.username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  const { username } = req.body;
  
  const demoUser = {
    id: `demo_${Date.now()}`,
    username,
    email: `${username}@demo.com`,
    avatar_url: `https://ui-avatars.com/api/?name=${username}&background=007AFF&color=fff`,
    github_token: 'demo_token'
  };

  const token = jwt.sign(
    { userId: demoUser.id, username: demoUser.username },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  users.set(demoUser.id, demoUser);

  logger.info(`Demo login for user: ${username}`);

  res.json({
    success: true,
    token,
    user: {
      id: demoUser.id,
      username: demoUser.username,
      email: demoUser.email,
      avatar_url: demoUser.avatar_url
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = users.get(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // In a production app, you might want to blacklist tokens
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;