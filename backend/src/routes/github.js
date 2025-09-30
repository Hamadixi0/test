const express = require('express');
// Simple validation helpers
const validateCreateRepo = (req, res, next) => {
  const { projectId, repoName } = req.body;
  
  if (!projectId || !projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    return res.status(400).json({ error: 'Valid project ID required' });
  }
  
  if (!repoName || repoName.length < 1 || repoName.length > 100) {
    return res.status(400).json({ error: 'Repository name required' });
  }
  
  next();
};

const validatePush = (req, res, next) => {
  const { projectId, repoUrl, commitMessage } = req.body;
  
  if (!projectId || !projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    return res.status(400).json({ error: 'Valid project ID required' });
  }
  
  if (!repoUrl || !repoUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'Valid repository URL required' });
  }
  
  if (!commitMessage || commitMessage.length < 1 || commitMessage.length > 200) {
    return res.status(400).json({ error: 'Commit message required' });
  }
  
  next();
};
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// Create GitHub repository for project
router.post('/create-repo', validateCreateRepo, async (req, res) => {

  const { projectId, repoName, description, private: isPrivate = true } = req.body;

  // Mock GitHub repository creation
  const mockRepo = {
    id: `repo_${Date.now()}`,
    name: repoName,
    full_name: `${req.user.username}/${repoName}`,
    description: description || 'AI-generated game project',
    private: isPrivate,
    html_url: `https://github.com/${req.user.username}/${repoName}`,
    clone_url: `https://github.com/${req.user.username}/${repoName}.git`,
    created_at: new Date().toISOString(),
    default_branch: 'main'
  };

  logger.info(`Mock GitHub repository created: ${mockRepo.full_name}`);

  res.json({
    success: true,
    repository: mockRepo,
    message: 'GitHub repository created successfully'
  });
});

// Push project files to GitHub
router.post('/push', validatePush, async (req, res) => {

  const { projectId, repoUrl, commitMessage } = req.body;

  // Mock git push operation
  const pushResult = {
    commitHash: `commit_${Date.now().toString(36)}`,
    branch: 'main',
    filesAdded: [
      'Assets/Scripts/GameManager.cs',
      'Assets/Sprites/player.png',
      'Assets/Audio/background.wav',
      'Assets/Scenes/MainScene.unity',
      'ProjectSettings/ProjectVersion.txt',
      'README.md'
    ],
    timestamp: new Date().toISOString()
  };

  logger.info(`Mock git push to ${repoUrl}: ${commitMessage}`);

  res.json({
    success: true,
    push: pushResult,
    message: 'Project files pushed to GitHub successfully'
  });
});

// Create GitHub release
router.post('/release', [
  body('projectId').isUUID().withMessage('Valid project ID required'),
  body('repoUrl').isURL().withMessage('Valid repository URL required'),
  body('version').matches(/^\d+\.\d+\.\d+$/).withMessage('Version must be in semantic format (x.y.z)'),
  body('title').isLength({ min: 1, max: 100 }).withMessage('Release title required'),
  body('description').optional().isLength({ max: 1000 }),
  body('builds').isArray().withMessage('Builds array required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId, repoUrl, version, title, description, builds } = req.body;

  // Mock GitHub release creation
  const mockRelease = {
    id: `release_${Date.now()}`,
    tag_name: `v${version}`,
    name: title,
    body: description || 'Automated release from AI Game Builder Platform',
    draft: false,
    prerelease: false,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    html_url: `${repoUrl}/releases/tag/v${version}`,
    assets: builds.map((build, index) => ({
      id: `asset_${Date.now()}_${index}`,
      name: build.filename || `game-${build.platform}-v${version}.${build.extension || 'zip'}`,
      size: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
      download_count: 0,
      browser_download_url: `https://github.com/${req.user.username}/mock-repo/releases/download/v${version}/${build.filename}`
    }))
  };

  logger.info(`Mock GitHub release created: ${mockRelease.tag_name}`);

  res.json({
    success: true,
    release: mockRelease,
    message: 'GitHub release created successfully'
  });
});

// Get repository information
router.get('/repo/:repoName', (req, res) => {
  const { repoName } = req.params;
  
  // Mock repository information
  const mockRepoInfo = {
    name: repoName,
    full_name: `${req.user.username}/${repoName}`,
    description: 'AI-generated game project',
    private: true,
    html_url: `https://github.com/${req.user.username}/${repoName}`,
    clone_url: `https://github.com/${req.user.username}/${repoName}.git`,
    size: Math.floor(Math.random() * 10000) + 1000, // 1-11MB
    stargazers_count: Math.floor(Math.random() * 100),
    watchers_count: Math.floor(Math.random() * 50),
    forks_count: Math.floor(Math.random() * 20),
    default_branch: 'main',
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString()
  };

  res.json({ repository: mockRepoInfo });
});

// Get repository commits
router.get('/repo/:repoName/commits', (req, res) => {
  const { repoName } = req.params;
  
  // Mock commit history
  const mockCommits = [
    {
      sha: `commit_${Date.now().toString(36)}`,
      commit: {
        message: 'Initial game generation complete',
        author: {
          name: 'AI Game Builder',
          email: 'ai@gamebuilder.com',
          date: new Date().toISOString()
        }
      },
      html_url: `https://github.com/${req.user.username}/${repoName}/commit/abc123`
    },
    {
      sha: `commit_${(Date.now() - 3600000).toString(36)}`,
      commit: {
        message: 'Add player controller and basic mechanics',
        author: {
          name: 'AI Code Agent',
          email: 'code@gamebuilder.com',
          date: new Date(Date.now() - 3600000).toISOString()
        }
      },
      html_url: `https://github.com/${req.user.username}/${repoName}/commit/def456`
    }
  ];

  res.json({ commits: mockCommits });
});

// Sync project with GitHub
router.post('/sync', [
  body('projectId').isUUID().withMessage('Valid project ID required'),
  body('repoUrl').isURL().withMessage('Valid repository URL required')
], async (req, res) => {
  const { projectId, repoUrl } = req.body;

  // Mock sync operation
  const syncResult = {
    status: 'success',
    filesUpdated: [
      'Assets/Scripts/PlayerController.cs',
      'Assets/Scenes/Level1.unity'
    ],
    filesAdded: [
      'Assets/Audio/powerup.wav'
    ],
    filesDeleted: [],
    lastSync: new Date().toISOString()
  };

  res.json({
    success: true,
    sync: syncResult,
    message: 'Project synced with GitHub successfully'
  });
});

module.exports = router;