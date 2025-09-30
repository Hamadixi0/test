const express = require('express');
const router = express.Router();
const gameGeneratorService = require('../services/gameGeneratorService');
const path = require('path');
const fs = require('fs-extra');

// Generate a new game from specification
router.post('/generate', async (req, res) => {
  try {
    const { gameSpec, sessionId } = req.body;
    
    if (!gameSpec) {
      return res.status(400).json({ error: 'Game specification is required' });
    }

    console.log(`Generating game: ${gameSpec.title || 'Untitled'}`);
    
    const result = await gameGeneratorService.generateGame(gameSpec);
    
    res.json({
      success: true,
      gameId: result.gameId,
      sessionId,
      validation: result.validation,
      message: 'Game generated successfully',
      playUrl: `/api/games/${result.gameId}/play`,
      downloadUrl: `/api/games/${result.gameId}/download`
    });
  } catch (error) {
    console.error('Error generating game:', error);
    res.status(500).json({ 
      error: 'Failed to generate game',
      details: error.message 
    });
  }
});

// Get game information
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameDir = path.join(__dirname, '../../generated-games', gameId);
    
    if (!await fs.pathExists(gameDir)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameSpecPath = path.join(gameDir, 'game.json');
    const packagePath = path.join(gameDir, 'package.json');
    
    const gameSpec = await fs.readJson(gameSpecPath);
    const packageInfo = await fs.readJson(packagePath);
    
    const stats = await fs.stat(gameDir);
    
    res.json({
      gameId,
      title: gameSpec.title,
      genre: gameSpec.genre,
      dimension: gameSpec.dimension,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      specification: gameSpec,
      package: packageInfo,
      playUrl: `/api/games/${gameId}/play`,
      downloadUrl: `/api/games/${gameId}/download`
    });
  } catch (error) {
    console.error('Error getting game info:', error);
    res.status(500).json({ error: 'Failed to get game information' });
  }
});

// List all generated games
router.get('/', async (req, res) => {
  try {
    const gamesDir = path.join(__dirname, '../../generated-games');
    
    if (!await fs.pathExists(gamesDir)) {
      return res.json({ games: [] });
    }

    const gameIds = await fs.readdir(gamesDir);
    const games = [];
    
    for (const gameId of gameIds) {
      try {
        const gameDir = path.join(gamesDir, gameId);
        const stats = await fs.stat(gameDir);
        
        if (stats.isDirectory()) {
          const gameSpecPath = path.join(gameDir, 'game.json');
          
          if (await fs.pathExists(gameSpecPath)) {
            const gameSpec = await fs.readJson(gameSpecPath);
            
            games.push({
              gameId,
              title: gameSpec.title,
              genre: gameSpec.genre,
              dimension: gameSpec.dimension,
              createdAt: stats.birthtime,
              modifiedAt: stats.mtime,
              playUrl: `/api/games/${gameId}/play`,
              downloadUrl: `/api/games/${gameId}/download`
            });
          }
        }
      } catch (error) {
        console.error(`Error processing game ${gameId}:`, error);
        // Skip this game and continue
      }
    }
    
    // Sort by creation date, newest first
    games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      games,
      total: games.length
    });
  } catch (error) {
    console.error('Error listing games:', error);
    res.status(500).json({ error: 'Failed to list games' });
  }
});

// Play a game (serve game files)
router.get('/:gameId/play', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameDir = path.join(__dirname, '../../generated-games', gameId);
    const indexPath = path.join(gameDir, 'index.html');
    
    if (!await fs.pathExists(indexPath)) {
      return res.status(404).json({ error: 'Game not found or not playable' });
    }

    // Serve the game's index.html file
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving game:', error);
    res.status(500).json({ error: 'Failed to serve game' });
  }
});

// Serve game assets
router.get('/:gameId/assets/*', async (req, res) => {
  try {
    const { gameId } = req.params;
    const assetPath = req.params[0];
    const fullPath = path.join(__dirname, '../../generated-games', gameId, 'assets', assetPath);
    
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.sendFile(fullPath);
  } catch (error) {
    console.error('Error serving asset:', error);
    res.status(500).json({ error: 'Failed to serve asset' });
  }
});

// Serve game source files
router.get('/:gameId/src/*', async (req, res) => {
  try {
    const { gameId } = req.params;
    const srcPath = req.params[0];
    const fullPath = path.join(__dirname, '../../generated-games', gameId, 'src', srcPath);
    
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Source file not found' });
    }

    res.sendFile(fullPath);
  } catch (error) {
    console.error('Error serving source file:', error);
    res.status(500).json({ error: 'Failed to serve source file' });
  }
});

// Download game as zip
router.get('/:gameId/download', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameDir = path.join(__dirname, '../../generated-games', gameId);
    
    if (!await fs.pathExists(gameDir)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Create a temporary zip file
    const buildsDir = path.join(__dirname, '../../builds');
    await fs.ensureDir(buildsDir);
    
    const zipPath = path.join(buildsDir, `${gameId}.zip`);
    
    // Use the game generator service to create the zip
    await gameGeneratorService.createZipArchive(gameDir, zipPath);
    
    // Get game info for filename
    const gameSpecPath = path.join(gameDir, 'game.json');
    let filename = `${gameId}.zip`;
    
    if (await fs.pathExists(gameSpecPath)) {
      const gameSpec = await fs.readJson(gameSpecPath);
      const title = gameSpec.title || 'Untitled Game';
      filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
    }
    
    res.download(zipPath, filename, (error) => {
      if (error) {
        console.error('Download error:', error);
      }
      // Clean up temp file
      fs.remove(zipPath).catch(console.error);
    });
  } catch (error) {
    console.error('Error creating download:', error);
    res.status(500).json({ error: 'Failed to create download' });
  }
});

// Delete a game
router.delete('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameDir = path.join(__dirname, '../../generated-games', gameId);
    
    if (!await fs.pathExists(gameDir)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    await fs.remove(gameDir);
    
    res.json({
      success: true,
      message: 'Game deleted successfully',
      gameId
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// Validate a game
router.post('/:gameId/validate', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameDir = path.join(__dirname, '../../generated-games', gameId);
    
    if (!await fs.pathExists(gameDir)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameSpecPath = path.join(gameDir, 'game.json');
    const gameSpec = await fs.readJson(gameSpecPath);
    
    const validation = await gameGeneratorService.validateGame(gameDir, gameSpec);
    
    res.json({
      gameId,
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error validating game:', error);
    res.status(500).json({ error: 'Failed to validate game' });
  }
});

module.exports = router;