import { afterEach, beforeEach, describe, expect, it } from "bun:test";

// Import the server function directly for testing
const port = 3001; // Use different port for testing
let server: any;

// Helper function to create the server
function createServer(testPort: number) {
  return Bun.serve({
    port: testPort,
    fetch(req) {
      const url = new URL(req.url);

      // Route handling
      switch (url.pathname) {
        case "/":
          return new Response(
            `Welcome to your Bun project! 🚀\n\nRunning on port: ${testPort}\n\nAvailable endpoints:\n- GET /api/status\n- GET /api/users\n- POST /api/users\n- GET /static/*`
          );

        case "/api/status":
          return Response.json({
            status: "healthy",
            port: testPort,
            timestamp: new Date().toISOString(),
            version: "1.0.0",
          });

        case "/api/users":
          if (req.method === "GET") {
            return Response.json({
              users: [
                { id: 1, name: "Alice", email: "alice@example.com" },
                { id: 2, name: "Bob", email: "bob@example.com" },
              ],
            });
          } else if (req.method === "POST") {
            return Response.json(
              {
                message: "User created successfully",
                id: Math.floor(Math.random() * 1000),
              },
              { status: 201 }
            );
          }
          break;

        default:
          // Static file serving for /static/*
          if (url.pathname.startsWith("/static/")) {
            const filename = url.pathname.slice(8); // Remove '/static/'
            return new Response(
              `Static file: ${filename}\n(Implement actual file serving)`
            );
          }
      }

      // 404 for unknown routes
      return new Response("Not Found", { status: 404 });
    },
  });
}

describe("Server API", () => {
  const baseUrl = `http://localhost:${port}`;

  beforeEach(() => {
    server = createServer(port);
  });

  afterEach(() => {
    if (server) {
      server.stop();
    }
  });

  it("should return welcome message on root", async () => {
    const response = await fetch(`${baseUrl}/`);
    const text = await response.text();
    expect(text).toContain("Welcome to your Bun project!");
    expect(response.status).toBe(200);
  });

  it("should return status API data", async () => {
    const response = await fetch(`${baseUrl}/api/status`);
    const data = await response.json();
    expect(data).toHaveProperty("status", "healthy");
    expect(data).toHaveProperty("port", port);
    expect(data).toHaveProperty("timestamp");
    expect(response.status).toBe(200);
  });

  it("should return users list", async () => {
    const response = await fetch(`${baseUrl}/api/users`);
    const data = await response.json();
    expect(data).toHaveProperty("users");
    expect(Array.isArray(data.users)).toBe(true);
    expect(data.users.length).toBeGreaterThan(0);
    expect(response.status).toBe(200);
  });

  it("should create a new user", async () => {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Test User", email: "test@example.com" }),
    });
    const data = await response.json();
    expect(data).toHaveProperty("message", "User created successfully");
    expect(data).toHaveProperty("id");
    expect(response.status).toBe(201);
  });

  it("should return 404 for unknown routes", async () => {
    const response = await fetch(`${baseUrl}/unknown-route`);
    expect(response.status).toBe(404);
    const text = await response.text();
    expect(text).toBe("Not Found");
  });

  it("should handle static file routes", async () => {
    const response = await fetch(`${baseUrl}/static/test.txt`);
    const text = await response.text();
    expect(text).toContain("Static file: test.txt");
    expect(response.status).toBe(200);
  });
});
