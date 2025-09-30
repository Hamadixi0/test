const request = require('supertest');
const app = require('./index');

describe('AI Game Builder API', () => {
  test('Health check endpoint', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);
    
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
  });

  test('Games list endpoint', async () => {
    const res = await request(app)
      .get('/api/games')
      .expect(200);
    
    expect(res.body.games).toBeDefined();
    expect(Array.isArray(res.body.games)).toBe(true);
  });

  test('Builds list endpoint', async () => {
    const res = await request(app)
      .get('/api/build')
      .expect(200);
    
    expect(res.body.builds).toBeDefined();
    expect(Array.isArray(res.body.builds)).toBe(true);
  });
});

// Mock tests for services without requiring actual API keys
describe('Service Integration', () => {
  test('Game generator service exists', () => {
    const gameGeneratorService = require('./services/gameGeneratorService');
    expect(gameGeneratorService).toBeDefined();
    expect(typeof gameGeneratorService.generateGame).toBe('function');
  });

  test('AI service exists', () => {
    const aiService = require('./services/aiService');
    expect(aiService).toBeDefined();
    expect(typeof aiService.initializeGameConversation).toBe('function');
  });
});