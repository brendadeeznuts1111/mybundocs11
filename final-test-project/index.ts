#!/usr/bin/env bun
console.log("Hello from your new Bun project!");
console.log("This is a template created with bun create");

// Get port from environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Enhanced HTTP server with routing
const server = Bun.serve({
  port: port,
  fetch(req) {
    const url = new URL(req.url);

    // Route handling
    switch (url.pathname) {
      case "/":
        return new Response(
          `Welcome to your Bun project! 🚀\n\nRunning on port: ${port}\n\nAvailable endpoints:\n- GET /api/status\n- GET /api/users\n- POST /api/users\n- GET /static/*`
        );

      case "/api/status":
        return Response.json({
          status: "healthy",
          port: port,
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

console.log(`Server running at http://localhost:${server.port}`);
console.log(`API endpoints available at http://localhost:${server.port}/api/`);
