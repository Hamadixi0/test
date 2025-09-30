import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../services/database';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get current user profile
router.get('/me', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        subscriptionTier: true,
        subscriptionEnd: true,
        preferences: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', [
  body('firstName').optional().trim().isLength({ max: 50 }),
  body('lastName').optional().trim().isLength({ max: 50 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('preferences').optional().isObject(),
], async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, bio, preferences } = req.body;

    const user = await db.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        bio,
        preferences,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        preferences: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update API keys (encrypted)
router.put('/api-keys', [
  body('openaiApiKey').optional().isString(),
  body('openrouterApiKey').optional().isString(),
  body('anthropicApiKey').optional().isString(),
], async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const { openaiApiKey, openrouterApiKey, anthropicApiKey } = req.body;

    // TODO: Encrypt API keys before storing
    // For now, we'll store them as-is (not recommended for production)
    
    await db.user.update({
      where: { id: req.user!.id },
      data: {
        openaiApiKey,
        openrouterApiKey,
        anthropicApiKey,
      },
    });

    res.json({
      success: true,
      message: 'API keys updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get user's API usage stats
router.get('/usage', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const usage = await db.apiUsage.groupBy({
      by: ['service', 'model'],
      where: {
        userId: req.user!.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _sum: {
        tokens: true,
        cost: true,
      },
      _count: {
        id: true,
      },
    });

    res.json({
      success: true,
      data: { usage },
    });
  } catch (error) {
    next(error);
  }
});

export default router;