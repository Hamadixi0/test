const OpenAI = require('openai');

class AIService {
  constructor() {
    // Only initialize OpenAI if API key is provided
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OpenAI API key not provided. AI functionality will be disabled.');
      this.openai = null;
    }
    this.conversationHistory = new Map();
  }

  async initializeGameConversation(sessionId) {
    const systemPrompt = `You are an expert AI Game Builder assistant. Your role is to guide users through creating full 2D, 2.5D, or 3D games through conversation.

Your responsibilities:
1. Guide users through game creation choices:
   - Genre (RPG, Platformer, Puzzle, Action, Strategy, etc.)
   - Core mechanics and gameplay loops
   - Story and narrative elements
   - Art style and visual direction
   - Target audience and difficulty
   - Multiple ending possibilities

2. Generate complete game specifications including:
   - Detailed game design document
   - Technical requirements and architecture
   - Asset requirements (sprites, models, sounds, music)
   - Level/map layouts and progression
   - Story beats and dialogue
   - Game logic and rules

3. Validate all game elements for:
   - Logical consistency
   - Technical feasibility
   - Player experience flow
   - Asset completeness

4. Always ask clarifying questions to understand user preferences
5. Provide multiple options when possible
6. Explain technical implications of choices
7. Ensure all paths lead to a complete, playable game

Start by greeting the user and asking what type of game they'd like to create.`;

    this.conversationHistory.set(sessionId, [
      { role: 'system', content: systemPrompt }
    ]);

    return this.generateResponse(sessionId, "Hello! I'm your AI Game Builder assistant. I'll help you create a complete game through our conversation. What type of game would you like to build today? Are you thinking of a 2D platformer, a 3D adventure, an RPG, a puzzle game, or something else entirely?");
  }

  async processUserMessage(sessionId, message) {
    if (!this.openai) {
      return {
        response: "AI service is not available. Please configure OPENAI_API_KEY environment variable.",
        type: 'error',
        sessionId
      };
    }

    if (!this.conversationHistory.has(sessionId)) {
      await this.initializeGameConversation(sessionId);
    }

    const history = this.conversationHistory.get(sessionId);
    history.push({ role: 'user', content: message });

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: history,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content;
      history.push({ role: 'assistant', content: aiResponse });

      // Keep conversation history manageable
      if (history.length > 50) {
        const systemMessage = history[0];
        const recentMessages = history.slice(-48);
        this.conversationHistory.set(sessionId, [systemMessage, ...recentMessages]);
      }

      return this.generateResponse(sessionId, aiResponse);
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        response: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        type: 'error',
        sessionId
      };
    }
  }

  async generateGameSpecification(sessionId) {
    if (!this.openai) {
      throw new Error('AI service is not available. Please configure OPENAI_API_KEY environment variable.');
    }

    const history = this.conversationHistory.get(sessionId);
    if (!history) {
      throw new Error('No conversation history found');
    }

    const specPrompt = `Based on our conversation, generate a complete game specification in JSON format with the following structure:
{
  "title": "Game Title",
  "genre": "Primary Genre",
  "dimension": "2D/2.5D/3D",
  "targetAudience": "Age group and player type",
  "artStyle": "Visual style description",
  "coreGameplay": {
    "mechanics": ["mechanic1", "mechanic2"],
    "objectives": "Primary game objectives",
    "progression": "How players progress"
  },
  "story": {
    "premise": "Basic story setup",
    "mainCharacter": "Protagonist description",
    "setting": "World/environment description",
    "keyEvents": ["event1", "event2"],
    "endings": ["ending1", "ending2"]
  },
  "technical": {
    "platform": ["Web", "PC", "Mobile"],
    "engine": "Recommended game engine",
    "resolution": "Target resolution",
    "performance": "Performance requirements"
  },
  "assets": {
    "sprites": ["required sprites"],
    "models": ["required 3D models"],
    "sounds": ["required sound effects"],
    "music": ["required music tracks"],
    "ui": ["UI elements needed"]
  },
  "levels": [
    {
      "name": "Level 1",
      "description": "Level description",
      "objectives": ["objective1"],
      "enemies": ["enemy types"],
      "collectibles": ["collectible types"]
    }
  ]
}

Make sure all elements are consistent and create a complete, playable game concept.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          ...history,
          { role: 'user', content: specPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      });

      const specText = response.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = specText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to extract game specification JSON');
      }
    } catch (error) {
      console.error('Game specification generation error:', error);
      throw error;
    }
  }

  generateResponse(sessionId, response) {
    return {
      response,
      type: 'message',
      sessionId,
      timestamp: new Date().toISOString()
    };
  }

  getConversationHistory(sessionId) {
    return this.conversationHistory.get(sessionId) || [];
  }

  clearConversation(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

module.exports = new AIService();