# Bun HTTP Server Configuration - Complete Implementation

This project provides a **comprehensive implementation of all Bun HTTP server configuration options** based on the official Bun documentation. It includes working examples, detailed documentation, and production-ready patterns.

## 📚 Core Documentation

### 🎯 **BUN_SERVER_CONFIGURATION.md**
Complete reference guide covering all server configuration options:
- **Network Configuration** (port, hostname)
- **TLS/SSL Configuration** (HTTPS setup)
- **WebSocket Configuration** (real-time communication)
- **Request/Response Configuration** (body size limits, error handlers)
- **Development & Debugging** (verbose logging, development mode)
- **Performance Optimization** (reusePort, lowMemoryMode)
- **Advanced Configuration** (custom server constructors)

### 🚀 **bun-server-config.ts**
Working implementation with 6 different server configurations:
1. **Basic** - Simple HTTP server
2. **Production** - Production-ready with security headers
3. **TLS/HTTPS** - Secure server with SSL/TLS
4. **WebSocket** - Real-time bidirectional communication
5. **High-Performance** - Optimized for throughput
6. **Advanced** - Middleware pattern with authentication & rate limiting

## 🎯 What This Project Demonstrates

### Complete Bun.serve() Configuration Coverage
```typescript
// All available options implemented:
Bun.serve({
  // Network
  port: 3000,
  hostname: "localhost",

  // TLS/SSL
  tls: { key, cert, ca, passphrase, secureOptions },

  // WebSocket
  websocket: { open, message, close, drain, ping, pong },

  // Request/Response
  maxRequestBodySize: 10 * 1024 * 1024,
  error: (error) => Response,

  // Development
  development: true,
  verbose: true,

  // Performance
  reusePort: true,
  lowMemoryMode: false,

  // Advanced
  serverConstructor: CustomServer
});
```

### Real-World Examples
- ✅ HTTPS/TLS server setup
- ✅ WebSocket chat server
- ✅ Production API with security headers
- ✅ Middleware pattern implementation
- ✅ Rate limiting & authentication
- ✅ Performance benchmarking
- ✅ External API integration
- ✅ Comprehensive error handling

## 🚀 Quick Start

### Run All Examples
```bash
# Basic configuration
bun run bun-server-config.ts 1

# Production configuration
bun run bun-server-config.ts 2

# TLS/HTTPS configuration
bun run bun-server-config.ts 3

# WebSocket configuration
bun run bun-server-config.ts 4

# High-performance configuration
bun run bun-server-config.ts 5

# Advanced middleware configuration
bun run bun-server-config.ts 6
```

### Test Any Configuration
```bash
# Start server (example: basic config)
bun run bun-server-config.ts 1

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/info
curl http://localhost:3000/metrics
```

## 📋 Configuration Reference

### All Available Options
```typescript
interface BunServerConfig {
  // Required
  fetch: (request: Request, server: BunServer) => Response | Promise<Response>;

  // Network
  port?: number;                    // Default: 3000
  hostname?: string;               // Default: "0.0.0.0"

  // TLS/SSL
  tls?: {
    key: string | Buffer;          // Private key (PEM format)
    cert: string | Buffer;         // Certificate (PEM format)
    ca?: string | Buffer;          // Optional CA certificate
    passphrase?: string;           // Optional passphrase
    secureOptions?: number;        // OpenSSL options
  };

  // WebSocket
  websocket?: {
    open?: (ws: BunWebSocket) => void;
    message?: (ws: BunWebSocket, message: string | Buffer) => void;
    close?: (ws: BunWebSocket, code: number, reason: string) => void;
    drain?: (ws: BunWebSocket) => void;
    ping?: (ws: BunWebSocket, data: Buffer) => void;
    pong?: (ws: BunWebSocket, data: Buffer) => void;
  } | false;

  // Request/Response
  maxRequestBodySize?: number;     // Size in bytes
  error?: (error: Error) => Response | Promise<Response>;

  // Development
  development?: boolean;           // Enable development mode
  verbose?: boolean;               // Enable verbose logging

  // Performance
  reusePort?: boolean;             // SO_REUSEPORT for load balancing
  lowMemoryMode?: boolean;         // Optimize for low memory

  // Advanced
  serverConstructor?: typeof BunServer; // Custom server class
}
```

## 🎯 Use Cases

### Development
- **API prototyping** with instant feedback
- **Debug endpoint** for system inspection
- **Performance testing** with metrics

### Production
- **Health monitoring** via `/health` endpoint
- **Performance tracking** via `/metrics`
- **Debug information** for troubleshooting
- **Load testing** with request counting

### DevOps
- **Container health checks**
- **Performance monitoring**
- **Error rate tracking**
- **Resource usage monitoring**

## 🏗️ Architecture

### Original Enhanced API Server (index.ts)
The existing `index.ts` provides:
- **Class-based architecture** for clean code organization
- **Multi-endpoint routing** with automatic metrics collection
- **Comprehensive error handling** with structured responses
- **Production-ready logging** and monitoring
- **Real-world REST API integration** with JSONPlaceholder

### New Configuration Examples (bun-server-config.ts)
The new `bun-server-config.ts` provides:
- **6 complete server configurations** covering all Bun.serve() options
- **Production-ready patterns** for each use case
- **TypeScript implementations** with full type safety
- **Working examples** you can run immediately
- **Comprehensive documentation** for each configuration

## 📊 Feature Comparison

| Feature | index.ts | bun-server-config.ts |
|---------|----------|---------------------|
| Basic HTTP Server | ✅ | ✅ |
| Production Ready | ✅ | ✅ |
| TLS/HTTPS | ❌ | ✅ |
| WebSocket | ❌ | ✅ |
| High Performance | ❌ | ✅ |
| Middleware Pattern | ❌ | ✅ |
| Rate Limiting | ❌ | ✅ |
| Authentication | ❌ | ✅ |
| All Config Options | ❌ | ✅ |

## 🔧 Additional Files

### BUN_SERVER_CONFIGURATION.md
- Complete reference guide
- All configuration options explained
- Best practices and examples
- Environment variables
- Troubleshooting guide

### package.json
- TypeScript support
- Bun runtime dependencies
- Development scripts

### server.test.ts
- Test suite for server functionality
- Performance benchmarks
- Integration tests

## 🚢 Deployment

### Docker Ready
```dockerfile
FROM oven/bun:1.1.0
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["bun", "bun-server-config.ts", "2"]
```

### Environment Variables
```bash
# Network
PORT=3000
HOSTNAME=localhost

# TLS/SSL
SSL_KEY=/path/to/server.key
SSL_CERT=/path/to/server.crt

# Development
NODE_ENV=production
BUN_CONFIG_VERBOSE_FETCH=true
```

## 📚 Documentation Structure

```
test-project/
├── README.md                    # This file - overview & quick start
├── BUN_SERVER_CONFIGURATION.md  # Complete reference guide
├── bun-server-config.ts         # 6 working server configurations
├── index.ts                     # Original enhanced API server
├── package.json                 # Dependencies & scripts
└── server.test.ts              # Test suite
```

## 🎯 Next Steps

1. **Read the documentation**: Start with `BUN_SERVER_CONFIGURATION.md`
2. **Run the examples**: Try each configuration with `bun run bun-server-config.ts N`
3. **Customize**: Copy patterns to your own projects
4. **Deploy**: Use production configuration for live deployments

## 🤝 Contributing

All examples are production-ready and follow Bun best practices. Contributions welcome!

---

**Built with ❤️ using Bun**
**Based on official Bun documentation: https://bun.com/docs/runtime/http/server#configuration**
# Bun HTTP Server Configuration - Complete Implementation

This project provides a **comprehensive implementation of all Bun HTTP server configuration options** based on the official Bun documentation. It includes working examples, detailed documentation, and production-ready patterns.

## 📚 Core Documentation

### 🎯 **BUN_SERVER_CONFIGURATION.md**
Complete reference guide covering all server configuration options:
- **Network Configuration** (port, hostname)
- **TLS/SSL Configuration** (HTTPS setup)
- **WebSocket Configuration** (real-time communication)
- **Request/Response Configuration** (body size limits, error handlers)
- **Development & Debugging** (verbose logging, development mode)
- **Performance Optimization** (reusePort, lowMemoryMode)
- **Advanced Configuration** (custom server constructors)

### 🚀 **bun-server-config.ts**
Working implementation with 6 different server configurations:
1. **Basic** - Simple HTTP server
2. **Production** - Production-ready with security headers
3. **TLS/HTTPS** - Secure server with SSL/TLS
4. **WebSocket** - Real-time bidirectional communication
5. **High-Performance** - Optimized for throughput
6. **Advanced** - Middleware pattern with authentication & rate limiting

## 🎯 What This Project Demonstrates

### Complete Bun.serve() Configuration Coverage
```typescript
// All available options implemented:
Bun.serve({
  // Network
  port: 3000,
  hostname: "localhost",

  // TLS/SSL
  tls: { key, cert, ca, passphrase, secureOptions },

  // WebSocket
  websocket: { open, message, close, drain, ping, pong },

  // Request/Response
  maxRequestBodySize: 10 * 1024 * 1024,
  error: (error) => Response,

  // Development
  development: true,
  verbose: true,

  // Performance
  reusePort: true,
  lowMemoryMode: false,

  // Advanced
  serverConstructor: CustomServer
});
```

### Real-World Examples
- ✅ HTTPS/TLS server setup
- ✅ WebSocket chat server
- ✅ Production API with security headers
- ✅ Middleware pattern implementation
- ✅ Rate limiting & authentication
- ✅ Performance benchmarking
- ✅ External API integration
- ✅ Comprehensive error handling

## 🚀 Quick Start

### Run All Examples
```bash
# Basic configuration
bun run bun-server-config.ts 1

# Production configuration
bun run bun-server-config.ts 2

# TLS/HTTPS configuration
bun run bun-server-config.ts 3

# WebSocket configuration
bun run bun-server-config.ts 4

# High-performance configuration
bun run bun-server-config.ts 5

# Advanced middleware configuration
bun run bun-server-config.ts 6
```

### Test Any Configuration
```bash
# Start server (example: basic config)
bun run bun-server-config.ts 1

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/info
curl http://localhost:3000/metrics
```

## 📋 Configuration Reference

### All Available Options
```typescript
interface BunServerConfig {
  // Required
  fetch: (request: Request, server: BunServer) => Response | Promise<Response>;

  // Network
  port?: number;                    // Default: 3000
  hostname?: string;               // Default: "0.0.0.0"

  // TLS/SSL
  tls?: {
    key: string | Buffer;          // Private key (PEM format)
    cert: string | Buffer;         // Certificate (PEM format)
    ca?: string | Buffer;          // Optional CA certificate
    passphrase?: string;           // Optional passphrase
    secureOptions?: number;        // OpenSSL options
  };

  // WebSocket
  websocket?: {
    open?: (ws: BunWebSocket) => void;
    message?: (ws: BunWebSocket, message: string | Buffer) => void;
    close?: (ws: BunWebSocket, code: number, reason: string) => void;
    drain?: (ws: BunWebSocket) => void;
    ping?: (ws: BunWebSocket, data: Buffer) => void;
    pong?: (ws: BunWebSocket, data: Buffer) => void;
  } | false;

  // Request/Response
  maxRequestBodySize?: number;     // Size in bytes
  error?: (error: Error) => Response | Promise<Response>;

  // Development
  development?: boolean;           // Enable development mode
  verbose?: boolean;               // Enable verbose logging

  // Performance
  reusePort?: boolean;             // SO_REUSEPORT for load balancing
  lowMemoryMode?: boolean;         // Optimize for low memory

  // Advanced
  serverConstructor?: typeof BunServer; // Custom server class
}
```

## 🎯 Use Cases

### Development
- **API prototyping** with instant feedback
- **Debug endpoint** for system inspection
- **Performance testing** with metrics

### Production
- **Health monitoring** via `/health` endpoint
- **Performance tracking** via `/metrics`
- **Debug information** for troubleshooting
- **Load testing** with request counting

### DevOps
- **Container health checks**
- **Performance monitoring**
- **Error rate tracking**
- **Resource usage monitoring**

## 🏗️ Architecture

### Original Enhanced API Server (index.ts)
The existing `index.ts` provides:
- **Class-based architecture** for clean code organization
- **Multi-endpoint routing** with automatic metrics collection
- **Comprehensive error handling** with structured responses
- **Production-ready logging** and monitoring
- **Real-world REST API integration** with JSONPlaceholder

### New Configuration Examples (bun-server-config.ts)
The new `bun-server-config.ts` provides:
- **6 complete server configurations** covering all Bun.serve() options
- **Production-ready patterns** for each use case
- **TypeScript implementations** with full type safety
- **Working examples** you can run immediately
- **Comprehensive documentation** for each configuration

## 📊 Feature Comparison

| Feature | index.ts | bun-server-config.ts |
|---------|----------|---------------------|
| Basic HTTP Server | ✅ | ✅ |
| Production Ready | ✅ | ✅ |
| TLS/HTTPS | ❌ | ✅ |
| WebSocket | ❌ | ✅ |
| High Performance | ❌ | ✅ |
| Middleware Pattern | ❌ | ✅ |
| Rate Limiting | ❌ | ✅ |
| Authentication | ❌ | ✅ |
| All Config Options | ❌ | ✅ |

## 🔧 Additional Files

### BUN_SERVER_CONFIGURATION.md
- Complete reference guide
- All configuration options explained
- Best practices and examples
- Environment variables
- Troubleshooting guide

### package.json
- TypeScript support
- Bun runtime dependencies
- Development scripts

### server.test.ts
- Test suite for server functionality
- Performance benchmarks
- Integration tests

## 🚢 Deployment

### Docker Ready
```dockerfile
FROM oven/bun:1.1.0
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["bun", "bun-server-config.ts", "2"]
```

### Environment Variables
```bash
# Network
PORT=3000
HOSTNAME=localhost

# TLS/SSL
SSL_KEY=/path/to/server.key
SSL_CERT=/path/to/server.crt

# Development
NODE_ENV=production
BUN_CONFIG_VERBOSE_FETCH=true
```

## 📚 Documentation Structure

```
test-project/
├── README.md                    # This file - overview & quick start
├── BUN_SERVER_CONFIGURATION.md  # Complete reference guide
├── bun-server-config.ts         # 6 working server configurations
├── index.ts                     # Original enhanced API server
├── package.json                 # Dependencies & scripts
└── server.test.ts              # Test suite
```

## 🎯 Next Steps

1. **Read the documentation**: Start with `BUN_SERVER_CONFIGURATION.md`
2. **Run the examples**: Try each configuration with `bun run bun-server-config.ts N`
3. **Customize**: Copy patterns to your own projects
4. **Deploy**: Use production configuration for live deployments

## 🤝 Contributing

All examples are production-ready and follow Bun best practices. Contributions welcome!

---

**Built with ❤️ using Bun**
**Based on official Bun documentation: https://bun.com/docs/runtime/http/server#configuration**

## 🚀 Quick Start with Bun Template System

### Option 1: Create from Local Template
```bash
# Clone this template to your project
bun create ./path/to/this/template my-api-server
cd my-api-server
bun install
bun run dev
```

### Option 2: Create from GitHub (when published)
```bash
bun create github.com/user/bun-enhanced-api-server my-api-server
cd my-api-server
bun install
bun run dev
```

### Option 3: Manual Setup
```bash
mkdir my-api-server
cd my-api-server
bun init -y
# Copy the files from this template
bun run index.ts
```

## 🌐 Real-World REST API Integration

This template demonstrates integration with **real external REST APIs** using Bun's native fetch capabilities. All examples use production-ready patterns with proper error handling.

### External API Endpoints Used

**JSONPlaceholder API** (https://jsonplaceholder.typicode.com):
- `GET /posts/1` - Retrieve a single post
- `GET /users/1` - Retrieve user information
- `GET /comments?postId=1` - Get post comments

**Example API Responses**:
```json
// GET https://jsonplaceholder.typicode.com/posts/1
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```

### Production API Patterns

This template follows **Bun's official best practices** for API development:
- ✅ Native TypeScript support
- ✅ Zero-config performance monitoring
- ✅ Built-in debugging capabilities
- ✅ Production-ready error handling
- ✅ External API integration patterns

### Real-World API Integration Example

When you call `/external` endpoint, the server demonstrates:

**1. Multiple API Calls with Composition**
```typescript
// Fetch post
const post = await fetch("https://jsonplaceholder.typicode.com/posts/1");

// Fetch author
const user = await fetch("https://jsonplaceholder.typicode.com/users/1");

// Fetch comments
const comments = await fetch("https://jsonplaceholder.typicode.com/comments?postId=1");
```

**2. Response Aggregation**
```json
{
  "status": "success",
  "message": "Real-world REST API integration demonstration completed",
  "data": {
    "post": {
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      "body": "quia et suscipit..."
    },
    "author": {
      "id": 1,
      "name": "Leanne Graham",
      "email": "Sincere@april.biz"
    },
    "comments": {
      "count": 5,
      "sample": [
        {
          "name": "id labore ex et quam laborum",
          "email": "Eliseo@gardner.biz",
          "body": "laudantium enim quasi est..."
        }
      ]
    }
  }
}
```

**3. Production Error Handling**
```json
{
  "status": "error",
  "message": "External API integration failed",
  "error": "NetworkError: Failed to fetch",
  "data": {
    "troubleshooting": [
      "Check network connectivity",
      "Verify API endpoint availability",
      "Review rate limits if applicable",
      "Check CORS policies for external APIs"
    ]
  }
}
```

### API Integration Best Practices

**1. Request Headers**
```typescript
const response = await fetch("https://api.example.com/data", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Bun-Enhanced-API-Server/1.0.0",
  },
});
```

**2. Error Handling**
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
} catch (error) {
  console.error('API call failed:', error);
  // Return structured error response
}
```

**3. Response Time Tracking**
```typescript
const start = Date.now();
const response = await fetch(url);
const duration = Date.now() - start;
console.log(`API call took ${duration}ms`);
```

### Integration with Bun Template System

This template is designed to work seamlessly with Bun's template creation system:

```bash
# Create new project from this template
bun create ./path/to/template my-api-project

# Install dependencies
bun install

# Run with real API integration
bun run dev

# Test the external API endpoint
curl http://localhost:3000/external
```

The template provides a **production-ready foundation** for building APIs that integrate with external services, with built-in monitoring, debugging, and performance tracking.

## 🚀 Features

### Core Capabilities
- **Class-based architecture** for clean code organization
- **TypeScript support** with full type safety
- **Multi-endpoint routing** with automatic metrics collection
- **Comprehensive error handling** with structured responses
- **Production-ready logging** and monitoring

### Advanced Features
- **Per-endpoint performance metrics** (requests, errors, response times)
- **Real-time server monitoring** via `/metrics` endpoint
- **Bun runtime integration** with version and system information
- **Memory usage tracking** and optimization insights
- **Environment detection** and feature flags

## 📊 Feature Matrix

| Feature | Category | Implementation | Status |
|---------|----------|----------------|--------|
| HTTP Server | Core | `Bun.serve()` | ✅ |
| TypeScript Support | Language | Full type safety | ✅ |
| Class Architecture | Design | `ApiServer` class | ✅ |
| Root Endpoint (`/`) | API | Welcome message | ✅ |
| Health Check (`/health`) | Monitoring | Uptime & version | ✅ |
| Debug Info (`/info`) | Debugging | Runtime & system data | ✅ |
| Metrics (`/metrics`) | Monitoring | Per-endpoint stats | ✅ |
| Error Handling | Reliability | 404 & 500 responses | ✅ |
| Response Timing | Performance | Per-request tracking | ✅ |
| Request Counting | Analytics | Total & per-endpoint | ✅ |
| Error Rate Tracking | Analytics | Percentage calculation | ✅ |
| Memory Monitoring | Debugging | Heap & external stats | ✅ |
| Environment Data | Debugging | Process & env info | ✅ |
| Feature Detection | Runtime | Bun capabilities | ✅ |
| External API Demo | Debugging | `/external` endpoint | ✅ |
| Verbose Fetch Logging | Debugging | `BUN_CONFIG_VERBOSE_FETCH` | ✅ |
| Request/Response Logs | Monitoring | Console output with curl format | ✅ |
| Toggle Verbose Mode | Debugging | `/verbose?enable=true` | ✅ |
| Performance Benchmark | Testing | `/bench?iterations=100&target=health` | ✅ |
| Real REST API Integration | Production | Multi-endpoint external API calls | ✅ |
| Production Error Handling | Reliability | Graceful failure with troubleshooting | ✅ |
| API Response Aggregation | Data Processing | Multiple API call composition | ✅ |

## 🏗️ Architecture

### Class Structure
```typescript
class ApiServer {
  private config: ServerConfig;
  private startTime: Date;
  private metrics: MetricsData;

  // Methods
  - updateMetrics()
  - handleHealthCheck()
  - handleRoot()
  - handleInfo()
  - handleMetrics()
  - handleNotFound()
  - fetchHandler()
  - start()
}
```

### Data Interfaces
```typescript
interface EndpointMetrics {
  requests: number;
  errors: number;
  avgResponseTime: number;
  totalResponseTime: number;
  lastAccess: Date | null;
}

interface MetricsData {
  totalRequests: number;
  totalErrors: number;
  uptime: string;
  endpoints: Record<string, EndpointMetrics>;
}
```

## 📡 API Endpoints

### `GET /`
**Purpose**: Root endpoint with server information
**Response**:
```json
{
  "status": "success",
  "message": "Welcome to your enhanced Bun project",
  "timestamp": "2025-12-27T00:00:00.000Z",
  "data": {
    "endpoints": ["/", "/health", "/info", "/metrics"],
    "server": "Bun HTTP Server"
  }
}
```

### `GET /health`
**Purpose**: Health check endpoint
**Response**:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-12-27T00:00:00.000Z",
  "data": {
    "uptime": "123456ms",
    "version": "1.0.0"
  }
}
```

### `GET /info`
**Purpose**: Comprehensive debug information
**Response**:
```json
{
  "status": "success",
  "message": "Server information",
  "timestamp": "2025-12-27T00:00:00.000Z",
  "data": {
    "runtime": "Bun",
    "bunVersion": "1.3.6",
    "bunRevision": "c08ffadf...",
    "server": {
      "port": 3000,
      "hostname": "localhost",
      "started": "2025-12-27T00:00:00.000Z",
      "uptime": "123456ms"
    },
    "system": {
      "platform": "darwin",
      "arch": "arm64",
      "version": "v24.3.0",
      "pid": 12345,
      "cwd": "/path/to/project"
    },
    "memory": {
      "heapUsed": 294318,
      "heapTotal": 692224,
      "external": 66750,
      "arrayBuffers": 0
    },
    "environment": {
      "nodeVersion": "v24.3.0",
      "env": {
        "PATH": "...",
        "HOME": "/Users/...",
        "BUN_INSTALL": "/Users/.../.bun"
      }
    },
    "features": {
      "isBun": true,
      "isMain": true,
      "hasJSX": true
    }
  }
}
```

### `GET /metrics`
**Purpose**: Per-endpoint performance metrics
**Response**:
```json
{
  "status": "success",
  "message": "Server metrics",
  "timestamp": "2025-12-27T00:00:00.000Z",
  "data": {
    "server": {
      "totalRequests": 150,
      "totalErrors": 3,
      "uptime": "123456ms",
      "startTime": "2025-12-27T00:00:00.000Z",
      "errorRate": "2.00%"
    },
    "endpoints": {
      "/": {
        "requests": 50,
        "errors": 0,
        "avgResponseTime": 0.12,
        "totalResponseTime": 6.0,
        "lastAccess": "2025-12-27T00:00:00.000Z"
      },
      "/health": {
        "requests": 40,
        "errors": 0,
        "avgResponseTime": 0.08,
        "totalResponseTime": 3.2,
        "lastAccess": "2025-12-27T00:00:00.000Z"
      },
      "/info": {
        "requests": 30,
        "errors": 0,
        "avgResponseTime": 0.15,
        "totalResponseTime": 4.5,
        "lastAccess": "2025-12-27T00:00:00.000Z"
      },
      "/metrics": {
        "requests": 30,
        "errors": 0,
        "avgResponseTime": 0.25,
        "totalResponseTime": 7.5,
        "lastAccess": "2025-12-27T00:00:00.000Z"
      },
      "/nonexistent": {
        "requests": 10,
        "errors": 10,
        "avgResponseTime": 0.05,
        "totalResponseTime": 0.5,
        "lastAccess": "2025-12-27T00:00:00.000Z"
      }
    }
  }
}
```

## 🚀 Quick Start

### Installation
```bash
cd test-project
bun install
```

### Development
```bash
bun run index.ts
```

### Testing Endpoints
```bash
# Test all endpoints
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/info
curl http://localhost:3000/metrics

# Test 404 handling
curl http://localhost:3000/nonexistent
```

## 📈 Performance Monitoring

### Real-time Metrics
The `/metrics` endpoint provides:
- **Total request count** across all endpoints
- **Error rate percentage** for health monitoring
- **Per-endpoint statistics** including:
  - Request count
  - Error count
  - Average response time
  - Total response time
  - Last access timestamp

### Response Time Tracking
Every request is automatically timed and recorded, allowing you to:
- Identify slow endpoints
- Monitor performance degradation
- Track optimization improvements

## 🔧 Configuration

### Server Configuration
```typescript
const server = new ApiServer({
  port: 3000,        // Custom port
  hostname: "localhost" // Custom hostname
});
```

### Adding New Endpoints
1. Add method to `ApiServer` class:
```typescript
private handleNewEndpoint(): Response {
  const response: ApiResponse = {
    status: "success",
    message: "New endpoint response",
    timestamp: new Date().toISOString(),
    data: { /* your data */ }
  };
  return Response.json(response);
}
```

2. Add route to `fetchHandler()`:
```typescript
case "/new":
  response = this.handleNewEndpoint();
  break;
```

Metrics are automatically tracked!

## 🎯 Use Cases

### Development
- **API prototyping** with instant feedback
- **Debug endpoint** for system inspection
- **Performance testing** with metrics

### Production
- **Health monitoring** via `/health` endpoint
- **Performance tracking** via `/metrics`
- **Debug information** for troubleshooting
- **Load testing** with request counting

### DevOps
- **Container health checks**
- **Performance monitoring**
- **Error rate tracking**
- **Resource usage monitoring**

## 🔍 Debugging

### Verbose Fetch Logging
This server includes **Bun's verbose fetch logging** capability, which provides detailed HTTP request/response information in curl format.

#### How It Works
When `BUN_CONFIG_VERBOSE_FETCH` is set to `"curl"`, Bun automatically logs:
- **Request details**: HTTP method, headers, body, URL
- **Response details**: Status code, headers, content length
- **Timing information**: Request duration
- **Compression**: Automatic gzip/deflate handling

#### Example Output

**Clean format (BUN_CONFIG_VERBOSE_FETCH="true"):**
```
[fetch] > HTTP/1.1 GET https://jsonplaceholder.typicode.com/posts/1
[fetch] > content-type: application/json
[fetch] > User-Agent: Bun/1.3.6
[fetch] < 200 OK
[fetch] < Content-Type: application/json; charset=utf-8
[fetch] < x-ratelimit-remaining: 999
```

**Curl format (BUN_CONFIG_VERBOSE_FETCH="curl"):**
```
[fetch] $ curl --http1.1 "https://example.com/" -X POST \
  -H "content-type: application/json" \
  -H "User-Agent: Bun/1.3.3" \
  --data-raw "{\"foo\":\"bar\"}"
[fetch] > HTTP/1.1 POST https://example.com/
[fetch] > content-type: application/json
[fetch] > Content-Length: 13
[fetch] < 200 OK
[fetch] < Content-Type: application/json
[fetch] < Content-Length: 1256
```

#### Usage Methods

**1. Per-Request Logging (Recommended)**
```bash
# Test external API with verbose logging
curl http://localhost:3000/external
```
The `/external` endpoint automatically enables verbose logging for that specific request.

**2. Global Toggle**
```bash
# Enable verbose logging globally
curl "http://localhost:3000/verbose?enable=true"

# Make your requests (all will be logged)
curl http://localhost:3000/health
curl http://localhost:3000/info

# Disable verbose logging
curl "http://localhost:3000/verbose?enable=false"
```

**3. Manual Environment Variable**
```bash
# Set before running server
export BUN_CONFIG_VERBOSE_FETCH=curl
bun index.ts
```

#### Debugging Scenarios

**API Integration Issues**
```bash
# Test external API calls with full visibility
curl http://localhost:3000/external
# Check server console for detailed curl output
```

**Performance Bottlenecks**
```bash
# Enable verbose mode and check response times
curl "http://localhost:3000/verbose?enable=true"
curl -w "@curl-format.txt" http://localhost:3000/metrics
```

**Header/Authentication Problems**
```bash
# See exact headers being sent/received
curl "http://localhost:3000/verbose?enable=true"
curl http://localhost:3000/your-endpoint
```

### Common Issues
- **Port already in use**: Change `port` in config
- **TypeScript errors**: Run `bun install` to update types
- **Metrics not updating**: Check `updateMetrics()` calls
- **Verbose logs not showing**: Ensure `BUN_CONFIG_VERBOSE_FETCH=curl` is set

### Debug Mode
Use `/info` endpoint to get:
- Bun version and revision
- System platform and architecture
- Memory usage statistics
- Environment variables
- Feature detection

### Performance Monitoring
Use `/metrics` endpoint to track:
- Request counts per endpoint
- Error rates and response times
- Server uptime and health
- Per-endpoint performance metrics

## 📚 Dependencies

### Bun Runtime
- **Bun.serve()**: HTTP server
- **Bun.version**: Runtime version
- **Bun.revision**: Build revision
- **process.memoryUsage()**: Memory stats

### TypeScript
- **Interfaces**: Type safety
- **Class methods**: Encapsulation
- **Response types**: API consistency

## 🏋️ Performance Benchmarking

The `/bench` endpoint provides comprehensive performance testing capabilities with detailed metrics and statistical analysis.

### Benchmark Endpoint
**Purpose**: Run performance tests against any server endpoint
**Parameters**:
- `iterations` (default: 100) - Number of test iterations
- `target` (default: "health") - Endpoint to test: `health`, `info`, `metrics`, or `external`

**Usage Examples**:
```bash
# Basic benchmark (100 iterations against /health)
curl http://localhost:3000/bench

# Custom iterations
curl "http://localhost:3000/bench?iterations=1000"

# Test specific endpoint
curl "http://localhost:3000/bench?iterations=500&target=info"

# Stress test
curl "http://localhost:3000/bench?iterations=5000&target=metrics"
```

### Benchmark Response Format
```json
{
  "status": "success",
  "message": "Benchmark completed: 100 iterations against /health",
  "timestamp": "2025-12-27T00:00:00.000Z",
  "data": {
    "target": "/health",
    "iterations": 100,
    "startTime": 1765810000000,
    "results": [
      {
        "iteration": 1,
        "responseTime": 0.05,
        "status": 200
      },
      // ... more results
    ],
    "summary": {
      "totalTime": 45,
      "averageResponseTime": 0.45,
      "minResponseTime": 0.02,
      "maxResponseTime": 1.2,
      "requestsPerSecond": "2222.22",
      "successRate": "100.00%",
      "failedRequests": 0
    }
  }
}
```

### Performance Metrics Explained

| Metric | Description | Use Case |
|--------|-------------|----------|
| **totalTime** | Total execution time in milliseconds | Overall performance assessment |
| **averageResponseTime** | Mean response time across all iterations | Baseline performance measurement |
| **minResponseTime** | Fastest response time | Best-case scenario performance |
| **maxResponseTime** | Slowest response time | Worst-case scenario / bottleneck detection |
| **requestsPerSecond** | Throughput in requests per second | Capacity planning |
| **successRate** | Percentage of successful requests | Reliability assessment |
| **failedRequests** | Number of failed requests | Error rate monitoring |

### Benchmarking Scenarios

**1. Baseline Performance Testing**
```bash
# Establish baseline for health check
curl "http://localhost:3000/bench?iterations=1000&target=health"
```

**2. Endpoint Comparison**
```bash
# Compare different endpoints
curl "http://localhost:3000/bench?iterations=100&target=health"
curl "http://localhost:3000/bench?iterations=100&target=info"
curl "http://localhost:3000/bench?iterations=100&target=metrics"
```

**3. Load Testing**
```bash
# High iteration count for stress testing
curl "http://localhost:3000/bench?iterations=10000&target=health"
```

**4. Performance Regression Detection**
```bash
# Run before and after changes to detect regressions
# Compare averageResponseTime and requestsPerSecond
```

### Console Output
During benchmark execution, the server logs progress:
```
[BENCH] Starting benchmark: 100 iterations against /health
[BENCH] Progress: 10/100 iterations completed
[BENCH] Progress: 20/100 iterations completed
...
[BENCH] Completed: 100 iterations in 45ms
[BENCH] Average: 0.45ms
[BENCH] RPS: 2222.22
```

### Best Practices
- **Start Small**: Begin with 100 iterations, then scale up
- **Isolate Tests**: Test one endpoint at a time for clear results
- **Monitor Resources**: Watch CPU/memory during high iteration counts
- **Compare Baselines**: Run benchmarks before and after changes
- **Production Caution**: Avoid heavy benchmarking on production servers

### Error Handling & Failing Tests
The benchmark endpoint gracefully handles errors and provides detailed failure analysis:

**Failing Test Example (404 errors):**
```bash
curl "http://localhost:3000/bench?iterations=10&target=nonexistent"
```

**Response with 100% failure rate:**
```json
{
  "status": "success",
  "message": "Benchmark completed: 10 iterations against /nonexistent",
  "data": {
    "target": "/nonexistent",
    "iterations": 10,
    "results": [
      {
        "iteration": 1,
        "responseTime": 0,
        "status": 404
      },
      // ... 9 more 404 responses
    ],
    "summary": {
      "totalTime": 0,
      "averageResponseTime": 0,
      "minResponseTime": 0,
      "maxResponseTime": 0,
      "requestsPerSecond": "Infinity",
      "successRate": "0.00%",
      "failedRequests": 10
    }
  }
}
```

**Key Error Handling Features:**
- ✅ **Graceful Failure**: Continues all iterations even if some fail
- ✅ **Status Tracking**: Records HTTP status for each iteration
- ✅ **Success Rate Calculation**: Clear percentage of successful requests
- ✅ **Failed Request Count**: Exact number of failures
- ✅ **Response Time Tracking**: Even for failed requests
- ✅ **Detailed Results**: Individual iteration data for debugging

**Use Cases for Failing Tests:**
- **Error Rate Monitoring**: Test reliability under failure conditions
- **Load Testing with Errors**: See how server handles mixed success/failure
- **API Validation**: Verify error responses are consistent
- **Performance Under Failure**: Measure response times even when requests fail

### Console Output
During benchmark execution, the server logs progress:
```
[BENCH] Starting benchmark: 10 iterations against /nonexistent
[BENCH] Progress: 10/10 iterations completed
[BENCH] Completed: 10 iterations in 0ms
[BENCH] Average: 0.00ms
[BENCH] RPS: Infinity
```

**Note**: When all requests fail, RPS shows "Infinity" because the calculation divides by zero total time.

## 🚢 Deployment

### Docker
```dockerfile
FROM oven/bun:1.3.6
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["bun", "index.ts"]
```

### Production Checklist
- [ ] Set appropriate port (80/443)
- [ ] Configure environment variables
- [ ] Enable process monitoring
- [ ] Set up log aggregation
- [ ] Configure health check endpoints
- [ ] Monitor metrics endpoint

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Enhancements welcome! Key areas:
- Additional metrics (CPU, network)
- Authentication middleware
- Rate limiting
- Request logging
- CORS support

---

**Built with ❤️ using Bun**
