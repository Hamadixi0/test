#!/usr/bin/env node

/**
 * Simple Demo Backend for AI Game Builder Platform
 * This is a minimal implementation for demonstration purposes
 */

const http = require('http');
const url = require('url');

// Mock data storage
const users = new Map();
const projects = new Map();

// Simple JWT implementation (for demo only)
function createToken(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch (error) {
    return null;
  }
}

// CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JSON response helper
function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data, null, 2));
}

// Request body parser
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Route handlers
const routes = {
  // Health check
  'GET /health': (req, res) => {
    sendJSON(res, 200, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  },

  // Demo login
  'POST /api/auth/demo-login': (req, res) => {
    parseBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON' });

      const { username } = body;
      if (!username || username.length < 3) {
        return sendJSON(res, 400, { error: 'Username must be at least 3 characters' });
      }

      const user = {
        id: `demo_${Date.now()}`,
        username,
        email: `${username}@demo.com`,
        avatar_url: `https://ui-avatars.com/api/?name=${username}&background=007AFF&color=fff`
      };

      const token = createToken({ userId: user.id, username });
      users.set(user.id, user);

      sendJSON(res, 200, {
        success: true,
        token,
        user
      });
    });
  },

  // Get current user
  'GET /api/auth/me': (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendJSON(res, 401, { error: 'No token provided' });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendJSON(res, 401, { error: 'Invalid token' });
    }

    const user = users.get(decoded.userId);
    if (!user) {
      return sendJSON(res, 404, { error: 'User not found' });
    }

    sendJSON(res, 200, { user });
  },

  // List projects
  'GET /api/projects': (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendJSON(res, 401, { error: 'No token provided' });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendJSON(res, 401, { error: 'Invalid token' });
    }

    const userProjects = Array.from(projects.values())
      .filter(project => project.userId === decoded.userId);

    sendJSON(res, 200, { projects: userProjects });
  },

  // Create project
  'POST /api/projects': (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendJSON(res, 401, { error: 'No token provided' });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendJSON(res, 401, { error: 'Invalid token' });
    }

    parseBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON' });

      const { name, description, gameType, engine, prompt } = body;

      // Simple validation
      if (!name || !gameType || !engine || !prompt) {
        return sendJSON(res, 400, { error: 'Missing required fields' });
      }

      const project = {
        id: `proj_${Date.now()}`,
        userId: decoded.userId,
        name,
        description: description || '',
        gameType,
        engine,
        prompt,
        status: 'initializing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assets: {
          code: [],
          art2D: [],
          art3D: [],
          audio: [],
          shaders: [],
          levels: [],
          ui: []
        }
      };

      projects.set(project.id, project);

      // Simulate AI generation progress
      setTimeout(() => {
        project.status = 'completed';
        project.preview = {
          webgl_url: `https://demo.aigamebuilder.com/play/${project.id}`,
          screenshot: `https://demo.aigamebuilder.com/screenshots/${project.id}.png`
        };
        projects.set(project.id, project);
      }, 3000);

      sendJSON(res, 201, {
        success: true,
        project,
        message: 'Project created successfully. AI generation will begin shortly.'
      });
    });
  }
};

// Server
const server = http.createServer((req, res) => {
  setCORSHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const routeKey = `${req.method} ${parsedUrl.pathname}`;

  console.log(`${new Date().toISOString()} - ${routeKey}`);

  if (routes[routeKey]) {
    routes[routeKey](req, res);
  } else {
    sendJSON(res, 404, { error: 'Route not found' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('🚀 AI Game Builder Platform Demo Backend');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log('📱 Ready for frontend connections');
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health                 - Health check');
  console.log('  POST /api/auth/demo-login    - Demo login');
  console.log('  GET  /api/auth/me            - Get current user');
  console.log('  GET  /api/projects           - List projects');
  console.log('  POST /api/projects           - Create project');
});