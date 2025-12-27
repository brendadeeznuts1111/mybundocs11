# Enhanced Bun API Template

A production-ready API template with real-time WebSocket capabilities, JWT authentication, file uploads, and enterprise-grade debugging.

## Features

### Core Infrastructure
- **Database** - SQLite with proper schema and migrations
- **Authentication** - JWT access/refresh tokens with secure validation
- **Rate Limiting** - IP-based throttling with database persistence
- **Logging** - Request/response tracking with timestamps
- **Health Checks** - Database connectivity monitoring
- **CORS** - Cross-origin resource sharing configuration

### Advanced Features
- **File Upload System** - Complete CRUD operations with validation
- **WebSocket Real-time** - Chat, notifications, and pub/sub messaging
- **Advanced Debugging** - Development mode with syntax-highlighted errors
- **API Documentation** - Comprehensive endpoint documentation
- **Testing Suite** - 26+ comprehensive tests

### Developer Experience
- **TypeScript Support** - Full type safety with zero compilation errors
- **Bun Debugger** - Interactive debugging with inspector protocol
- **Verbose Logging** - Network request debugging with curl output
- **Error Handling** - Structured error responses with stack traces

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime installed
- Node.js 16+ (for development tools)

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd enhanced-api-template
bun install

# Start with debugging
bun --inspect index.ts
```

### Environment Variables
```bash
PORT=3000
NODE_ENV=development
BUN_CONFIG_VERBOSE_FETCH=true  # Optional: verbose logging
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
All protected endpoints require JWT authentication:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

### Endpoints

#### Users API
- `GET /api/users` - List users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user (auth required)
- `DELETE /api/users/:id` - Delete user (auth required)

#### Posts API
- `GET /api/posts` - List posts (paginated, filterable)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

#### Files API
- `POST /api/files/upload` - Upload file (auth required)
- `GET /api/files` - List files (paginated)
- `GET /api/files/:id` - Get file info
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file (auth required)

#### Authentication API
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate token)

#### Utility API
- `GET /api/status` - Server status with statistics
- `GET /api/health` - Health check

#### WebSocket API
- `WS /ws` - Real-time WebSocket connection

### WebSocket Messages

#### Authentication
```json
{"type": "authenticate", "token": "jwt_token_here"}
```

#### Chat Messages
```json
{"type": "chat_message", "message": "Hello, world!"}
```

#### Ping/Pong
```json
{"type": "ping"}
```

## Development

### Running
```bash
# Development with debugging
bun --inspect index.ts

# With verbose logging
BUN_CONFIG_VERBOSE_FETCH=true bun --inspect index.ts
```

### Database Schema
```sql
-- Core tables: users, posts, files, refresh_tokens, rate_limits
-- See API_DOCS.md for complete schema details
```

### File Upload Configuration
- **Max size:** 10MB
- **Allowed types:** Images (JPEG, PNG, GIF, WebP), Documents (PDF, JSON, CSV, Excel), Text
- **Storage:** `./uploads`

### WebSocket Channels
- `global-notifications` - System notifications
- `global-chat` - Real-time chat
- `user-{id}` - User-specific notifications

## Testing

```bash
# Run all tests
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

**Coverage:** Authentication, Users, Posts, Files, Rate Limiting, Error Handling, Database Operations

## Configuration

### Server Configuration
```typescript
const server = Bun.serve({
  port: process.env.PORT || 3000,
  development: process.env.NODE_ENV !== "production",
  fetch: async (req, server) => { /* ... */ },
  websocket: { /* ... */ },
  error(error) { /* ... */ }
});
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `JWT_SECRET` | generated | JWT signing secret |
| `BUN_CONFIG_VERBOSE_FETCH` | false | Verbose fetch logging |

## Deployment

### Production
```bash
export NODE_ENV=production
bun start index.ts
```

### Docker
```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production
COPY . .
EXPOSE 3000
CMD ["bun", "index.ts"]
```

## Monitoring

### Health Checks
```bash
curl http://localhost:3000/api/health  # Basic
curl http://localhost:3000/api/status  # Detailed
```

### Logging
- Request/response with timestamps
- Error logging with stack traces
- WebSocket connection events
- Database operation logs

## Security

### Authentication
- JWT access tokens (15-minute expiry)
- Refresh tokens (7-day expiry)
- Secure token invalidation

### Rate Limiting
- IP-based (100 requests/minute)
- Database-persisted
- Automatic cleanup

### File Security
- Type validation
- Size limits (10MB)
- Unique filenames
- Access control

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License
MIT License

---

**Enhanced Bun API Template** - A comprehensive foundation for modern web applications with real-time capabilities and enterprise-grade features.
