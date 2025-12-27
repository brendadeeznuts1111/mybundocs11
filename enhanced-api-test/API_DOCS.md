# Enhanced Bun API - Technical Documentation

## Overview
Detailed technical specifications for request/response formats, authentication flows, and implementation details.

## Authentication System

### JWT Token Structure

**Access Token:**
```json
{
  "userId": 1,
  "email": "alice@example.com",
  "iat": 1640995200,
  "exp": 1640996100
}
```

**Refresh Token:**
```json
{
  "token": "unique_refresh_token_string",
  "userId": 1,
  "expires_at": "2023-12-27T00:00:00.000Z"
}
```

### Authentication Flow

1. **Login Request**
   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "alice@example.com",
     "password": "password123"
   }
   ```

2. **Login Response**
   ```json
   {
     "accessToken": "jwt_access_token",
     "refreshToken": "refresh_token_string",
     "user": {
       "id": 1,
       "name": "Alice",
       "email": "alice@example.com",
       "role": "user"
     }
   }
   ```

3. **Token Refresh**
   ```bash
   POST /api/auth/refresh
   Content-Type: application/json

   {
     "refreshToken": "refresh_token_string"
   }
   ```

4. **Logout**
   ```bash
   POST /api/auth/logout
   Content-Type: application/json

   {
     "refreshToken": "refresh_token_string"
   }
   ```

## API Endpoints

### 1. Users API

#### 1.1 Create User
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2023-12-27T00:00:00.000Z",
  "updated_at": "2023-12-27T00:00:00.000Z"
}
```

#### 1.2 List Users (Paginated)
```bash
GET /api/users?page=1&limit=10&search=john
Authorization: Bearer jwt_access_token
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "role": "user",
      "created_at": "2023-12-27T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 2. Posts API

#### 2.1 Create Post
```bash
POST /api/posts
Content-Type: application/json
Authorization: Bearer jwt_access_token

{
  "title": "My First Post",
  "content": "This is the content of my post",
  "published": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "My First Post",
  "content": "This is the content of my post",
  "author_id": 1,
  "published": true,
  "created_at": "2023-12-27T00:00:00.000Z",
  "updated_at": "2023-12-27T00:00:00.000Z",
  "author": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

#### 2.2 List Posts with Filtering
```bash
GET /api/posts?page=1&limit=10&published=true&author_id=1
```

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is the content of my post",
      "published": true,
      "created_at": "2023-12-27T00:00:00.000Z",
      "author": {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 3. Files API

#### 3.1 Upload File
```bash
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer jwt_access_token

file: [binary file data]
```

**Response:**
```json
{
  "id": 1,
  "filename": "unique_filename_123456789.jpg",
  "original_name": "my-photo.jpg",
  "mimetype": "image/jpeg",
  "size": 1024000,
  "created_at": "2023-12-27T00:00:00.000Z",
  "uploader": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

#### 3.2 List Files
```bash
GET /api/files?page=1&limit=10
Authorization: Bearer jwt_access_token
```

**Response:**
```json
{
  "files": [
    {
      "id": 1,
      "filename": "unique_filename_123456789.jpg",
      "original_name": "my-photo.jpg",
      "mimetype": "image/jpeg",
      "size": 1024000,
      "created_at": "2023-12-27T00:00:00.000Z",
      "uploader": {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### 3.3 Download File
```bash
GET /api/files/1/download
Authorization: Bearer jwt_access_token
```

**Response:** Binary file data with appropriate headers

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');
```

### Message Types

#### 1. Authenticate
```json
{
  "type": "authenticate",
  "token": "jwt_access_token"
}
```

#### 2. Chat Message
```json
{
  "type": "chat_message",
  "message": "Hello everyone!"
}
```

#### 3. Ping
```json
{
  "type": "ping"
}
```

### Server Responses

#### 1. Welcome Message
```json
{
  "type": "welcome",
  "message": "Connected to enhanced API real-time features",
  "timestamp": "2023-12-27T00:00:00.000Z",
  "connected": "2023-12-27T00:00:00.000Z"
}
```

#### 2. Authentication Success
```json
{
  "type": "authenticated",
  "message": "WebSocket connection authenticated",
  "user": {
    "id": 1,
    "email": "alice@example.com"
  }
}
```

#### 3. Chat Message Broadcast
```json
{
  "type": "chat_message",
  "id": 1640995200000,
  "userId": 1,
  "username": "alice@example.com",
  "message": "Hello everyone!",
  "timestamp": "2023-12-27T00:00:00.000Z"
}
```

#### 4. Pong Response
```json
{
  "type": "pong",
  "timestamp": "2023-12-27T00:00:00.000Z"
}
```

#### 5. Error Messages
```json
{
  "type": "error",
  "message": "Authentication required to send messages"
}
```

## Error Handling

### HTTP Error Responses

#### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Email and password are required"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired refresh token"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Authentication required"
}
```

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

#### 500 Internal Server Error (Development)
```json
{
  "error": "Internal server error",
  "message": "woops! This is a test error",
  "timestamp": "2023-12-27T00:00:00.000Z",
  "stack": "Error: woops! This is a test error\n    at index.ts:517:13",
  "development": true,
  "debugInfo": "Error: woops! This is a test error",
  "fileName": "index.ts:517",
  "lineNumber": "517"
}
```

#### 500 Internal Server Error (Production)
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "timestamp": "2023-12-27T00:00:00.000Z"
}
```

## Rate Limiting

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995800
```

### Response
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

## Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| email | TEXT | UNIQUE NOT NULL |
| role | TEXT | DEFAULT 'user' |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |

### Posts Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| title | TEXT | NOT NULL |
| content | TEXT | NOT NULL |
| author_id | INTEGER | NOT NULL |
| published | INTEGER | DEFAULT 0 |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |
| FOREIGN KEY | author_id | REFERENCES users(id) |

### Files Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| filename | TEXT | NOT NULL |
| original_name | TEXT | NOT NULL |
| mimetype | TEXT | NOT NULL |
| size | INTEGER | NOT NULL |
| uploaded_by | INTEGER | NOT NULL |
| file_path | TEXT | NOT NULL |
| created_at | TEXT | NOT NULL |
| FOREIGN KEY | uploaded_by | REFERENCES users(id) |

### Refresh Tokens Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| token | TEXT | UNIQUE NOT NULL |
| user_id | INTEGER | NOT NULL |
| expires_at | TEXT | NOT NULL |
| created_at | TEXT | NOT NULL |
| FOREIGN KEY | user_id | REFERENCES users(id) |

### Rate Limits Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| ip_address | TEXT | NOT NULL |
| request_count | INTEGER | DEFAULT 1 |
| window_start | TEXT | NOT NULL |
| created_at | TEXT | NOT NULL |

## File Upload Validation

### Allowed MIME Types
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Documents: `application/pdf`, `application/json`, `text/csv`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Text: `text/plain`

### File Size Limits
- Maximum: 10MB (10,485,760 bytes)

### File Naming
- Original filename preserved for display
- Unique filename for storage: `{timestamp}_{random}.{ext}`
- Storage directory: `./uploads`

## Security Considerations

### JWT Security
- Access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry
- Tokens invalidated on logout
- Secure random token generation

### File Security
- MIME type validation
- Size limits enforced
- Unique filenames prevent directory traversal
- Access control for operations

### Rate Limiting
- IP-based limits
- Database persistence
- Automatic cleanup of expired limits

### CORS Configuration
- Configurable allowed origins
- Proper preflight handling
- Secure headers for API responses

## Performance Optimizations

### Database
- Indexed columns for fast queries
- Prepared statements for security
- Connection pooling (SQLite optimization)

### File Handling
- Streaming file uploads
- Efficient file storage
- Proper memory management

### WebSocket
- Pub/sub pattern for scalability
- Connection pooling
- Automatic cleanup

## Monitoring and Debugging

### Health Checks
- Database connectivity verification
- System resource monitoring
- WebSocket connection tracking

### Logging
- Structured error logging
- Request/response logging
- Performance metrics

### Debugging
- Development mode with enhanced errors
- Bun inspector integration
- Syntax-highlighted error previews
- Verbose network request logging

## Deployment Considerations

### Environment Variables
- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Server port configuration
- `JWT_SECRET`: Secure secret for JWT signing

### Production Optimizations
- Development mode disabled
- Error details sanitized
- Performance monitoring enabled
- Security headers configured

### Docker Support
- Multi-stage builds for optimization
- Security best practices
- Proper signal handling
- Health check endpoints
