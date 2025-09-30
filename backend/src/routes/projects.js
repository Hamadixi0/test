const express = require('express');
// Simple validation helper
const validateProject = (req, res, next) => {
  const { name, gameType, engine, prompt } = req.body;
  
  if (!name || name.length < 1 || name.length > 100) {
    return res.status(400).json({ error: 'Project name is required and must be less than 100 characters' });
  }
  
  if (!['2D', '2.5D', '3D'].includes(gameType)) {
    return res.status(400).json({ error: 'Game type must be 2D, 2.5D, or 3D' });
  }
  
  if (!['Unity', 'Godot'].includes(engine)) {
    return res.status(400).json({ error: 'Engine must be Unity or Godot' });
  }
  
  if (!prompt || prompt.length < 10 || prompt.length > 2000) {
    return res.status(400).json({ error: 'Game prompt must be between 10 and 2000 characters' });
  }
  
  next();
};
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mock project store (in production, this would be a database)
const projects = new Map();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all projects for authenticated user
router.get('/', (req, res) => {
  const userProjects = Array.from(projects.values())
    .filter(project => project.userId === req.user.userId)
    .map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      gameType: project.gameType,
      engine: project.engine,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      preview: project.preview
    }));

  res.json({ projects: userProjects });
});

// Get specific project
router.get('/:id', (req, res) => {
  const project = projects.get(req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (project.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({ project });
});

// Create new project
router.post('/', validateProject, async (req, res) => {

  const { name, description, gameType, engine, prompt } = req.body;
  
  const project = {
    id: uuidv4(),
    userId: req.user.userId,
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
    },
    builds: [],
    github: {
      repository: null,
      lastCommit: null
    },
    ai: {
      agents: [],
      currentTask: null,
      completed: []
    },
    settings: {
      targetPlatforms: ['WebGL'],
      qualityLevel: 'medium',
      multiplayer: false,
      maxPlayers: 1
    }
  };

  projects.set(project.id, project);

  // Emit to websocket for real-time updates
  const io = req.app.get('io');
  io.to(`project_${project.id}`).emit('project_created', { project });

  logger.info(`New project created: ${name} by user ${req.user.username}`);

  res.status(201).json({ 
    success: true, 
    project,
    message: 'Project created successfully. AI generation will begin shortly.'
  });

  // Trigger AI generation in the background
  setTimeout(() => {
    triggerAIGeneration(project.id, prompt, gameType, engine, io);
  }, 1000);
});

// Update project
router.put('/:id', (req, res) => {

  const project = projects.get(req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (project.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, description, settings } = req.body;
  
  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (settings) project.settings = { ...project.settings, ...settings };
  
  project.updatedAt = new Date().toISOString();
  projects.set(project.id, project);

  // Emit update
  const io = req.app.get('io');
  io.to(`project_${project.id}`).emit('project_updated', { project });

  res.json({ success: true, project });
});

// Delete project
router.delete('/:id', (req, res) => {
  const project = projects.get(req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (project.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  projects.delete(req.params.id);

  logger.info(`Project deleted: ${project.name} by user ${req.user.username}`);

  res.json({ success: true, message: 'Project deleted successfully' });
});

// Mock AI generation function
async function triggerAIGeneration(projectId, prompt, gameType, engine, io) {
  const project = projects.get(projectId);
  if (!project) return;

  // Simulate AI generation steps
  const steps = [
    { step: 'analyzing_prompt', message: 'Analyzing game concept...', progress: 10 },
    { step: 'generating_assets', message: 'Generating game assets...', progress: 30 },
    { step: 'creating_code', message: 'Writing game code...', progress: 50 },
    { step: 'building_levels', message: 'Designing levels...', progress: 70 },
    { step: 'optimizing', message: 'Optimizing performance...', progress: 90 },
    { step: 'completed', message: 'Game generation completed!', progress: 100 }
  ];

  for (const stepData of steps) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between steps
    
    project.status = stepData.step;
    project.updatedAt = new Date().toISOString();
    
    if (stepData.step === 'completed') {
      project.preview = {
        webgl_url: `https://demo.aigamebuilder.com/play/${projectId}`,
        screenshot: `https://demo.aigamebuilder.com/screenshots/${projectId}.png`
      };
    }
    
    projects.set(projectId, project);
    
    io.to(`project_${projectId}`).emit('generation_progress', {
      projectId,
      step: stepData.step,
      message: stepData.message,
      progress: stepData.progress,
      project
    });
  }
}

module.exports = router;