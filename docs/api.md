# AI Game Builder API Documentation

## Overview

The AI Game Builder API provides endpoints for managing projects, AI generation, user authentication, and game building workflows.

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.aigamebuilder.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Core Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Projects

#### GET /projects
Get user's projects with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (draft, generating, ready, building, published, error)

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "My Game",
  "description": "An awesome game",
  "type": "2D",
  "engine": "unity",
  "aiPrompt": "Create a 2D platformer with ninja mechanics"
}
```

#### GET /projects/:id
Get project details by ID.

#### POST /projects/:id/generate
Start AI generation for a project.

**Request Body:**
```json
{
  "type": "code",
  "prompt": "Generate player movement and jumping mechanics"
}
```

### AI Services

#### GET /ai/models
Get available AI models and agents.

**Response:**
```json
{
  "success": true,
  "data": {
    "models": {
      "code": [
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "provider": "openai",
          "description": "Advanced code generation"
        }
      ],
      "art": [...],
      "audio": [...],
      "3d": [...]
    }
  }
}
```

#### GET /ai/templates
Get AI generation templates.

#### POST /ai/test
Test AI API key connection.

### User Management

#### GET /users/me
Get current user profile.

#### PUT /users/me
Update user profile.

#### PUT /users/api-keys
Update user's AI API keys (encrypted storage).

#### GET /users/usage
Get user's API usage statistics.

## WebSocket Events

### Connection
Connect to WebSocket with authentication:

```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### Client to Server

- `join-project`: Join a project room for real-time updates
- `leave-project`: Leave a project room
- `generation-status`: Send generation status updates
- `game-action`: Send multiplayer game actions

#### Server to Client

- `project-joined`: Confirmation of joining project room
- `user-joined-project`: Another user joined the project
- `user-left-project`: User left the project
- `generation-update`: AI generation progress updates
- `game-action`: Multiplayer game actions from other players

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages if applicable"]
}
```

## Rate Limits

- General API: 100 requests per 15 minutes per IP
- AI Generation: 10 requests per minute per user
- File Upload: 50MB max file size

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error