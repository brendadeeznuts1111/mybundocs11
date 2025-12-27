# Bun HTTP Server Configuration

Complete reference for `Bun.serve()` based on official documentation.

## Basic Setup

```ts
const server = Bun.serve({
  fetch(req) {
    return new Response("Hello, Bun!");
  },
  port: 3000,
});

console.log(`Server running at ${server.url}`);
```

## Routes Object (Bun v1.2.3+)

Cleaner routing without manual `switch` statements:

```ts
const server = Bun.serve({
  routes: {
    "/": () => Response.json({ message: "Hello!" }),
    "/api/users": {
      GET: () => Response.json({ users: [] }),
      POST: async (req) => {
        const body = await req.json();
        return Response.json({ created: true });
      }
    },
    "/api/users/:id": (req) => {
      return Response.json({ id: req.params.id });
    },
    "/api/*": Response.json({ error: "Not found" }, { status: 404 }),
  },
  // Fallback for Bun < 1.2.3
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  }
});
```

### Route Types

| Pattern | Example | Description |
|---------|---------|-------------|
| Static | `"/api/status"` | Exact path match |
| Dynamic | `"/users/:id"` | Parameter capture via `req.params` |
| Wildcard | `"/api/*"` | Matches any sub-path |
| Method-based | `"/api/posts": { GET, POST }` | Per-HTTP method handlers |

### Static Responses

Zero-allocation for cached responses:

```ts
routes: {
  "/health": new Response("OK", { headers: { "Content-Type": "text/plain" } }),
  "/pong": new Response("pong"),
}
```

## Hot Route Reloading

Update routes without server restarts:

```ts
const server = Bun.serve({
  routes: {
    "/api/version": () => Response.json({ version: "1.0.0" }),
  },
});

// Deploy new routes without downtime
server.reload({
  routes: {
    "/api/version": () => Response.json({ version: "2.0.0" }),
  },
});
```

## Server Lifecycle

### `server.stop()`

```ts
// Graceful shutdown - waits for in-flight requests
await server.stop();

// Force stop all connections
await server.stop(true);
```

### `server.ref()` and `server.unref()`

```ts
// Don't keep process alive if server is the only thing running
server.unref();

// Restore default behavior
server.ref();
```

## Per-Request Controls

### `server.timeout(Request, seconds)`

```ts
const server = Bun.serve({
  async fetch(req, server) {
    // Set 60 second timeout for this request
    server.timeout(req, 60);

    await req.text();
    return new Response("Done!");
  },
});

// Disable timeout for a request
server.timeout(req, 0);
```

### `server.requestIP(Request)`

```ts
const server = Bun.serve({
  fetch(req, server) {
    const address = server.requestIP(req);
    if (address) {
      return new Response(`Client: ${address.address}:${address.port}`);
    }
    return new Response("Unknown");
  },
});
```

Returns `null` for closed requests or Unix sockets.

## Server Properties

```ts
const server = Bun.serve({ fetch: () => new Response("OK") });

server.url;                    // Full URL
server.port;                   // Port number
server.hostname;               // Hostname
server.development;            // Development mode (based on NODE_ENV)
server.id;                     // Server instance ID
server.pendingRequests;        // In-flight requests count
server.pendingWebSockets;      // Active WebSocket connections
```

## Port Configuration

```ts
// Explicit port
Bun.serve({ port: 8080 });

// Random available port
const server = Bun.serve({ port: 0 });
console.log(server.port); // e.g., 3456

// Environment variables (fallback order)
process.env.BUN_PORT || process.env.PORT || process.env.NODE_PORT
```

## TLS/HTTPS

```ts
const server = Bun.serve({
  port: 3443,
  hostname: "localhost",
  tls: {
    key: await Bun.file("server.key").arrayBuffer(),
    cert: await Bun.file("server.crt").arrayBuffer(),
    ca: await Bun.file("ca.crt").arrayBuffer(),
    passphrase: "optional-passphrase",
    secureOptions: 0, // OpenSSL flags
  },
  fetch: () => new Response("Secure!")
});
```

## WebSocket

```ts
const server = Bun.serve({
  fetch(req, server) {
    if (req.url.endsWith("/ws")) {
      const success = server.upgrade(req, {
        data: { timestamp: Date.now() }
      });
      return success ? new Response(null, { status: 101 }) : new Response("Upgrade failed", { status: 400 });
    }
    return new Response("Not found", { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log("Client connected");
    },
    message(ws, message) {
      console.log(`Received: ${message}`);
      ws.send(`Echo: ${message}`);
    },
    close(ws, code, reason) {
      console.log(`Closed: ${code} - ${reason}`);
    },
    drain(ws) {
      console.log("Backpressure relieved");
    }
  }
});
```

### WebSocket Topics (Pub/Sub)

```ts
// Subscribe client to topic
ws.subscribe("chat");

// Publish to all subscribers
server.publish("chat", "Hello everyone!");

// Check subscriber count
server.subscriberCount("chat");
```

## Performance Options

```ts
Bun.serve({
  reusePort: true,              // SO_REUSEPORT for load balancing
  maxRequestBodySize: 100_000_000, // 100MB limit
  lowMemoryMode: true,          // Reduce memory usage
  idleTimeout: 30,              // Seconds before closing idle connections
});
```

## Error Handling

```ts
Bun.serve({
  fetch: () => { throw new Error("Oops!"); },
  error(error) {
    console.error(error);
    return new Response("Internal Error", { status: 500 });
  }
});
```

## Environment-Based Configuration

```ts
const isDevelopment = process.env.NODE_ENV !== "production";

const server = Bun.serve({
  development: isDevelopment, // Sets server.development automatically
  fetch(req) {
    // Use server.development for runtime checks
    if (server.development) {
      // Dev-only logging
    }
    return new Response("OK");
  }
});
```

## Complete Example

```ts
import type { Serve } from "bun";

export default {
  development: process.env.NODE_ENV !== "production",

  routes: {
    "/": () => Response.json({ message: "API v1" }),
    "/health": () => Response.json({ status: "healthy" }),
    "/api/users": {
      GET: () => Response.json({ users: [] }),
      POST: async (req) => Response.json({ created: true }, { status: 201 }),
    },
    "/api/users/:id": (req) => Response.json({ id: req.params.id }),
  },

  error(error) {
    console.error(error);
    return new Response("Internal Error", { status: 500 });
  },

  port: parseInt(process.env.PORT || "3000"),
  hostname: process.env.HOSTNAME || "0.0.0.0",

} satisfies Serve;
```

## Key Differences from Original Implementation

| Original | Official Docs | Action |
|----------|---------------|--------|
| `verbose` property | Not documented | Removed |
| `development` config | Use `process.env.NODE_ENV` | Removed from config |
| `switch` statements in `fetch` | Use `routes` object | Migrated |
| No `server.reload()` | Available since v1.2.3 | Added |
| Manual lifecycle | Built-in methods | Using `stop()`, `ref()` |

## Resources

- [Official Documentation](https://bun.com/docs/runtime/http/server)
- [bun-docs-repo/docs/runtime/http/server.mdx](./bun-docs-repo/docs/runtime/http/server.mdx)
