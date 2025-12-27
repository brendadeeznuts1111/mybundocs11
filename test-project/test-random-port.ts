const server = Bun.serve({ port: 0, fetch: () => new Response("Random port test") }); console.log("Port:", server.port); console.log("URL:", server.url); server.stop();
