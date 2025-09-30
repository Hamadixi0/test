const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const gameRoutes = require('./routes/gameRoutes');
const aiRoutes = require('./routes/aiRoutes');
const buildRoutes = require('./routes/buildRoutes');
const githubRoutes = require('./routes/githubRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/builds', express.static(path.join(__dirname, '../builds')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/build', buildRoutes);
app.use('/api/github', githubRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game-session', (gameId) => {
    socket.join(gameId);
    console.log(`User ${socket.id} joined game session ${gameId}`);
  });

  socket.on('ai-message', async (data) => {
    // Handle AI conversation messages
    try {
      const { gameId, message, sessionId } = data;
      // This will be handled by the AI service
      socket.to(gameId).emit('ai-response', {
        sessionId,
        response: 'Processing your request...',
        type: 'thinking'
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to process AI message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`AI Game Builder server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;