const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

// Store user tokens (in production, use secure storage)
const userTokens = new Map();

// GitHub OAuth - Start authentication
router.get('/auth', (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({ error: 'GitHub OAuth not configured' });
  }

  const state = Math.random().toString(36).substring(7);
  const scopes = 'repo,user:email';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${scopes}&state=${state}`;
  
  // Store state for validation (in production, use secure session storage)
  req.session = req.session || {};
  req.session.githubState = state;
  
  res.json({ authUrl });
});

// GitHub OAuth - Handle callback
router.post('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: GITHUB_REDIRECT_URI,
      state: state
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to get access token' });
    }

    // Get user information
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'AI-Game-Builder'
      }
    });

    const userId = userResponse.data.id;
    const username = userResponse.data.login;
    
    // Store token (in production, encrypt and store securely)
    userTokens.set(userId, {
      accessToken,
      username,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      user: {
        id: userId,
        username: username,
        avatar_url: userResponse.data.avatar_url
      }
    });
  } catch (error) {
    console.error('GitHub auth error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'GitHub authentication failed',
      details: error.response?.data?.error_description || error.message
    });
  }
});

// Create GitHub repository for a game
router.post('/create-repo', async (req, res) => {
  try {
    const { gameId, userId, repoName, description, isPrivate = false } = req.body;
    
    if (!gameId || !userId || !repoName) {
      return res.status(400).json({ error: 'Game ID, user ID, and repository name are required' });
    }

    const userToken = userTokens.get(parseInt(userId));
    if (!userToken) {
      return res.status(401).json({ error: 'User not authenticated with GitHub' });
    }

    // Create repository
    const repoResponse = await axios.post('https://api.github.com/user/repos', {
      name: repoName,
      description: description || `Game created with AI Game Builder`,
      private: isPrivate,
      auto_init: true,
      gitignore_template: 'Node'
    }, {
      headers: {
        'Authorization': `token ${userToken.accessToken}`,
        'User-Agent': 'AI-Game-Builder',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const repo = repoResponse.data;
    
    // Upload game files to repository
    await uploadGameToRepo(gameId, userToken.accessToken, userToken.username, repoName);
    
    res.json({
      success: true,
      repository: {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        private: repo.private
      }
    });
  } catch (error) {
    console.error('GitHub repo creation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create GitHub repository',
      details: error.response?.data?.message || error.message
    });
  }
});

// Push updates to existing repository
router.post('/push-updates', async (req, res) => {
  try {
    const { gameId, userId, repoName, commitMessage = 'Update game files' } = req.body;
    
    if (!gameId || !userId || !repoName) {
      return res.status(400).json({ error: 'Game ID, user ID, and repository name are required' });
    }

    const userToken = userTokens.get(parseInt(userId));
    if (!userToken) {
      return res.status(401).json({ error: 'User not authenticated with GitHub' });
    }

    // Upload updated game files
    const uploadResult = await uploadGameToRepo(gameId, userToken.accessToken, userToken.username, repoName, commitMessage);
    
    res.json({
      success: true,
      message: 'Game files updated successfully',
      commitMessage,
      filesUpdated: uploadResult.filesUpdated
    });
  } catch (error) {
    console.error('GitHub push error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to push updates to GitHub',
      details: error.response?.data?.message || error.message
    });
  }
});

// Get user's repositories
router.get('/repos/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userToken = userTokens.get(parseInt(userId));
    if (!userToken) {
      return res.status(401).json({ error: 'User not authenticated with GitHub' });
    }

    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${userToken.accessToken}`,
        'User-Agent': 'AI-Game-Builder'
      },
      params: {
        sort: 'updated',
        per_page: 50
      }
    });

    const repos = reposResponse.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      private: repo.private,
      updated_at: repo.updated_at,
      created_at: repo.created_at
    }));

    res.json({ repositories: repos });
  } catch (error) {
    console.error('GitHub repos error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get repositories',
      details: error.response?.data?.message || error.message
    });
  }
});

// Check authentication status
router.get('/auth/status/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userToken = userTokens.get(parseInt(userId));
    
    if (userToken) {
      res.json({
        authenticated: true,
        username: userToken.username,
        authenticatedAt: userToken.createdAt
      });
    } else {
      res.json({
        authenticated: false
      });
    }
  } catch (error) {
    console.error('Auth status error:', error);
    res.status(500).json({ error: 'Failed to check authentication status' });
  }
});

// Revoke GitHub authentication
router.delete('/auth/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    userTokens.delete(parseInt(userId));
    
    res.json({
      success: true,
      message: 'GitHub authentication revoked'
    });
  } catch (error) {
    console.error('Auth revoke error:', error);
    res.status(500).json({ error: 'Failed to revoke authentication' });
  }
});

// Helper function to upload game files to GitHub repository
async function uploadGameToRepo(gameId, accessToken, username, repoName, commitMessage = 'Add game files') {
  const gameDir = path.join(__dirname, '../../generated-games', gameId);
  
  if (!await fs.pathExists(gameDir)) {
    throw new Error('Game not found');
  }

  const filesUploaded = [];
  
  // Get all files recursively
  const files = await getAllFiles(gameDir);
  
  for (const filePath of files) {
    const relativePath = path.relative(gameDir, filePath);
    const content = await fs.readFile(filePath);
    const base64Content = content.toString('base64');
    
    try {
      // Check if file exists to get SHA for updates
      let sha = null;
      try {
        const existingFile = await axios.get(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, {
          headers: {
            'Authorization': `token ${accessToken}`,
            'User-Agent': 'AI-Game-Builder'
          }
        });
        sha = existingFile.data.sha;
      } catch (error) {
        // File doesn't exist, that's okay
      }

      // Upload/update file
      const uploadData = {
        message: commitMessage,
        content: base64Content
      };
      
      if (sha) {
        uploadData.sha = sha;
      }

      await axios.put(`https://api.github.com/repos/${username}/${repoName}/contents/${relativePath}`, uploadData, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'User-Agent': 'AI-Game-Builder',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      filesUploaded.push(relativePath);
    } catch (error) {
      console.error(`Failed to upload ${relativePath}:`, error.response?.data || error.message);
      // Continue with other files
    }
  }
  
  return { filesUpdated: filesUploaded };
}

// Helper function to get all files recursively
async function getAllFiles(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const items = await fs.readdir(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        await scan(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

module.exports = router;