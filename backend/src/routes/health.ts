import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database';
import { RedisService } from '../services/redis';

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

    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
    });
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

    // Check database connection
    try {
      await DatabaseService.healthCheck();
      checks.database = true;
    } catch (error) {
      // Database check failed
    }

    // Check Redis connection
    try {
      await RedisService.healthCheck();
      checks.redis = true;
    } catch (error) {
      // Redis check failed
    }

    // Check AWS S3 (basic check)
    checks.storage = process.env.AWS_ACCESS_KEY_ID ? true : false;

    const allHealthy = Object.values(checks).every(check => check);
    const status = allHealthy ? 'ok' : 'degraded';

    res.status(allHealthy ? 200 : 503).json({
      status,
      timestamp: new Date().toISOString(),
      checks,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Detailed health check failed',
    });
  }
});

export default router;