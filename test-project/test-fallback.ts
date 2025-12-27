Bun.serve({ fetch: () => new Response("Port: " + (process.env.BUN_PORT || process.env.PORT || "3000")) });
