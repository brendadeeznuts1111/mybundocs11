#!/usr/bin/env bun

/**
 * Bun HTTP Server Configuration - Complete Reference Implementation
 *
 * This file demonstrates Bun.serve() configuration options based on the official Bun documentation.
 * https://bun.com/docs/runtime/http/server
 *
 * Key features:
 * - routes object for cleaner routing (Bun v1.2.3+)
 * - server.reload() for hot route reloading
 * - Server lifecycle methods (stop, ref, unref)
 * - Per-request controls (requestIP, timeout)
 *
 * Usage: bun run bun-server-config.ts
 */

// ============================================================================
// COMPREHENSIVE SERVER CONFIGURATION INTERFACE
// ============================================================================

interface BunServerConfig {
  // Required - fetch handler for unmatched routes
  fetch?: (request: Request, server: BunServer) => Response | Promise<Response>;

  // Network Configuration
  port?: number;                    // Port to listen on (default: 3000)
  hostname?: string;               // Hostname to bind to (default: "0.0.0.0")

  // TLS/SSL Configuration
  tls?: {
    key: string | Buffer;          // Private key (PEM format)
    cert: string | Buffer;         // Certificate (PEM format)
    ca?: string | Buffer;          // Optional CA certificate
    passphrase?: string;           // Optional passphrase for encrypted key
    secureOptions?: number;        // OpenSSL secure options
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
  error?: (error: Error) => Response | Promise<Response>; // Error handler

  // Performance
  reusePort?: boolean;             // Enable SO_REUSEPORT for load balancing
  lowMemoryMode?: boolean;         // Optimize for low memory environments
  idleTimeout?: number;            // Idle timeout in seconds

  // Routes - Cleaner routing (Bun v1.2.3+)
  routes?: Record<string, Response | ((req: Request, server?: BunServer) => Response | Promise<Response>) | {
    GET?: (req: Request, server?: BunServer) => Response | Promise<Response>;
    POST?: (req: Request, server?: BunServer) => Response | Promise<Response>;
    PUT?: (req: Request, server?: BunServer) => Response | Promise<Response>;
    DELETE?: (req: Request, server?: BunServer) => Response | Promise<Response>;
    PATCH?: (req: Request, server?: BunServer) => Response | Promise<Response>;
    OPTIONS?: (req: Request, server?: BunServer) => Response | Promise<Response>;
  }>;
}

// ============================================================================
// WEBSOCKET TYPES (Bun-specific)
// ============================================================================

interface BunWebSocket {
  send(message: string | Buffer): void;
  close(code?: number, reason?: string): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, message: string | Buffer): void;
  isSubscribed(topic: string): boolean;
  data: any;
  readyState: number;
}

interface BunServer {
  // Read-only properties
  readonly url: URL;
  readonly port: number;
  readonly hostname: string;
  readonly development: boolean;
  readonly id: string;
  readonly pendingRequests: number;
  readonly pendingWebSockets: number;

  // Lifecycle methods
  stop(closeActiveConnections?: boolean): Promise<void>;
  reload(options: Partial<BunServerConfig>): void;
  ref(): void;
  unref(): void;

  // Per-request controls
  requestIP(request: Request): { address: string; port: number } | null;
  timeout(request: Request, seconds: number): void;

  // WebSocket helpers
  upgrade<T = undefined>(
    request: Request,
    options?: { headers?: Record<string, string>; data?: T }
  ): boolean;
  publish(topic: string, data: string | Buffer, compress?: boolean): number;
  subscriberCount(topic: string): number;

  // Internal fetch
  fetch(request: Request | string): Response | Promise<Response>;
}

// ============================================================================
// COMPREHENSIVE CONFIGURATION EXAMPLES
// ============================================================================

class BunServerConfigurator {

  /**
   * Basic HTTP Server Configuration
   * Simplest possible server with minimal configuration
   */
  static basicConfig(): BunServerConfig {
    return {
      fetch: (_req: Request) => {
        return new Response("Hello, Bun! Basic server configuration", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      },
      port: 3000,
      hostname: "localhost"
    };
  }

  /**
   * Production-Ready Server Configuration
   * Uses routes object for cleaner routing (Bun v1.2.3+)
   */
  static productionConfig(): BunServerConfig {
    // Security headers for all responses
    const securityHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Server": "Bun-Production-Server"
    };

    // Helper to wrap responses with security headers
    const withHeaders = (response: Response): Response => {
      const newHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(securityHeaders)) {
        newHeaders.set(key, value);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    };

    return {
      // Use routes object for cleaner routing
      routes: {
        "/": () => {
          return withHeaders(Response.json({
            message: "Production Bun Server",
            timestamp: new Date().toISOString(),
            endpoints: ["/", "/health", "/api/users", "/api/data"]
          }));
        },

        "/health": () => {
          return withHeaders(Response.json({
            status: "healthy",
            uptime: `${Date.now()}ms`,
            timestamp: new Date().toISOString()
          }));
        },

        // Static response - zero-allocation for cached responses
        "/ping": new Response("pong", {
          headers: { "Content-Type": "text/plain" }
        }),

        "/api/users": {
          GET: async () => {
            // Simulate database query
            await new Promise(resolve => setTimeout(resolve, 10));
            return withHeaders(Response.json({
              users: [
                { id: 1, name: "Alice", email: "alice@example.com" },
                { id: 2, name: "Bob", email: "bob@example.com" }
              ]
            }));
          },
          POST: async (req) => {
            const body = await req.json();
            return withHeaders(Response.json({
              user: body,
              created: true
            }, { status: 201 }));
          }
        },

        "/api/data": (_req) => {
          const data = {
            server: "Bun",
            version: Bun.version,
            environment: process.env.NODE_ENV || "development",
            memory: process.memoryUsage()
          };
          return withHeaders(Response.json(data));
        },

        // Dynamic route parameter
        "/api/users/:id": (req: Request) => {
          const userId = (req as any).params?.id || "unknown";
          return withHeaders(Response.json({
            id: userId,
            name: `User ${userId}`,
            email: `user${userId}@example.com`
          }));
        },

        // Wildcard for 404
        "/api/*": Response.json({
          error: "Not Found"
        }, { status: 404, headers: securityHeaders })
      },

      // Fallback for unmatched routes (important for Bun < 1.2.3)
      fetch: (_req: Request) => {
        return new Response("Not Found", { status: 404 });
      },

      // Network settings
      port: parseInt(process.env.PORT || "3000"),
      hostname: process.env.HOSTNAME || "0.0.0.0",

      // Security limits
      maxRequestBodySize: 10 * 1024 * 1024, // 10MB limit

      // Error handler
      error: (error: Error) => {
        console.error("Global error handler:", error);
        return Response.json({
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
      },

      // Performance settings
      reusePort: true,
      lowMemoryMode: false,

      // Use process.env.NODE_ENV for development detection
      // Note: BunServer.development is automatically set based on this
    };
  }

  /**
   * HTTPS/TLS Server Configuration
   * Secure server with SSL/TLS certificates
   */
  static async tlsConfig(): Promise<BunServerConfig> {
    return {
      routes: {
        "/": () => Response.json({
          secure: true,
          protocol: "HTTPS",
          timestamp: new Date().toISOString(),
          message: "This is a secure Bun server with TLS"
        }),
        "/ping": new Response("pong")
      },

      port: 3443,
      hostname: "localhost",

      tls: {
        key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1+fWIcPm15j9BtqMxjYhkhm5JJLcXJqLJGGhbXrMVXKqYv
-----END PRIVATE KEY-----`,
        cert: `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+mRKSzMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
-----END CERTIFICATE-----`,
        secureOptions: 0
      }
    };
  }

  /**
   * WebSocket Server Configuration
   * Real-time bidirectional communication
   */
  static websocketConfig(): BunServerConfig {
    const connections = new Set<BunWebSocket>();

    return {
      routes: {
        "/": () => Response.json({
          message: "WebSocket server ready",
          endpoint: "/ws",
          connections: connections.size
        })
      },

      fetch: (req: Request, server: BunServer) => {
        const url = new URL(req.url);

        if (url.pathname === "/ws") {
          const success = server.upgrade(req, {
            data: {
              timestamp: Date.now(),
              id: Math.random().toString(36).substr(2, 9)
            }
          });

          return success
            ? new Response("WebSocket upgrade successful", { status: 101 })
            : new Response("WebSocket upgrade failed", { status: 400 });
        }

        return new Response("Not Found", { status: 404 });
      },

      websocket: {
        open: (ws: BunWebSocket) => {
          connections.add(ws);
          console.log(`WebSocket opened: ${connections.size} active connections`);

          ws.send(JSON.stringify({
            type: "welcome",
            message: "Connected to Bun WebSocket server",
            timestamp: new Date().toISOString(),
            yourId: ws.data.id
          }));

          connections.forEach(client => {
            if (client !== ws) {
              client.send(JSON.stringify({
                type: "notification",
                message: "New user joined",
                userId: ws.data.id
              }));
            }
          });
        },

        message: (ws: BunWebSocket, message: string | Buffer) => {
          console.log(`Message from ${ws.data.id}:`, message.toString());

          try {
            const data = JSON.parse(message.toString());

            ws.send(JSON.stringify({
              type: "echo",
              original: data,
              timestamp: new Date().toISOString(),
              server: "Bun"
            }));

            connections.forEach(client => {
              if (client !== ws) {
                client.send(JSON.stringify({
                  type: "broadcast",
                  from: ws.data.id,
                  message: data.message || data,
                  timestamp: new Date().toISOString()
                }));
              }
            });
          } catch (e) {
            ws.send(JSON.stringify({
              type: "error",
              message: "Invalid JSON received"
            }));
          }
        },

        close: (ws: BunWebSocket, code: number, reason: string) => {
          connections.delete(ws);
          console.log(`WebSocket closed: ${code} - ${reason}`);
          console.log(`Remaining connections: ${connections.size}`);

          connections.forEach(client => {
            client.send(JSON.stringify({
              type: "notification",
              message: "User left",
              userId: ws.data.id
            }));
          });
        },

        drain: (ws: BunWebSocket) => {
          console.log(`WebSocket drain: ${ws.data.id}`);
        },

        ping: (ws: BunWebSocket, data: Buffer) => {
          console.log(`Ping from ${ws.data.id}:`, Buffer.isBuffer(data) ? data.toString() : data);
        },

        pong: (ws: BunWebSocket, data: Buffer) => {
          console.log(`Pong from ${ws.data.id}:`, Buffer.isBuffer(data) ? data.toString() : data);
        }
      },

      port: 3001,
      hostname: "localhost"
    };
  }

  /**
   * High-Performance Server Configuration
   * Optimized for throughput and low latency
   */
  static performanceConfig(): BunServerConfig {
    const requestCounts = new Map<string, number>();

    return {
      routes: {
        "/": new Response("OK", {
          headers: {
            "Content-Type": "text/plain",
            "X-Response-Time": "0ms"
          }
        }),

        "/metrics": () => {
          const metrics = {
            totalRequests: Array.from(requestCounts.values()).reduce((a, b) => a + b, 0),
            endpoints: Object.fromEntries(requestCounts),
            timestamp: new Date().toISOString()
          };
          return Response.json(metrics);
        }
      },

      fetch: (req: Request) => {
        const url = new URL(req.url);
        const path = url.pathname;

        const count = (requestCounts.get(path) || 0) + 1;
        requestCounts.set(path, count);

        const start = Date.now();
        const result = {
          path,
          method: req.method,
          timestamp: new Date().toISOString(),
          processedIn: `${Date.now() - start}ms`
        };

        return Response.json(result);
      },

      port: 3000,
      hostname: "0.0.0.0",

      reusePort: true,
      lowMemoryMode: false,
      maxRequestBodySize: 100 * 1024 * 1024, // 100MB
      idleTimeout: 30
    };
  }

  /**
   * Advanced Multi-Route Server with Hot Reloading
   * Demonstrates server.reload() and per-request controls
   */
  static advancedConfig(): BunServerConfig {
    const requestCounts = new Map<string, number>();

    return {
      routes: {
        "/": () => Response.json({
          message: "Advanced Bun Server",
          endpoints: ["/", "/health", "/info", "/api/data"],
          features: ["routes", "hot-reloading", "per-request-controls"]
        }),

        "/health": () => Response.json({ status: "healthy" }),

        "/info": (req: Request, server?: BunServer) => {
          if (!server) {
            return Response.json({ error: "Server not available" }, { status: 500 });
          }
          const address = server.requestIP(req);
          return Response.json({
            client: address ? `${address.address}:${address.port}` : "unknown",
            server: `${server.hostname}:${server.port}`,
            pendingRequests: server.pendingRequests,
            pendingWebSockets: server.pendingWebSockets,
            development: server.development,
            url: server.url.toString()
          });
        },

        "/api/data": () => Response.json({
          data: "This is protected data",
          timestamp: new Date().toISOString()
        })
      },

      fetch: (req: Request, server: BunServer) => {
        const url = new URL(req.url);
        const path = url.pathname;

        // Track request counts
        const count = (requestCounts.get(path) || 0) + 1;
        requestCounts.set(path, count);

        // Demonstrate per-request timeout (60 seconds for this endpoint)
        if (path.startsWith("/slow")) {
          server.timeout(req, 60);
        }

        // 404 for unmatched routes
        return new Response("Not Found", { status: 404 });
      },

      port: 3000,
      hostname: "localhost",
      maxRequestBodySize: 50 * 1024 * 1024
    };
  }
}

// ============================================================================
// DEMONSTRATION SERVER WITH LIFECYCLE SUPPORT
// ============================================================================

class BunServerDemo {
  private config: BunServerConfig;
  private name: string;
  private server: any = null;

  constructor(name: string, config: BunServerConfig) {
    this.name = name;
    this.config = config;
  }

  public start(): void {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Starting: ${this.name}`);
    console.log(`${"=".repeat(60)}`);

    // Start the server
    this.server = Bun.serve(this.config as any);

    console.log(`✅ Server running at ${this.server.url}`);
    console.log(`   Port: ${this.server.port}`);
    console.log(`   Hostname: ${this.server.hostname}`);

    if (this.config.websocket) {
      console.log(`   WebSocket: ws://${this.server.hostname}:${this.server.port}/ws`);
    }

    if (this.config.tls) {
      console.log(`   Secure: https://${this.server.hostname}:${this.server.port}`);
    }

    if (this.server.development) {
      console.log(`   Mode: Development`);
    }

    if (this.config.reusePort) {
      console.log(`   Load Balancing: Enabled (SO_REUSEPORT)`);
    }

    if (this.config.maxRequestBodySize) {
      const sizeMB = (this.config.maxRequestBodySize / (1024 * 1024)).toFixed(1);
      console.log(`   Max Body Size: ${sizeMB}MB`);
    }

    if (this.config.idleTimeout) {
      console.log(`   Idle Timeout: ${this.config.idleTimeout}s`);
    }

    console.log(`\nPress Ctrl+C to stop gracefully`);
    console.log(`Press 'r' and Enter to reload routes`);
    console.log(`Press 's' and Enter to show server status`);
    console.log(`${"=".repeat(60)}\n`);

    // Setup signal handlers for graceful shutdown
    process.on('SIGINT', async () => {
      await this.gracefulShutdown();
    });

    process.on('SIGTERM', async () => {
      await this.gracefulShutdown();
    });

    // Interactive commands
    this.setupInteractiveCommands();
  }

  private setupInteractiveCommands(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      process.stdin.on('data', async (key) => {
        const keyStr = key.toString();
        if (keyStr === '\u0003') { // Ctrl+C
          await this.gracefulShutdown();
        } else if (keyStr === 'r') {
          this.reloadRoutes();
        } else if (keyStr === 's') {
          this.showStatus();
        }
      });
    }
  }

  private reloadRoutes(): void {
    if (this.server) {
      console.log("\n🔄 Hot reloading routes...");

      this.server.reload({
        routes: {
          "/": () => Response.json({
            message: "Updated Bun Server (hot reloaded)",
            timestamp: new Date().toISOString(),
            reloaded: true
          }),
          "/health": () => Response.json({ status: "healthy", reloaded: true }),
          "/api/data": () => Response.json({
            data: "Hot reloaded data",
            timestamp: new Date().toISOString()
          })
        }
      });

      console.log("✅ Routes reloaded successfully!");
    }
  }

  private showStatus(): void {
    if (this.server) {
      console.log("\n📊 Server Status:");
      console.log(`   URL: ${this.server.url}`);
      console.log(`   Port: ${this.server.port}`);
      console.log(`   Hostname: ${this.server.hostname}`);
      console.log(`   Development: ${this.server.development}`);
      console.log(`   Pending Requests: ${this.server.pendingRequests}`);
      console.log(`   Pending WebSockets: ${this.server.pendingWebSockets}`);
      console.log(`   ID: ${this.server.id}`);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    console.log(`\n🛑 Stopping ${this.name}...`);

    if (this.server) {
      // Graceful shutdown - wait for in-flight requests
      console.log("   Performing graceful shutdown...");
      await this.server.stop();

      // Force close if needed: await this.server.stop(true);
      console.log("   Server stopped.");
    }

    process.exit(0);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log("🚀 Bun HTTP Server Configuration Demo");
  console.log("=====================================");
  console.log("\nOfficial Bun docs features demonstrated:");
  console.log("  • routes object for cleaner routing (Bun v1.2.3+)");
  console.log("  • server.reload() for hot route reloading");
  console.log("  • server.stop() for graceful shutdown");
  console.log("  • server.ref() / server.unref() for lifecycle control");
  console.log("  • server.requestIP() for client info");
  console.log("  • server.timeout() for per-request timeouts");

  console.log("\nAvailable configurations:");
  console.log("1. Basic Configuration (http://localhost:3000)");
  console.log("2. Production Configuration (http://0.0.0.0:3000)");
  console.log("3. TLS/HTTPS Configuration (https://localhost:3443)");
  console.log("4. WebSocket Configuration (ws://localhost:3001)");
  console.log("5. High-Performance Configuration (http://0.0.0.0:3000)");
  console.log("6. Advanced Configuration with Hot Reloading (http://localhost:3000)");

  const selection = process.argv[2] || "6";

  let config: BunServerConfig;
  let name: string;

  switch (selection) {
    case "1":
      config = BunServerConfigurator.basicConfig();
      name = "Basic Configuration";
      break;

    case "2":
      config = BunServerConfigurator.productionConfig();
      name = "Production Configuration";
      break;

    case "3":
      config = await BunServerConfigurator.tlsConfig();
      name = "TLS/HTTPS Configuration";
      break;

    case "4":
      config = BunServerConfigurator.websocketConfig();
      name = "WebSocket Configuration";
      break;

    case "5":
      config = BunServerConfigurator.performanceConfig();
      name = "High-Performance Configuration";
      break;

    case "6":
      config = BunServerConfigurator.advancedConfig();
      name = "Advanced Configuration with Hot Reloading";
      break;

    default:
      console.log("Invalid selection. Using Advanced Configuration.");
      config = BunServerConfigurator.advancedConfig();
      name = "Advanced Configuration with Hot Reloading";
  }

  const demo = new BunServerDemo(name, config);
  demo.start();
}

// Run if executed directly
if (import.meta.main) {
  main();
}

export { BunServerConfigurator, BunServerDemo };
export type { BunServerConfig, BunWebSocket, BunServer };
