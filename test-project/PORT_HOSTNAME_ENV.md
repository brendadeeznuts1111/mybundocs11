# Bun Port and Hostname Environment Variable Configuration

This document specifically covers the environment variable fallback system for port and hostname configuration in Bun.serve(), based on the official Bun documentation.

## Environment Variable Fallback Chain

Bun provides a sophisticated fallback system for port configuration that automatically checks multiple environment variables in order:

### Port Configuration

```typescript
Bun.serve({
  port: 8080, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  fetch(req) {
    return new Response("Hello!");
  },
});
```

**Fallback Order:**
1. **Explicit `port` parameter** in code (highest priority)
2. **`$BUN_PORT`** environment variable
3. **`$PORT`** environment variable
4. **`$NODE_PORT`** environment variable
5. **`3000`** (default if none specified)

### Hostname Configuration

```typescript
Bun.serve({
  hostname: "mydomain.com", // defaults to "0.0.0.0"
  fetch(req) {
    return new Response("Hello!");
  },
});
```

**Default Behavior:**
- If `hostname` is not specified, defaults to **`"0.0.0.0"`** (all interfaces)
- If `hostname` is specified, it takes precedence over any environment variables

## Complete Configuration Example

```typescript
import { serve } from "bun";

const server = Bun.serve({
  port: 8080, // Explicit port (highest priority)
  hostname: "mydomain.com", // Explicit hostname
  fetch(req) {
    return new Response("404!");
  },
});

console.log(`Server running at ${server.url}`);
```

## Environment Variable Examples

### Using Environment Variables

```bash
# Set environment variables
export BUN_PORT=9000
export HOSTNAME=localhost

# Run server (will use BUN_PORT=9000)
bun run server.ts
```

### Code with Environment Variable Support

```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  // Port will be: 8080 (explicit) > $BUN_PORT > $PORT > $NODE_PORT > 3000
  port: 8080,

  // Hostname will be: "mydomain.com" (explicit) > "0.0.0.0" (default)
  hostname: "mydomain.com",

  fetch(req) {
    return new Response("Hello from Bun!");
  }
});

console.log(`Server running on ${server.url}`);
```

## Practical Usage Patterns

### 1. Development vs Production

```typescript
// server.ts
import { serve } from "bun";

const isProduction = process.env.NODE_ENV === "production";

const server = Bun.serve({
  // Development: 3000, Production: use env vars or 8080
  port: isProduction ? undefined : 3000,

  // Development: localhost, Production: 0.0.0.0
  hostname: isProduction ? "0.0.0.0" : "localhost",

  fetch(req) {
    return new Response(`Environment: ${process.env.NODE_ENV || 'development'}`);
  }
});

console.log(`Server running at ${server.url}`);
```

### 2. Docker Deployment

```dockerfile
# Dockerfile
FROM oven/bun:1.1.0
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["bun", "server.ts"]
```

```bash
# docker-compose.yml
version: '3'
services:
  web:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - BUN_PORT=8080
```

### 3. Heroku/Render/Fly.io

```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  // Heroku sets $PORT, so Bun will use it automatically
  // No need to specify port explicitly
  port: undefined, // Let Bun use $PORT from environment

  hostname: "0.0.0.0", // Required for cloud platforms

  fetch(req) {
    return new Response("Hello from cloud!");
  }
});

console.log(`Server running on port ${server.port}`);
```

### 4. Multiple Environment Support

```typescript
// server.ts
import { serve } from "bun";

// Configuration based on environment
const config = {
  development: {
    port: 3000,
    hostname: "localhost"
  },
  staging: {
    port: undefined, // Use $PORT or 8080
    hostname: "0.0.0.0"
  },
  production: {
    port: undefined, // Use $PORT or 8080
    hostname: "0.0.0.0"
  }
};

const env = process.env.NODE_ENV || "development";
const serverConfig = config[env as keyof typeof config] || config.development;

const server = Bun.serve({
  ...serverConfig,
  fetch(req) {
    return new Response(`Environment: ${env}`);
  }
});

console.log(`[${env}] Server running at ${server.url}`);
```

## Environment Variable Priority Examples

### Example 1: All Variables Set

```bash
export BUN_PORT=9000
export PORT=8000
export NODE_PORT=7000
```

```typescript
Bun.serve({
  fetch: () => new Response("Test")
  // Will use: 9000 (from BUN_PORT)
  // Because BUN_PORT has highest priority among env vars
});
```

### Example 2: Partial Variables

```bash
export PORT=8000
# BUN_PORT and NODE_PORT not set
```

```typescript
Bun.serve({
  fetch: () => new Response("Test")
  // Will use: 8000 (from PORT)
  // Because PORT is checked after BUN_PORT (which isn't set)
});
```

### Example 3: No Variables

```bash
# No environment variables set
```

```typescript
Bun.serve({
  fetch: () => new Response("Test")
  // Will use: 3000 (default)
});
```

### Example 4: Explicit Overrides Everything

```bash
export BUN_PORT=9000
export PORT=8000
```

```typescript
Bun.serve({
  port: 7000,  // This overrides everything
  fetch: () => new Response("Test")
  // Will use: 7000 (explicit parameter)
});
```

## Common Deployment Scenarios

### Scenario 1: Local Development

```bash
# No environment variables needed
bun run server.ts
# Uses default: 3000, localhost
```

### Scenario 2: Production with Environment Variables

```bash
# Set in production environment
export BUN_PORT=8080
export NODE_ENV=production

bun run server.ts
# Uses: 8080 (from BUN_PORT)
```

### Scenario 3: Platform as a Service (Heroku, Render, etc.)

```bash
# Platform sets PORT automatically
# No configuration needed in code
bun run server.ts
# Uses: $PORT from platform
```

### Scenario 4: Docker Container

```dockerfile
# Dockerfile
FROM oven/bun:1.1.0
WORKDIR /app
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["bun", "server.ts"]
```

```typescript
// server.ts
Bun.serve({
  fetch: () => new Response("Hello")
  // Uses: $PORT=8080 from environment
});
```

## Best Practices

### 1. Always Provide Defaults

```typescript
// Good
const server = Bun.serve({
  port: parseInt(process.env.PORT || "3000"),
  fetch: () => new Response("Hello")
});

// Also good (let Bun handle defaults)
const server = Bun.serve({
  fetch: () => new Response("Hello")
  // Bun will use: $BUN_PORT > $PORT > $NODE_PORT > 3000
});
```

### 2. Use Environment-Specific Configuration

```typescript
const server = Bun.serve({
  port: process.env.NODE_ENV === "production"
    ? undefined  // Let Bun use env vars
    : 3000,      // Fixed dev port
  hostname: process.env.NODE_ENV === "production"
    ? "0.0.0.0"  // Accept external connections
    : "localhost", // Local only
  fetch: () => new Response("Hello")
});
```

### 3. Document Required Environment Variables

```typescript
// README.md
/*
## Environment Variables

- `BUN_PORT`: Port to listen on (default: 3000)
- `PORT`: Alternative port variable (fallback)
- `NODE_PORT`: Node.js compatible port variable (fallback)
- `NODE_ENV`: Environment (production/development)

## Quick Start

# Development
bun run server.ts

# Production
export BUN_PORT=8080
export NODE_ENV=production
bun run server.ts
*/
```

### 4. Validate Port Numbers

```typescript
const port = parseInt(process.env.BUN_PORT || process.env.PORT || "3000");

if (port < 1024 || port > 65535) {
  throw new Error(`Invalid port: ${port}. Must be between 1024-65535`);
}

const server = Bun.serve({
  port,
  fetch: () => new Response("Hello")
});
```

## Troubleshooting

### Problem: Server uses wrong port

**Solution:** Check environment variables:
```bash
echo $BUN_PORT
echo $PORT
echo $NODE_PORT
```

### Problem: Server not accessible from network

**Solution:** Ensure hostname is "0.0.0.0":
```typescript
Bun.serve({
  hostname: "0.0.0.0",  // Not "localhost"
  fetch: () => new Response("Hello")
});
```

### Problem: Port already in use

**Solution:** Let Bun auto-select:
```typescript
Bun.serve({
  // Don't specify port - Bun will find available one
  fetch: () => new Response("Hello")
});
```

## Summary

| Priority | Source | Example |
|----------|--------|---------|
| 1 | Explicit `port` parameter | `port: 8080` |
| 2 | `$BUN_PORT` environment | `export BUN_PORT=8080` |
| 3 | `$PORT` environment | `export PORT=8080` |
| 4 | `$NODE_PORT` environment | `export NODE_PORT=8080` |
| 5 | Default value | `3000` |

**Hostname:** Always defaults to `"0.0.0.0"` unless explicitly specified.

---

*Based on Bun official documentation: [bun.sh/docs/runtime/http/server](https://bun.sh/docs/runtime/http/server#configuration)*
