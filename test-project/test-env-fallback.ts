Bun.serve({ fetch: () => new Response("Using env: " + (process.env.BUN_PORT || process.env.PORT || "3000")) });
