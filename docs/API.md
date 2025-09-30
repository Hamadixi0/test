# AI Game Builder Platform - API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.aigamebuilder.com/api
```

## Authentication

All API endpoints except authentication routes require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### Demo Login
```http
POST /auth/demo-login
Content-Type: application/json

{
  "username": "demo_user"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "demo_123",
    "username": "demo_user",
    "email": "demo_user@demo.com",
    "avatar_url": "https://ui-avatars.com/api/?name=demo_user"
  }
}
```

#### GitHub OAuth
```http
GET /auth/github
```

Returns GitHub OAuth URL for authentication.

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar_url": "https://github.com/avatar.png"
  }
}
```

## Projects

### List Projects
```http
GET /projects
Authorization: Bearer <token>
```

**Response:**
```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "Space Adventure",
      "description": "A 3D space exploration game",
      "gameType": "3D",
      "engine": "Unity",
      "status": "completed",
      "createdAt": "2023-12-01T10:00:00Z",
      "updatedAt": "2023-12-01T12:00:00Z",
      "preview": {
        "webgl_url": "https://demo.com/play/proj_123",
        "screenshot": "https://demo.com/screenshots/proj_123.png"
      }
    }
  ]
}
```

### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Awesome Game",
  "description": "A platformer game with amazing graphics",
  "gameType": "2D",
  "engine": "Unity",
  "prompt": "A retro-style platformer where the player controls a ninja cat collecting fish while avoiding robot enemies. The game should have pixel art graphics, chiptune music, and smooth jumping mechanics."
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "proj_456",
    "userId": "user_123",
    "name": "My Awesome Game",
    "description": "A platformer game with amazing graphics",
    "gameType": "2D",
    "engine": "Unity",
    "prompt": "A retro-style platformer...",
    "status": "initializing",
    "createdAt": "2023-12-01T14:00:00Z",
    "updatedAt": "2023-12-01T14:00:00Z",
    "assets": {
      "code": [],
      "art2D": [],
      "art3D": [],
      "audio": [],
      "shaders": [],
      "levels": [],
      "ui": []
    },
    "settings": {
      "targetPlatforms": ["WebGL"],
      "qualityLevel": "medium",
      "multiplayer": false,
      "maxPlayers": 1
    }
  },
  "message": "Project created successfully. AI generation will begin shortly."
}
```

### Get Project Details
```http
GET /projects/{project_id}
Authorization: Bearer <token>
```

### Update Project
```http
PUT /projects/{project_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Game Name",
  "description": "Updated description",
  "settings": {
    "targetPlatforms": ["WebGL", "Android"],
    "qualityLevel": "high"
  }
}
```

### Delete Project
```http
DELETE /projects/{project_id}
Authorization: Bearer <token>
```

## AI Generation

### List Available AI Agents
```http
GET /ai/agents
Authorization: Bearer <token>
```

**Response:**
```json
{
  "agents": {
    "code": {
      "name": "Code Generator",
      "description": "Generates game scripts and logic"
    },
    "art2d": {
      "name": "2D Artist",
      "description": "Creates sprites, textures, and 2D assets"
    },
    "art3d": {
      "name": "3D Artist",
      "description": "Creates 3D models, animations, and environments"
    },
    "audio": {
      "name": "Audio Designer",
      "description": "Generates music, sound effects, and voices"
    }
  }
}
```

### Generate Assets
```http
POST /ai/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "proj_123",
  "agent": "code",
  "prompt": "Create a player controller script with jumping, running, and collision detection",
  "apiKey": "your-openai-api-key",
  "settings": {
    "quality": "high",
    "style": "modern"
  }
}
```

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "job_789",
    "projectId": "proj_123",
    "agent": "code",
    "prompt": "Create a player controller script...",
    "status": "processing",
    "progress": 0,
    "createdAt": "2023-12-01T15:00:00Z",
    "estimatedTime": 45
  },
  "message": "Code Generator is now generating assets..."
}
```

### Get Generation Job Status
```http
GET /ai/jobs/{job_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "job": {
    "id": "job_789",
    "status": "completed",
    "progress": 100,
    "result": {
      "assets": ["PlayerController.cs", "GameManager.cs", "InventorySystem.cs"],
      "preview": "https://demo.com/preview/job_789",
      "metadata": {
        "quality": "high",
        "processingTime": 8.5,
        "tokensUsed": 1250
      }
    }
  }
}
```

### Get AI Analytics
```http
GET /ai/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "analytics": {
    "totalGenerations": 156,
    "successRate": 94.2,
    "averageTime": 45,
    "mostUsedAgent": "code",
    "agentUsage": {
      "code": 45,
      "art2d": 32,
      "audio": 28,
      "art3d": 25,
      "ui": 15,
      "level": 11
    },
    "costEstimate": {
      "monthly": 127.50,
      "perProject": 8.30
    }
  }
}
```

## GitHub Integration

### Create Repository
```http
POST /github/create-repo
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "proj_123",
  "repoName": "my-awesome-game",
  "description": "AI-generated platformer game",
  "private": true
}
```

**Response:**
```json
{
  "success": true,
  "repository": {
    "id": "repo_456",
    "name": "my-awesome-game",
    "full_name": "username/my-awesome-game",
    "description": "AI-generated platformer game",
    "private": true,
    "html_url": "https://github.com/username/my-awesome-game",
    "clone_url": "https://github.com/username/my-awesome-game.git",
    "created_at": "2023-12-01T16:00:00Z",
    "default_branch": "main"
  },
  "message": "GitHub repository created successfully"
}
```

### Push Project Files
```http
POST /github/push
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "proj_123",
  "repoUrl": "https://github.com/username/my-awesome-game",
  "commitMessage": "Initial game generation complete"
}
```

### Create Release
```http
POST /github/release
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "proj_123",
  "repoUrl": "https://github.com/username/my-awesome-game",
  "version": "1.0.0",
  "title": "First Release",
  "description": "Initial release of the AI-generated game",
  "builds": [
    {
      "platform": "WebGL",
      "filename": "game-webgl-v1.0.0.zip",
      "extension": "zip"
    },
    {
      "platform": "Android",
      "filename": "game-android-v1.0.0.apk",
      "extension": "apk"
    }
  ]
}
```

## WebSocket Events

The platform uses Socket.io for real-time communication. Connect to the WebSocket endpoint:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client Events
```javascript
// Join project room for updates
socket.emit('join_project', 'proj_123');

// Leave project room
socket.emit('leave_project', 'proj_123');
```

### Server Events
```javascript
// Project created
socket.on('project_created', (data) => {
  console.log('New project:', data.project);
});

// Project updated
socket.on('project_updated', (data) => {
  console.log('Updated project:', data.project);
});

// Generation progress
socket.on('generation_progress', (data) => {
  console.log(`Progress: ${data.progress}% - ${data.message}`);
});

// AI generation progress
socket.on('ai_progress', (data) => {
  console.log(`AI Job ${data.jobId}: ${data.progress}%`);
});
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "details": ["Additional error details"],
  "timestamp": "2023-12-01T10:00:00Z"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limits

- **API Requests**: 1000 requests per hour per user
- **AI Generation**: 10 concurrent jobs per user
- **WebSocket Connections**: 5 concurrent connections per user

## Pagination

List endpoints support pagination:

```http
GET /projects?page=2&perPage=10
```

**Response:**
```json
{
  "projects": [...],
  "pagination": {
    "page": 2,
    "perPage": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```