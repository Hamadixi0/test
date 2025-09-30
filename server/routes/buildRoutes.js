const express = require('express');
const router = express.Router();
const gameGeneratorService = require('../services/gameGeneratorService');
const path = require('path');
const fs = require('fs-extra');

// Build game for specific platforms
router.post('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { platforms = ['web'] } = req.body;
    
    const gameDir = path.join(__dirname, '../../generated-games', gameId);
    
    if (!await fs.pathExists(gameDir)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log(`Building game ${gameId} for platforms: ${platforms.join(', ')}`);
    
    const builds = await gameGeneratorService.createGameBuild(gameId, platforms);
    
    res.json({
      success: true,
      gameId,
      builds,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error building game:', error);
    res.status(500).json({ 
      error: 'Failed to build game',
      details: error.message 
    });
  }
});

// Get build status/info
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const buildsDir = path.join(__dirname, '../../builds');
    
    const buildInfo = {
      gameId,
      availableBuilds: [],
      buildDirectory: buildsDir
    };

    if (await fs.pathExists(buildsDir)) {
      const buildFiles = await fs.readdir(buildsDir);
      
      for (const file of buildFiles) {
        if (file.startsWith(gameId)) {
          const filePath = path.join(buildsDir, file);
          const stats = await fs.stat(filePath);
          
          let platform = 'unknown';
          if (file.includes('-web')) platform = 'web';
          else if (file.includes('-pc')) platform = 'pc';
          else if (file.includes('-mobile')) platform = 'mobile';
          
          buildInfo.availableBuilds.push({
            platform,
            fileName: file,
            size: stats.size,
            createdAt: stats.birthtime,
            downloadUrl: `/api/build/${gameId}/download/${platform}`
          });
        }
      }
    }
    
    res.json(buildInfo);
  } catch (error) {
    console.error('Error getting build info:', error);
    res.status(500).json({ error: 'Failed to get build information' });
  }
});

// Download specific build
router.get('/:gameId/download/:platform', async (req, res) => {
  try {
    const { gameId, platform } = req.params;
    const buildsDir = path.join(__dirname, '../../builds');
    
    const buildFileName = `${gameId}-${platform}.zip`;
    const buildPath = path.join(buildsDir, buildFileName);
    
    if (!await fs.pathExists(buildPath)) {
      return res.status(404).json({ error: 'Build not found' });
    }

    // Get game name for better filename
    let downloadName = buildFileName;
    try {
      const gameDir = path.join(__dirname, '../../generated-games', gameId);
      const gameSpecPath = path.join(gameDir, 'game.json');
      
      if (await fs.pathExists(gameSpecPath)) {
        const gameSpec = await fs.readJson(gameSpecPath);
        const title = gameSpec.title || 'Untitled Game';
        downloadName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${platform}.zip`;
      }
    } catch (error) {
      console.warn('Could not get game title for download:', error.message);
    }
    
    res.download(buildPath, downloadName);
  } catch (error) {
    console.error('Error downloading build:', error);
    res.status(500).json({ error: 'Failed to download build' });
  }
});

// Clean up old builds
router.delete('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { platforms } = req.body; // Optional: specify which platforms to clean
    
    const buildsDir = path.join(__dirname, '../../builds');
    
    if (!await fs.pathExists(buildsDir)) {
      return res.json({ success: true, cleaned: [] });
    }

    const buildFiles = await fs.readdir(buildsDir);
    const cleaned = [];
    
    for (const file of buildFiles) {
      if (file.startsWith(gameId)) {
        // If platforms specified, only delete those platforms
        if (platforms && platforms.length > 0) {
          const matchesPlatform = platforms.some(platform => 
            file.includes(`-${platform}`)
          );
          if (!matchesPlatform) continue;
        }
        
        const filePath = path.join(buildsDir, file);
        await fs.remove(filePath);
        cleaned.push(file);
      }
    }
    
    res.json({
      success: true,
      gameId,
      cleaned,
      message: `Cleaned ${cleaned.length} build files`
    });
  } catch (error) {
    console.error('Error cleaning builds:', error);
    res.status(500).json({ error: 'Failed to clean builds' });
  }
});

// List all builds
router.get('/', async (req, res) => {
  try {
    const buildsDir = path.join(__dirname, '../../builds');
    const builds = [];
    
    if (await fs.pathExists(buildsDir)) {
      const buildFiles = await fs.readdir(buildsDir);
      
      for (const file of buildFiles) {
        if (file.endsWith('.zip')) {
          const filePath = path.join(buildsDir, file);
          const stats = await fs.stat(filePath);
          
          // Parse gameId and platform from filename
          const parts = file.replace('.zip', '').split('-');
          const gameId = parts[0];
          const platform = parts.slice(1).join('-') || 'unknown';
          
          builds.push({
            gameId,
            platform,
            fileName: file,
            size: stats.size,
            createdAt: stats.birthtime,
            downloadUrl: `/api/build/${gameId}/download/${platform}`
          });
        }
      }
    }
    
    // Sort by creation date, newest first
    builds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      builds,
      total: builds.length
    });
  } catch (error) {
    console.error('Error listing builds:', error);
    res.status(500).json({ error: 'Failed to list builds' });
  }
});

// Build statistics
router.get('/:gameId/stats', async (req, res) => {
  try {
    const { gameId } = req.params;
    const buildsDir = path.join(__dirname, '../../builds');
    
    const stats = {
      gameId,
      totalBuilds: 0,
      platforms: {},
      totalSize: 0,
      lastBuildDate: null
    };

    if (await fs.pathExists(buildsDir)) {
      const buildFiles = await fs.readdir(buildsDir);
      
      for (const file of buildFiles) {
        if (file.startsWith(gameId) && file.endsWith('.zip')) {
          const filePath = path.join(buildsDir, file);
          const fileStats = await fs.stat(filePath);
          
          stats.totalBuilds++;
          stats.totalSize += fileStats.size;
          
          if (!stats.lastBuildDate || fileStats.birthtime > stats.lastBuildDate) {
            stats.lastBuildDate = fileStats.birthtime;
          }
          
          // Extract platform
          const platform = file.includes('-web') ? 'web' : 
                          file.includes('-pc') ? 'pc' : 
                          file.includes('-mobile') ? 'mobile' : 'unknown';
          
          if (!stats.platforms[platform]) {
            stats.platforms[platform] = { count: 0, size: 0 };
          }
          
          stats.platforms[platform].count++;
          stats.platforms[platform].size += fileStats.size;
        }
      }
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting build stats:', error);
    res.status(500).json({ error: 'Failed to get build statistics' });
  }
});

module.exports = router;