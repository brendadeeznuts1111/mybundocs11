# Random Port Selection in Bun

## Random Available Port

To let Bun select a random available port, set `port` to `0`:

```typescript
const server = Bun.serve({
  port: 0, // random port
  fetch(req) {
    return new Response("404!");
  },
});

// server.port is the randomly selected port
console.log(server.port); // e.g., 3000, 45678, etc.
console.log(server.url);  // e.g., http://localhost:3000
```

## Automatic Port Fallback

If you don't specify a port, Bun will automatically try different ports:

```typescript
const server = Bun.serve({
  fetch: (req) => new Response("Hello"),
  // Don't specify port - Bun will try 3000, 3001, 3002...
});

console.log(`Server running on port ${server.port}`);
```

## Accessing Port Information

After creating a server, you can always access the actual port:

```typescript
const server = Bun.serve({
  port: 0, // random
  fetch: () => new Response("Hello")
});

console.log(server.port); // The actual port number
console.log(server.url);  // Full URL including port
```

## Use Cases

### Testing
```typescript
// Perfect for tests - no port conflicts
const server = Bun.serve({
  port: 0,
  fetch: () => new Response("Test")
});

// Run tests against server.port
```

### Development
```typescript
// Never worry about "port already in use"
const server = Bun.serve({
  port: 0,
  fetch: () => new Response("Dev server")
});

console.log(`Development server: ${server.url}`);
```

### Multiple Instances
```typescript
// Start multiple servers without port conflicts
const server1 = Bun.serve({ port: 0, fetch: () => new Response("1") });
const server2 = Bun.serve({ port: 0, fetch: () => new Response("2") });

console.log(`Server 1: ${server1.port}`);
console.log(`Server 2: ${server2.port}`);
```

## Complete Example

```typescript
import { serve } from "bun";

const server = Bun.serve({
  port: 0, // Random available port
  hostname: "localhost",
  fetch(req) {
    return new Response(`Hello from port ${server.port}!`);
  },
});

console.log(`🚀 Server running at ${server.url}`);
console.log(`📝 Actual port: ${server.port}`);
console.log(`🌐 Full URL: ${server.url}`);

// Keep server running
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.stop();
  process.exit(0);
});
```

## Environment Variable Integration

Random port selection works with environment variables:

```typescript
// If BUN_PORT=0 is set, Bun will select random port
const server = Bun.serve({
  port: parseInt(process.env.BUN_PORT || "0"), // 0 = random
  fetch: () => new Response("Hello")
});

console.log(`Port: ${server.port}`); // Random if BUN_PORT=0
```

## Summary

| Port Value | Behavior |
|------------|----------|
| `0` | Random available port |
| `undefined` | Try 3000, 3001, 3002... |
| `3000` | Specific port (or error if taken) |
| `process.env.BUN_PORT` | Use env var (0 = random) |

---

*Based on Bun official documentation: https://bun.com/docs/runtime/http/server#configuration*
