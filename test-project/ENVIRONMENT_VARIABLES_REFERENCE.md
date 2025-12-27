# Bun HTTP Server - Environment Variables & Configuration Reference

This document provides a complete reference of all environment variables, configuration options, properties, and types used in Bun HTTP server configuration.

## 🔧 Environment Variables

### **Port Configuration Variables**

| Variable | Priority | Type | Default | Description | Example |
|----------|----------|------|---------|-------------|---------|
| **`BUN_PORT`** | 1st (highest) | `number` | - | Primary Bun port variable | `export BUN_PORT=8080` |
| **`PORT`** | 2nd | `number` | - | Standard Node.js port variable | `export PORT=3000` |
| **`NODE_PORT`** | 3rd | `number` | - | Legacy Node.js port variable | `export NODE_PORT=5000` |
| **`BUN_HOSTNAME`** | N/A | `string` | - | Hostname variable (not used by Bun) | `export BUN_HOSTNAME=localhost` |

### **Environment & Debug Variables**

| Variable | Type | Default | Description | Example |
|----------|------|---------|-------------|---------|
| **`NODE_ENV`** | `string` | `"development"` | Environment mode | `export NODE_ENV=production` |
| **`BUN_CONFIG_VERBOSE_FETCH`** | `string` | - | Fetch logging mode | `export BUN_CONFIG_VERBOSE_FETCH=true` |
| **`BUN_LOW_MEMORY_MODE`** | `boolean` | `false` | Memory optimization | `export BUN_LOW_MEMORY_MODE=true` |
| **`BUN_CONFIG_MAX_HTTP_REQUESTS`** | `number` | `256` | Max simultaneous HTTP requests (Bun 1.x) | `export BUN_CONFIG_MAX_HTTP_REQUESTS=512` |

### **TLS/SSL Variables**

| Variable | Type | Default | Description | Example |
|----------|------|---------|-------------|---------|
| **`SSL_KEY`** | `string` | - | Path to private key | `export SSL_KEY=/path/to/key.pem` |
| **`SSL_CERT`** | `string` | - | Path to certificate | `export SSL_CERT=/path/to/cert.pem` |
| **`SSL_CA`** | `string` | - | Path to CA certificate | `export SSL_CA=/path/to/ca.pem` |
| **`SSL_PASSPHRASE`** | `string` | - | Key passphrase | `export SSL_PASSPHRASE=secret` |

---

## ⚙️ Configuration Options

### **Bun.serve() Options Interface**

```typescript
interface BunServerConfig {
  // Required
  fetch: (request: Request, server: BunServer) => Response | Promise<Response>;

  // Network Configuration
  port?: number;                    // Port to listen on
  hostname?: string;               // Hostname/IP to bind to

  // TLS/SSL Configuration
  tls?: {
    key: string | Buffer;          // Private key (PEM format)
    cert: string | Buffer;         // Certificate (PEM format)
    ca?: string | Buffer;          // Optional CA certificate
    passphrase?: string;           // Optional passphrase
    secureOptions?: number;        // OpenSSL options
  };

  // WebSocket Configuration
  websocket?: {
    open?: (ws: BunWebSocket) => void;
    message?: (ws: BunWebSocket, message: string | Buffer) => void;
    close?: (ws: BunWebSocket, code: number, reason: string) => void;
    drain?: (ws: BunWebSocket) => void;
    ping?: (ws: BunWebSocket, data: Buffer) => void;
    pong?: (ws: BunWebSocket, data: Buffer) => void;
  } | false;

  // Request/Response Configuration
  maxRequestBodySize?: number;     // Maximum request body size in bytes
  error?: (error: Error) => Response | Promise<Response>;

  // Development/Debugging
  development?: boolean;           // Enable development mode
  verbose?: boolean;               // Enable verbose logging

  // Performance
  reusePort?: boolean;             // Enable SO_REUSEPORT
  lowMemoryMode?: boolean;         // Optimize for low memory

  // Advanced
  serverConstructor?: typeof BunServer; // Custom server class
}
```

---

## 📊 Property Types & Values

### **Network Properties**

| Property | Type | Required | Default | Values | Description |
|----------|------|----------|---------|--------|-------------|
| **`port`** | `number` | No | `3000` | 1-65535, `0` (random) | Server listening port |
| **`hostname`** | `string` | No | `"0.0.0.0"` | `"localhost"`, `"0.0.0.0"`, IP addresses | Server binding address |

### **Port Behavior Matrix**

| Port Value | Behavior | Use Case |
|------------|----------|----------|
| `undefined` | Try 3000, 3001, 3002... | Development |
| `0` | Random available port | Testing/CI |
| `3000` | Specific port | Development |
| `8080` | Specific port | Production |
| `80` | Requires root/admin | Production (with proxy) |

### **Hostname Behavior Matrix**

| Hostname | Accessibility | Use Case |
|----------|---------------|----------|
| `"localhost"` | Local machine only | Development |
| `"0.0.0.0"` | All network interfaces | Production/Docker |
| `"127.0.0.1"` | Local IPv4 only | Development |
| `"::1"` | Local IPv6 only | IPv6 testing |
| `"192.168.1.100"` | Specific IP only | Multi-homed servers |

---

## 🔄 Fallback Priority Chain

### **Port Selection Priority**

```
1. Explicit port parameter in code
   ↓ (highest priority)
2. $BUN_PORT environment variable
   ↓
3. $PORT environment variable
   ↓
4. $NODE_PORT environment variable
   ↓
5. Default: 3000
   ↓ (lowest priority)
```

### **Hostname Selection Priority**

```
1. Explicit hostname parameter in code
   ↓ (highest priority)
2. Default: "0.0.0.0"
   ↓ (lowest priority)
```

---

## 🎯 Configuration Examples by Use Case

### **0. Code Formatting**
Bun includes a built-in, high-performance code formatter that is a drop-in replacement for Prettier.

```bash
# Format all files in the current directory
bun fmt
```

### **1. Development Environment**
```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  port: 3000,                    // Fixed port for development
  hostname: "localhost",         // Local only
  development: true,             // Enable dev features
  verbose: true,                 // Detailed logging
  fetch: (req) => {
    return Response.json({
      message: "Development server",
      url: req.url,
      timestamp: new Date().toISOString()
    });
  }
});

console.log(`Dev server: ${server.url}`);
```

**Environment Variables:**
```bash
export NODE_ENV=development
# Optional: export BUN_PORT=3000
```

---

### **2. Production Environment**
```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  port: parseInt(process.env.BUN_PORT || process.env.PORT || "8080"),
  hostname: "0.0.0.0",          // Accept all connections
  development: false,           // Production mode
  maxRequestBodySize: 10 * 1024 * 1024, // 10MB limit
  reusePort: true,              // Load balancing
  error: (error) => {
    console.error("Server error:", error);
    return Response.json({ error: "Internal error" }, { status: 503 });
  },
  fetch: (req) => {
    // Production logic
    return Response.json({ status: "ok" });
  }
});

console.log(`Production server on port ${server.port}`);
```

**Environment Variables:**
```bash
export NODE_ENV=production
export BUN_PORT=8080
```

---

### **3. Docker/Container**
```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  port: parseInt(process.env.PORT || "3000"), // Docker sets PORT
  hostname: "0.0.0.0",                       // Required for containers
  development: process.env.NODE_ENV !== "production",
  fetch: (req) => {
    return Response.json({
      message: "Containerized Bun server",
      health: "healthy"
    });
  }
});

console.log(`Container server: 0.0.0.0:${server.port}`);
```

**Dockerfile:**
```dockerfile
FROM oven/bun:1.1.0
WORKDIR /app
COPY . .
EXPOSE 3000
ENV PORT=3000
CMD ["bun", "server.ts"]
```

---

### **4. TLS/HTTPS Server**
```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  port: parseInt(process.env.PORT || "443"),
  hostname: "0.0.0.0",
  tls: {
    key: process.env.SSL_KEY || await Bun.file("/certs/server.key").text(),
    cert: process.env.SSL_CERT || await Bun.file("/certs/server.crt").text(),
    ca: process.env.SSL_CA ? await Bun.file(process.env.SSL_CA).text() : undefined,
    passphrase: process.env.SSL_PASSPHRASE,
    secureOptions: 0 // Default OpenSSL options
  },
  fetch: (req) => {
    return Response.json({
      secure: true,
      protocol: "HTTPS",
      message: "Secure Bun server"
    });
  }
});

console.log(`Secure server: https://${server.hostname}:${server.port}`);
```

**Environment Variables:**
```bash
export PORT=443
export SSL_KEY=/certs/server.key
export SSL_CERT=/certs/server.crt
# Optional: export SSL_CA=/certs/ca.crt
# Optional: export SSL_PASSPHRASE=secret
```

---

### **5. WebSocket Server**
```typescript
// server.ts
import { serve } from "bun";

const connections = new Set();

const server = Bun.serve({
  port: parseInt(process.env.BUN_PORT || "3001"),
  hostname: process.env.HOSTNAME || "localhost",
  fetch: (req, server) => {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      const userId = url.searchParams.get("userId") || "anonymous";

      const success = server.upgrade(req, {
        data: { userId, joined: Date.now() }
      });

      return success
        ? new Response("WebSocket upgrade successful", { status: 101 })
        : new Response("WebSocket upgrade failed", { status: 400 });
    }

    return Response.json({ message: "WebSocket server ready" });
  },
  websocket: {
    open: (ws) => {
      connections.add(ws);
      console.log(`${ws.data.userId} connected`);
      ws.send(JSON.stringify({ type: "welcome", userId: ws.data.userId }));
    },
    message: (ws, message) => {
      const data = JSON.parse(message.toString());
      // Echo and broadcast
      ws.send(JSON.stringify({ type: "echo", data }));
      connections.forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify({
            type: "broadcast",
            from: ws.data.userId,
            message: data
          }));
        }
      });
    },
    close: (ws, code, reason) => {
      connections.delete(ws);
      console.log(`${ws.data.userId} disconnected`);
    }
  }
});

console.log(`WebSocket server: ws://${server.hostname}:${server.port}/ws`);
```

**Environment Variables:**
```bash
export BUN_PORT=3001
export HOSTNAME=localhost
```

---

### **6. Random Port (Testing)**
```typescript
// server.ts
import { serve } from "bun";

const server = Bun.serve({
  port: 0, // Random available port
  hostname: "localhost",
  fetch: (req) => {
    return Response.json({
      message: "Random port server",
      port: server.port,
      url: server.url.toString()
    });
  }
});

console.log(`Random port: ${server.port}`);
console.log(`URL: ${server.url}`);

// Export for testing
export { server };
```

**Use Cases:**
- Unit tests (no port conflicts)
- CI/CD pipelines
- Multiple parallel instances

---

## 🔍 Type Definitions

### **Server Interface (Official Bun API)**
```typescript
interface Server extends Disposable {
  /**
   * Stop the server from accepting new connections.
   * @param closeActiveConnections If true, immediately terminates all connections
   * @returns Promise that resolves when the server has stopped
   */
  stop(closeActiveConnections?: boolean): Promise<void>;

  /**
   * Update handlers without restarting the server.
   * Only fetch and error handlers can be updated.
   */
  reload(options: Serve): void;

  /**
   * Make a request to the running server.
   * Useful for testing or internal routing.
   */
  fetch(request: Request | string): Response | Promise<Response>;

  /**
   * Upgrade an HTTP request to a WebSocket connection.
   * @returns true if upgrade successful, false if failed
   */
  upgrade<T = undefined>(
    request: Request,
    options?: {
      headers?: Bun.HeadersInit;
      data?: T;
    },
  ): boolean;

  /**
   * Publish a message to all WebSocket clients subscribed to a topic.
   * @returns Bytes sent, 0 if dropped, -1 if backpressure applied
   */
  publish(
    topic: string,
    data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
    compress?: boolean,
  ): ServerWebSocketSendStatus;

  /**
   * Get count of WebSocket clients subscribed to a topic.
   */
  subscriberCount(topic: string): number;

  /**
   * Get client IP address and port.
   * @returns null for closed requests or Unix sockets
   */
  requestIP(request: Request): SocketAddress | null;

  /**
   * Set custom idle timeout for a request.
   * @param seconds Timeout in seconds, 0 to disable
   */
  timeout(request: Request, seconds: number): void;

  /**
   * Keep process alive while server is running.
   */
  ref(): void;

  /**
   * Allow process to exit if server is only thing running.
   */
  unref(): void;

  /** Number of in-flight HTTP requests */
  readonly pendingRequests: number;

  /** Number of active WebSocket connections */
  readonly pendingWebSockets: number;

  /** Server URL including protocol, hostname and port */
  readonly url: URL;

  /** Port server is listening on */
  readonly port: number;

  /** Hostname server is bound to */
  readonly hostname: string;

  /** Whether server is in development mode */
  readonly development: boolean;

  /** Server instance identifier */
  readonly id: string;
}
```

### **WebSocketHandler Interface (Official Bun API)**
```typescript
interface WebSocketHandler<T = undefined> {
  /** Maximum WebSocket message size in bytes */
  maxPayloadLength?: number;

  /** Bytes of queued messages before applying backpressure */
  backpressureLimit?: number;

  /** Whether to close connection when backpressure limit hit */
  closeOnBackpressureLimit?: boolean;

  /** Called when backpressure is relieved */
  drain?(ws: ServerWebSocket<T>): void | Promise<void>;

  /** Seconds before idle timeout */
  idleTimeout?: number;

  /** Enable per-message deflate compression */
  perMessageDeflate?:
    | boolean
    | {
        compress?: WebSocketCompressor | boolean;
        decompress?: WebSocketCompressor | boolean;
      };

  /** Send ping frames to keep connection alive */
  sendPings?: boolean;

  /** Whether server receives its own published messages */
  publishToSelf?: boolean;

  /** Called when connection opened */
  open?(ws: ServerWebSocket<T>): void | Promise<void>;

  /** Called when message received */
  message(ws: ServerWebSocket<T>, message: string | Buffer): void | Promise<void>;

  /** Called when connection closed */
  close?(ws: ServerWebSocket<T>, code: number, reason: string): void | Promise<void>;

  /** Called when ping frame received */
  ping?(ws: ServerWebSocket<T>, data: Buffer): void | Promise<void>;

  /** Called when pong frame received */
  pong?(ws: ServerWebSocket<T>, data: Buffer): void | Promise<void>;
}
```

### **TLSOptions Interface (Official Bun API)**
```typescript
interface TLSOptions {
  /** Certificate authority chain */
  ca?: string | Buffer | BunFile | Array<string | Buffer | BunFile>;

  /** Server certificate */
  cert?: string | Buffer | BunFile | Array<string | Buffer | BunFile>;

  /** Path to DH parameters file */
  dhParamsFile?: string;

  /** Private key */
  key?: string | Buffer | BunFile | Array<string | Buffer | BunFile>;

  /** Reduce TLS memory usage */
  lowMemoryMode?: boolean;

  /** Private key passphrase */
  passphrase?: string;

  /** OpenSSL options flags */
  secureOptions?: number;

  /** Server name for SNI */
  serverName?: string;
}
```

---

## 📋 Quick Reference Table

### **Configuration Matrix**

| Option | Type | Default | Priority | Linked Documentation |
|--------|------|---------|----------|---------------------|
| **`port`** | `number` | `3000` | Explicit > Env > Default | [Test Matrix](COMPLETE_TEST_MATRIX.md) |
| **`hostname`** | `string` | `"0.0.0.0"` | Explicit only | [Port/Host Guide](PORT_HOSTNAME_ENV.md) |
| **`BUN_PORT`** | `env` | - | 1st (highest) | [Env Variables](#environment-variables) |
| **`PORT`** | `env` | - | 2nd | [Env Variables](#environment-variables) |
| **`NODE_PORT`** | `env` | - | 3rd | [Env Variables](#environment-variables) |
| **`NODE_ENV`** | `env` | `"development"` | - | [Examples](#configuration-examples-by-use-case) |
| **`development`** | `boolean` | `false` | - | [BUN_SERVER_CONFIGURATION.md](BUN_SERVER_CONFIGURATION.md) |
| **`verbose`** | `boolean` | `false` | - | [Debugging Section](BUN_SERVER_CONFIGURATION.md#development--debugging) |
| **`maxRequestBodySize`** | `number` | `Infinity` | - | [Request Config](BUN_SERVER_CONFIGURATION.md#requestresponse-configuration) |
| **`reusePort`** | `boolean` | `false` | - | [Performance](BUN_SERVER_CONFIGURATION.md#performance-optimization) |
| **`lowMemoryMode`** | `boolean` | `false` | - | [Performance](BUN_SERVER_CONFIGURATION.md#performance-optimization) |
| **`error`** | `function` | - | - | [Error Handling](BUN_SERVER_CONFIGURATION.md#error-handler) |
| **`websocket`** | `object` | - | - | [WebSocket Config](BUN_SERVER_CONFIGURATION.md#websocket-configuration) |
| **`tls`** | `object` | - | - | [TLS Config](BUN_SERVER_CONFIGURATION.md#tls-ssl-configuration) |

---

## 🎯 Common Patterns

### **Pattern 1: Simple Development**
```typescript
Bun.serve({
  port: 3000,
  hostname: "localhost",
  fetch: () => new Response("Hello")
});
```

### **Pattern 2: Production with Env Vars**
```typescript
Bun.serve({
  port: parseInt(process.env.BUN_PORT || "8080"),
  hostname: "0.0.0.0",
  fetch: () => new Response("OK")
});
```

### **Pattern 3: Random Port for Testing**
```typescript
Bun.serve({
  port: 0,
  fetch: () => new Response("Test")
});
```

### **Pattern 4: Full Featured**
```typescript
Bun.serve({
  port: parseInt(process.env.BUN_PORT || "3000"),
  hostname: process.env.HOSTNAME || "localhost",
  development: process.env.NODE_ENV !== "production",
  maxRequestBodySize: 10 * 1024 * 1024,
  reusePort: true,
  error: (error) => Response.json({ error: "Server error" }, { status: 500 }),
  fetch: (req) => Response.json({ status: "ok" })
});
```

---

## 🔗 Links to Detailed Documentation

- **[Complete Test Matrix](COMPLETE_TEST_MATRIX.md)** - Expected outputs for all configurations
- **[BUN_SERVER_CONFIGURATION.md](BUN_SERVER_CONFIGURATION.md)** - Detailed option explanations
- **[PORT_HOSTNAME_ENV.md](PORT_HOSTNAME_ENV.md)** - Environment variable fallback system
- **[RANDOM_PORT_INFO.md](RANDOM_PORT_INFO.md)** - Random port selection guide
- **[README.md](README.md)** - Quick start and overview

---

## ✅ Verification Checklist

Use this checklist to verify your configuration:

- [ ] **Port**: Explicit, env var, or default (3000)?
- [ ] **Hostname**: Localhost (dev) or 0.0.0.0 (prod)?
- [ ] **Environment**: NODE_ENV set correctly?
- [ ] **Security**: CORS, rate limiting, auth?
- [ ] **Performance**: reusePort, maxRequestBodySize?
- [ ] **Error Handling**: Global error handler?
- [ ] **Logging**: verbose mode for debugging?
- [ ] **TLS**: Certificates configured for HTTPS?
- [ ] **WebSocket**: Handlers defined if needed?
- [ ] **Testing**: Random port for CI/CD?

---

*Based on Bun official documentation: https://bun.com/docs/runtime/http/server#configuration*
*Last Updated: December 2025*
