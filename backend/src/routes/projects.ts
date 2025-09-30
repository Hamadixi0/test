import { Router, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { db } from '../services/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Get all projects for authenticated user
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['draft', 'generating', 'ready', 'building', 'published', 'error']),
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const where: any = {
      userId: req.user!.id,
    };

    if (status) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          engine: true,
          status: true,
          isPublic: true,
          previewUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.project.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create new project
router.post('/', [
  body('name').isLength({ min: 1, max: 100 }).trim(),
  body('description').optional().isLength({ max: 500 }).trim(),
  body('type').isIn(['2D', '2.5D', '3D']),
  body('engine').isIn(['unity', 'godot']),
  body('aiPrompt').optional().isLength({ max: 2000 }).trim(),
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const { name, description, type, engine, aiPrompt } = req.body;

    const project = await db.project.create({
      data: {
        name,
        description,
        type,
        engine,
        aiPrompt,
        userId: req.user!.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        engine: true,
        status: true,
        aiPrompt: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
});

// Get project by ID
router.get('/:id', [
  param('id').isString().notEmpty(),
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const project = await db.project.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { userId: req.user!.id },
          { isPublic: true },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        generations: {
          select: {
            id: true,
            type: true,
            status: true,
            approved: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        builds: {
          select: {
            id: true,
            version: true,
            type: true,
            status: true,
            buildUrl: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
});

// Start AI generation for project
router.post('/:id/generate', [
  param('id').isString().notEmpty(),
  body('type').isIn(['code', '2d_art', '3d_model', 'audio', 'level', 'ui', 'shader', 'physics']),
  body('prompt').isLength({ min: 1, max: 2000 }).trim(),
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const project = await db.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    const { type, prompt } = req.body;

    const generation = await db.generation.create({
      data: {
        projectId: project.id,
        type,
        prompt,
        agent: `${type}_agent`, // Placeholder for AI agent assignment
        status: 'pending',
      },
    });

    // TODO: Trigger AI generation process
    // This would typically queue a job or call an AI service

    res.status(201).json({
      success: true,
      message: 'AI generation started',
      data: { generation },
    });
  } catch (error) {
    next(error);
  }
});

export default router;