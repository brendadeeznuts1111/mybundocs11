#!/usr/bin/env bun
console.log("Hello from your new Bun project!");
console.log("This is a template created with bun create");

// Example of a simple HTTP server
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Welcome to your Bun project! 🚀");
  },
});

console.log(`Server running at http://localhost:${server.port}`);
