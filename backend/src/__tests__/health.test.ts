import request from 'supertest';
import express from 'express';
import healthRoutes from '../routes/health';

const app = express();
app.use('/health', healthRoutes);

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'ok',
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          version: expect.any(String),
          environment: expect.any(String),
        },
      });
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/health/detailed');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
      
      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: expect.any(String),
          timestamp: expect.any(String),
          checks: {
            database: expect.any(Boolean),
            redis: expect.any(Boolean),
            storage: expect.any(Boolean),
          },
          uptime: expect.any(Number),
          memory: expect.any(Object),
          version: expect.any(String),
        },
      });
    });
  });
});