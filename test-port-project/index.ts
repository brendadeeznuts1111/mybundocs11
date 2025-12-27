#!/usr/bin/env bun
console.log("Hello from your new Bun project!");
console.log("This is a template created with bun create");

// Get port from environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Example of a simple HTTP server
const server = Bun.serve({
  port: port,
  fetch(req) {
    return new Response(
      `Welcome to your Bun project! 🚀\n\nRunning on port: ${port}`
    );
  },
});

console.log(`Server running at http://localhost:${server.port}`);
