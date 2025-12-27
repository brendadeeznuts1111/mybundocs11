# Comprehensive Bun API Template Documentation

## Overview
A complete, production-ready API foundation built with Bun, featuring comprehensive CRUD operations, authentication, middleware, and testing.

## Features

### Core Features
- **Complete CRUD Operations**: Full Create, Read, Update, Delete for Users and Posts
- **RESTful API Design**: Proper HTTP methods and status codes
- **Dynamic Routing**: Path parameters for resource identification
- **Environment Configuration**: Configurable port via `PORT` environment variable

### Middleware System
- **CORS Support**: Cross-origin resource sharing with proper headers
- **Request Logging**: Timestamped request logging for monitoring
- **Authentication**: Bearer token-based authentication system
- **Error Handling**: Comprehensive error responses with proper status codes

### Data Management
- **In-memory Database**: TypeScript interfaces for type safety
- **Request Validation**: Detailed input validation with error messages
- **JSON Body Parsing**: Automatic JSON parsing and validation
- **Pagination**: Built-in pagination with metadata
- **Search & Filtering**: Advanced filtering capabilities

### Security & Validation
- **Input Validation**: Comprehensive validation for all endpoints
- **Authentication Required**: Protected endpoints for sensitive operations
- **Error Responses**: Proper error handling with detailed messages
- **TypeScript Safety**: Full type definitions throughout

## API Endpoints

### Users API
```
GET    /api/users          - List users with pagination & search
GET    /api/users/:id      - Get user by ID
POST   /api/users          - Create new user
PUT    /api/users/:id      - Update existing user
DELETE /api/users/:id      - Delete user
```

### Posts API
```
GET    /api/posts          - List posts with pagination & filtering
GET    /api/posts/:id      - Get post with author info
POST   /api/posts          - Create post (requires auth)
PUT    /api/posts/:id      - Update post (requires auth)
DELETE /api/posts/:id      - Delete post (requires auth)
```

### Utility Endpoints
```
GET    /api/status         - Server status with statistics
GET    /api/health         - Health check endpoint
GET    /                   - API documentation and endpoints list
```

## Query Parameters

### Users
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or email

### Posts
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `published` - Filter by published status (true/false)
- `authorId` - Filter by author ID

## Authentication

Protected endpoints require Bearer token authentication:
```bash
Authorization: Bearer secret-token
```

**Protected Endpoints:**
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id

## Usage Examples

### Get Server Status
```bash
curl http://localhost:3000/api/status
```

### List Users with Pagination
```bash
curl "http://localhost:3000/api/users?page=1&limit=5"
```

### Search Users
```bash
curl "http://localhost:3000/api/users?search=alice"
```

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"user"}'
```

### Create a Post (Authenticated)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret-token" \
  -d '{"title":"My Post","content":"Hello world!","published":true}'
```

### Filter Posts
```bash
curl "http://localhost:3000/api/posts?published=true&authorId=1"
```

## Testing

The template includes a comprehensive test suite covering:
- Root & Status Endpoints (3 tests)
- Users API (8 tests) - CRUD operations, validation, search
- Posts API (8 tests) - CRUD operations, authentication, filtering
- Error Handling (4 tests) - 404, 405, CORS handling
- Authentication (2 tests) - Token validation

### Running Tests
```bash
bun test              # Run all tests
bun test --watch      # Run tests in watch mode
```

## Getting Started

### Create New Project
```bash
bun create my-template your-project-name
cd your-project-name
```

### Development
```bash
bun run dev           # Start development server
bun run start         # Start production server
bun test              # Run tests
```

### Environment Variables
```bash
PORT=3000             # Server port (default: 3000)
```

## Response Formats

### Paginated Response
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "error": "Validation failed",
  "errors": [
    "Name is required and must be at least 2 characters",
    "Valid email is required"
  ]
}
```

### User Object
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Post Object
```json
{
  "id": 1,
  "title": "Welcome to Bun",
  "content": "This is the first post",
  "authorId": 1,
  "published": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }
}
```

## Architecture

### TypeScript Interfaces
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Middleware Functions
- `corsMiddleware()` - CORS headers
- `loggingMiddleware()` - Request logging
- `authMiddleware()` - Authentication validation
- `validateUser()` - User input validation
- `validatePost()` - Post input validation
- `paginate()` - Pagination helper

## Production Considerations

### Database
- Currently uses in-memory storage
- Easy to replace with PostgreSQL, MongoDB, etc.
- TypeScript interfaces ensure type safety

### Authentication
- Simple Bearer token for demonstration
- Production should use JWT or OAuth
- Consider rate limiting and refresh tokens

### Security
- Input validation on all endpoints
- CORS properly configured
- Error messages don't leak sensitive information
- Consider adding rate limiting and request throttling

## Performance
- Built-in pagination prevents large response payloads
- Efficient filtering reduces data transfer
- TypeScript compilation catches errors early
- Bun's runtime performance optimizations

## Future Enhancements
- Database integration (PostgreSQL, MongoDB)
- JWT authentication with refresh tokens
- Rate limiting and request throttling
- File upload capabilities
- WebSocket support for real-time features
- API documentation with OpenAPI/Swagger
- Docker containerization
- CI/CD pipeline setup

---

**This template provides a solid foundation for building modern web APIs with Bun, featuring enterprise-grade patterns and comprehensive testing.**
