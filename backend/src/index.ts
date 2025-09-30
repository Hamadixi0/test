import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';

// Import configurations and middleware
import { corsConfig } from './config/cors';
import { rateLimitConfig } from './config/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import userRoutes from './routes/users';
import aiRoutes from './routes/ai';
import healthRoutes from './routes/health';

// Import services
import { RedisService } from './services/redis';
import { DatabaseService } from './services/database';
import { SocketService } from './services/socket';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsConfig,
});

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(compression());

// Rate limiting
const limiter = rateLimit(rateLimitConfig);
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check (before auth middleware)
app.use('/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Socket.io setup
const socketService = new SocketService(io);
socketService.initialize();

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize database
    await DatabaseService.initialize();
    console.log('✅ Database connected');

    // Initialize Redis
    await RedisService.initialize();
    console.log('✅ Redis connected');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, io };