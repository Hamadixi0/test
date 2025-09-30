export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  githubId?: string;
  subscriptionTier: string;
  subscriptionEnd?: Date;
  preferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: '2D' | '2.5D' | '3D';
  engine: 'unity' | 'godot';
  githubRepoUrl?: string;
  githubBranch: string;
  config: Record<string, any>;
  aiPrompt?: string;
  aiConfig: Record<string, any>;
  status: 'draft' | 'generating' | 'ready' | 'building' | 'published' | 'error';
  buildVersion: number;
  assetsUrl?: string;
  previewUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  userId: string;
}

export interface Generation {
  id: string;
  projectId: string;
  type: 'code' | '2d_art' | '3d_model' | 'audio' | 'level' | 'ui' | 'shader' | 'physics';
  prompt: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  agent: string;
  aiModel?: string;
  resultData?: Record<string, any>;
  resultUrls: string[];
  config: Record<string, any>;
  approved?: boolean;
  quality?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Build {
  id: string;
  projectId: string;
  version: number;
  type: 'preview' | 'webgl' | 'android' | 'ios' | 'windows' | 'mac' | 'linux';
  status: 'pending' | 'building' | 'completed' | 'failed' | 'deployed';
  config: Record<string, any>;
  buildUrl?: string;
  downloadUrl?: string;
  size?: bigint;
  logs?: string;
  error?: string;
  buildTime?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}