# Backend API Documentation

This document describes the backend API endpoints implemented for the Cod3Null3r application.

## Setup

1. Copy `.env.example` to `.env` and configure your environment variables
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the server: `npm start` (or `npm run dev` for development)

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Auth Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT tokens
- `POST /api/auth/logout` - Logout (invalidates refresh token)
- `POST /api/auth/refresh` - Refresh access token using refresh token
- `GET /api/auth/me` - Get current user information
- `GET /api/auth/config` - Get authentication configuration

## Projects

- `GET /api/projects` - List all projects for authenticated user
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
  - Body: `{ name, description, type?, technologies? }`
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `POST /api/projects/:id/duplicate` - Duplicate a project

## Tasks & Epics

- `GET /api/projects/:projectId/tasks` - List all tasks for a project
- `GET /api/projects/:projectId/epics` - List all epics for a project
- `PUT /api/tasks/:taskId` - Update a task

## Specifications

- `POST /api/specifications/generate` - Generate a new app specification
  - Body: `{ projectName, description, requirements?, projectId? }`
- `GET /api/specifications/:specId` - Get a specification by ID
- `GET /api/specifications/:specId/export?format=pdf|markdown` - Export specification

## App Creation

- `POST /api/app-creation/questions` - Get clarification questions
  - Body: `{ description }`
- `POST /api/app-creation/tech-stack` - Get tech stack recommendations
  - Body: `{ requirements }`
- `POST /api/app-creation/roadmap` - Get development roadmap
  - Body: `{ requirements, techStack }`
- `POST /api/app-creation/start` - Start code generation
  - Body: `{ projectName, requirements, techStack }`

## Code Files

- `GET /api/projects/:projectId/files` - List all files for a project
- `GET /api/projects/:projectId/files/*` - Get specific file content

## Models

### Project
```typescript
{
  _id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'archived';
  owner: ObjectId;
  type: 'new' | 'imported';
  technologies: string[];
  filesCount: number;
  linesOfCode: number;
  createdAt: Date;
  lastModified: Date;
}
```

### Task
```typescript
{
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  project: ObjectId;
  epic: ObjectId;
  assignedAgent?: string;
  progress: number;
  estimatedTime?: number;
  actualTime?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Epic
```typescript
{
  _id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  project: ObjectId;
  progress: number;
  taskCount: number;
  completedTaskCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Responses

All endpoints return standard error responses:
```json
{
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
