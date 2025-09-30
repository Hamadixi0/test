import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';

const router = Router();

// Basic health check
router.get('/', async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    const response: ApiResponse = {
      success: true,
      data: health,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Health check failed',
    };
    res.status(500).json(response);
  }
});

// Detailed health check with dependencies
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const checks = {
      database: false,
      redis: false,
      storage: false,
    };

    // Check database connection (placeholder)
    checks.database = true; // Will implement actual check later

    // Check Redis connection (placeholder)
    checks.redis = true; // Will implement actual check later

    // Check AWS S3 (basic check)
    checks.storage = process.env.AWS_ACCESS_KEY_ID ? true : false;

    const allHealthy = Object.values(checks).every(check => check);
    const status = allHealthy ? 'ok' : 'degraded';

    const response: ApiResponse = {
      success: true,
      data: {
        status,
        timestamp: new Date().toISOString(),
        checks,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0',
      },
    };

    res.status(allHealthy ? 200 : 503).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Detailed health check failed',
    };
    res.status(500).json(response);
  }
});

export default router;