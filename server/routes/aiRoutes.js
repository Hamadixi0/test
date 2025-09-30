const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Initialize a new AI conversation session
router.post('/conversation/start', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const response = await aiService.initializeGameConversation(sessionId);
    res.json(response);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Process user message and get AI response
router.post('/conversation/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    const response = await aiService.processUserMessage(sessionId, message);
    res.json(response);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Generate complete game specification from conversation
router.post('/generate-specification', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const specification = await aiService.generateGameSpecification(sessionId);
    res.json({
      sessionId,
      specification,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating specification:', error);
    res.status(500).json({ error: 'Failed to generate game specification' });
  }
});

// Get conversation history
router.get('/conversation/:sessionId/history', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = aiService.getConversationHistory(sessionId);
    
    res.json({
      sessionId,
      history: history.filter(msg => msg.role !== 'system'), // Don't expose system prompts
      messageCount: history.length - 1 // Exclude system message
    });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
});

// Clear conversation history
router.delete('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    aiService.clearConversation(sessionId);
    
    res.json({
      success: true,
      message: 'Conversation cleared',
      sessionId
    });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    const testSessionId = 'health-check-' + Date.now();
    await aiService.initializeGameConversation(testSessionId);
    aiService.clearConversation(testSessionId);
    
    res.json({
      status: 'healthy',
      aiModel: process.env.AI_MODEL || 'gpt-4',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;