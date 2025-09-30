import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { db } from './database';

export class SocketService {
  private io: Server;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: Server) {
    this.io = io;
  }

  public initialize(): void {
    this.io.use(this.authMiddleware.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));
  }

  private async authMiddleware(socket: Socket, next: (err?: Error) => void) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, email: true },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  }

  private handleConnection(socket: Socket): void {
    const user = (socket as any).user;
    console.log(`User ${user.username} connected (${socket.id})`);

    // Store connection
    this.connectedUsers.set(user.id, socket.id);

    // Join user-specific room
    socket.join(`user:${user.id}`);

    // Handle project room joining
    socket.on('join-project', (projectId: string) => {
      this.handleJoinProject(socket, projectId);
    });

    socket.on('leave-project', (projectId: string) => {
      this.handleLeaveProject(socket, projectId);
    });

    // Handle AI generation events
    socket.on('generation-status', (data) => {
      this.handleGenerationStatus(socket, data);
    });

    // Handle multiplayer game events
    socket.on('game-action', (data) => {
      this.handleGameAction(socket, data);
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  private async handleJoinProject(socket: Socket, projectId: string) {
    const user = (socket as any).user;
    
    try {
      // Verify user has access to project
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { userId: user.id },
            { isPublic: true },
          ],
        },
      });

      if (!project) {
        socket.emit('error', { message: 'Project not found' });
        return;
      }

      socket.join(`project:${projectId}`);
      socket.emit('project-joined', { projectId });
      
      // Notify other users in the project
      socket.to(`project:${projectId}`).emit('user-joined-project', {
        userId: user.id,
        username: user.username,
        projectId,
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join project' });
    }
  }

  private handleLeaveProject(socket: Socket, projectId: string) {
    const user = (socket as any).user;
    socket.leave(`project:${projectId}`);
    
    // Notify other users
    socket.to(`project:${projectId}`).emit('user-left-project', {
      userId: user.id,
      username: user.username,
      projectId,
    });
  }

  private handleGenerationStatus(socket: Socket, data: any) {
    const user = (socket as any).user;
    
    // Broadcast generation updates to project room
    if (data.projectId) {
      this.io.to(`project:${data.projectId}`).emit('generation-update', {
        ...data,
        userId: user.id,
      });
    }
  }

  private handleGameAction(socket: Socket, data: any) {
    const user = (socket as any).user;
    
    // Handle multiplayer game actions
    if (data.projectId) {
      socket.to(`project:${data.projectId}`).emit('game-action', {
        ...data,
        userId: user.id,
        username: user.username,
      });
    }
  }

  private handleDisconnect(socket: Socket) {
    const user = (socket as any).user;
    if (user) {
      console.log(`User ${user.username} disconnected (${socket.id})`);
      this.connectedUsers.delete(user.id);
    }
  }

  // Public methods for sending notifications
  public notifyUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public notifyProject(projectId: string, event: string, data: any): void {
    this.io.to(`project:${projectId}`).emit(event, data);
  }

  public broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }
}