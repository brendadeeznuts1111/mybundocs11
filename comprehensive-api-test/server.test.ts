import { afterEach, beforeEach, describe, expect, it } from "bun:test";

// Import the server function directly for testing
const port = 3001; // Use different port for testing
let server: any;

// Helper function to create the server
function createServer(testPort: number) {
  // In-memory database (in production, use a real database)
  interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
  }

  interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
  }

  let users: User[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  let posts: Post[] = [
    {
      id: 1,
      title: "Welcome to Bun",
      content: "This is the first post",
      authorId: 1,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "API Development",
      content: "Building APIs with Bun",
      authorId: 2,
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  let nextUserId = 3;
  let nextPostId = 3;

  // Middleware functions
  function corsMiddleware(req: Request, response: Response): Response {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return response;
  }

  function authMiddleware(
    req: Request
  ): { authenticated: boolean; user?: User } | Response {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    if (token === "secret-token") {
      return { authenticated: true, user: users[0] };
    }

    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  // Helper functions
  function parseBody(req: Request): Promise<any> {
    return req.json();
  }

  function validateUser(data: any): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim().length < 2
    ) {
      errors.push("Name is required and must be at least 2 characters");
    }

    if (
      !data.email ||
      typeof data.email !== "string" ||
      !data.email.includes("@")
    ) {
      errors.push("Valid email is required");
    }

    if (data.role && !["user", "admin"].includes(data.role)) {
      errors.push('Role must be either "user" or "admin"');
    }

    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }

  function validatePost(data: any): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (
      !data.title ||
      typeof data.title !== "string" ||
      data.title.trim().length < 1
    ) {
      errors.push("Title is required");
    }

    if (
      !data.content ||
      typeof data.content !== "string" ||
      data.content.trim().length < 1
    ) {
      errors.push("Content is required");
    }

    if (
      data.authorId &&
      (typeof data.authorId !== "number" ||
        !users.find((u) => u.id === data.authorId))
    ) {
      errors.push("Valid authorId is required");
    }

    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }

  function paginate<T>(array: T[], page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = array.slice(startIndex, endIndex);

    return {
      items,
      pagination: {
        page,
        limit,
        total: array.length,
        totalPages: Math.ceil(array.length / limit),
        hasNext: endIndex < array.length,
        hasPrev: page > 1,
      },
    };
  }

  return Bun.serve({
    port: testPort,
    fetch: async (req) => {
      const url = new URL(req.url);
      const method = req.method;

      if (method === "OPTIONS") {
        return corsMiddleware(req, new Response(null, { status: 200 }));
      }

      try {
        let response: Response;

        switch (url.pathname) {
          case "/":
            response = new Response(
              `🚀 Full API Example with Bun\n\n📍 Running on port: ${testPort}\n\n📚 Available endpoints:\n\n👥 Users:\n- GET /api/users - List users (with pagination)\n- GET /api/users/:id - Get user by ID\n- POST /api/users - Create user\n- PUT /api/users/:id - Update user\n- DELETE /api/users/:id - Delete user\n\n📝 Posts:\n- GET /api/posts - List posts (with pagination & filtering)\n- GET /api/posts/:id - Get post by ID\n- POST /api/posts - Create post (requires auth)\n- PUT /api/posts/:id - Update post (requires auth)\n- DELETE /api/posts/:id - Delete post (requires auth)\n\n🔧 Utility:\n- GET /api/status - Server status\n- GET /api/health - Health check\n\n🔐 Auth: Use "Authorization: Bearer secret-token" header`
            );
            break;

          case "/api/status":
            const uptime = process.uptime();
            response = Response.json({
              status: "healthy",
              port: testPort,
              timestamp: new Date().toISOString(),
              version: "2.0.0",
              uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
              stats: { users: users.length, posts: posts.length },
            });
            break;

          case "/api/health":
            response = Response.json({
              status: "ok",
              timestamp: new Date().toISOString(),
              database: "connected (in-memory)",
            });
            break;

          case "/api/users":
            if (method === "GET") {
              const page = parseInt(url.searchParams.get("page") || "1");
              const limit = parseInt(url.searchParams.get("limit") || "10");
              const search = url.searchParams.get("search") || "";

              let filteredUsers = users;
              if (search) {
                filteredUsers = users.filter(
                  (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                );
              }

              const result = paginate(filteredUsers, page, limit);
              response = Response.json(result);
            } else if (method === "POST") {
              const body = await parseBody(req);
              const validation = validateUser(body);

              if (!validation.valid) {
                response = Response.json(
                  { error: "Validation failed", errors: validation.errors },
                  { status: 400 }
                );
                break;
              }

              const newUser: User = {
                id: nextUserId++,
                name: body.name.trim(),
                email: body.email.trim(),
                role: body.role || "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              users.push(newUser);
              response = Response.json(newUser, { status: 201 });
            } else {
              response = new Response("Method not allowed", { status: 405 });
            }
            break;

          case "/api/posts":
            if (method === "GET") {
              const page = parseInt(url.searchParams.get("page") || "1");
              const limit = parseInt(url.searchParams.get("limit") || "10");
              const published = url.searchParams.get("published");
              const authorId = url.searchParams.get("authorId");

              let filteredPosts = posts;

              if (published !== null) {
                const isPublished = published === "true";
                filteredPosts = filteredPosts.filter(
                  (p) => p.published === isPublished
                );
              }

              if (authorId) {
                const authorIdNum = parseInt(authorId);
                filteredPosts = filteredPosts.filter(
                  (p) => p.authorId === authorIdNum
                );
              }

              const result = paginate(filteredPosts, page, limit);

              result.items = result.items.map((post) => ({
                ...post,
                author: users.find((u) => u.id === post.authorId),
              }));

              response = Response.json(result);
            } else if (method === "POST") {
              const auth = authMiddleware(req);
              if (auth instanceof Response) {
                response = auth;
                break;
              }

              const body = await parseBody(req);
              const validation = validatePost(body);

              if (!validation.valid) {
                response = Response.json(
                  { error: "Validation failed", errors: validation.errors },
                  { status: 400 }
                );
                break;
              }

              const newPost: Post = {
                id: nextPostId++,
                title: body.title.trim(),
                content: body.content.trim(),
                authorId: body.authorId || (auth as any).user.id,
                published:
                  body.published !== undefined ? body.published : false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              posts.push(newPost);
              response = Response.json(newPost, { status: 201 });
            } else {
              response = new Response("Method not allowed", { status: 405 });
            }
            break;

          default:
            if (url.pathname.startsWith("/api/users/") && method === "GET") {
              const id = parseInt(url.pathname.split("/")[3]);
              const user = users.find((u) => u.id === id);

              if (!user) {
                response = Response.json(
                  { error: "User not found" },
                  { status: 404 }
                );
                break;
              }

              response = Response.json(user);
            } else if (
              url.pathname.startsWith("/api/users/") &&
              method === "PUT"
            ) {
              const id = parseInt(url.pathname.split("/")[3]);
              const userIndex = users.findIndex((u) => u.id === id);

              if (userIndex === -1) {
                response = Response.json(
                  { error: "User not found" },
                  { status: 404 }
                );
                break;
              }

              const body = await parseBody(req);
              const validation = validateUser(body);

              if (!validation.valid) {
                response = Response.json(
                  { error: "Validation failed", errors: validation.errors },
                  { status: 400 }
                );
                break;
              }

              users[userIndex] = {
                ...users[userIndex],
                name: body.name.trim(),
                email: body.email.trim(),
                role: body.role || users[userIndex].role,
                updatedAt: new Date().toISOString(),
              };

              response = Response.json(users[userIndex]);
            } else if (
              url.pathname.startsWith("/api/users/") &&
              method === "DELETE"
            ) {
              const id = parseInt(url.pathname.split("/")[3]);
              const userIndex = users.findIndex((u) => u.id === id);

              if (userIndex === -1) {
                response = Response.json(
                  { error: "User not found" },
                  { status: 404 }
                );
                break;
              }

              users.splice(userIndex, 1);
              response = Response.json({
                message: "User deleted successfully",
              });
            } else if (
              url.pathname.startsWith("/api/posts/") &&
              method === "GET"
            ) {
              const id = parseInt(url.pathname.split("/")[3]);
              const post = posts.find((p) => p.id === id);

              if (!post) {
                response = Response.json(
                  { error: "Post not found" },
                  { status: 404 }
                );
                break;
              }

              const author = users.find((u) => u.id === post.authorId);
              response = Response.json({ ...post, author });
            } else if (
              url.pathname.startsWith("/api/posts/") &&
              method === "PUT"
            ) {
              const auth = authMiddleware(req);
              if (auth instanceof Response) {
                response = auth;
                break;
              }

              const id = parseInt(url.pathname.split("/")[3]);
              const postIndex = posts.findIndex((p) => p.id === id);

              if (postIndex === -1) {
                response = Response.json(
                  { error: "Post not found" },
                  { status: 404 }
                );
                break;
              }

              const body = await parseBody(req);
              const validation = validatePost(body);

              if (!validation.valid) {
                response = Response.json(
                  { error: "Validation failed", errors: validation.errors },
                  { status: 400 }
                );
                break;
              }

              posts[postIndex] = {
                ...posts[postIndex],
                title: body.title.trim(),
                content: body.content.trim(),
                published:
                  body.published !== undefined
                    ? body.published
                    : posts[postIndex].published,
                updatedAt: new Date().toISOString(),
              };

              const author = users.find(
                (u) => u.id === posts[postIndex].authorId
              );
              response = Response.json({ ...posts[postIndex], author });
            } else if (
              url.pathname.startsWith("/api/posts/") &&
              method === "DELETE"
            ) {
              const auth = authMiddleware(req);
              if (auth instanceof Response) {
                response = auth;
                break;
              }

              const id = parseInt(url.pathname.split("/")[3]);
              const postIndex = posts.findIndex((p) => p.id === id);

              if (postIndex === -1) {
                response = Response.json(
                  { error: "Post not found" },
                  { status: 404 }
                );
                break;
              }

              posts.splice(postIndex, 1);
              response = Response.json({
                message: "Post deleted successfully",
              });
            } else {
              response = new Response("Not Found", { status: 404 });
            }
        }

        return corsMiddleware(req, response);
      } catch (error) {
        return corsMiddleware(
          req,
          Response.json(
            {
              error: "Internal server error",
              message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
          )
        );
      }
    },
  });
}

describe("Comprehensive API Tests", () => {
  const baseUrl = `http://localhost:${port}`;

  beforeEach(() => {
    server = createServer(port);
  });

  afterEach(() => {
    if (server) {
      server.stop();
    }
  });

  describe("Root and Status Endpoints", () => {
    it("should return welcome message on root", async () => {
      const response = await fetch(`${baseUrl}/`);
      const text = await response.text();
      expect(text).toContain("Full API Example with Bun");
      expect(text).toContain("Available endpoints");
      expect(response.status).toBe(200);
    });

    it("should return status API data", async () => {
      const response = await fetch(`${baseUrl}/api/status`);
      const data = await response.json();
      expect(data).toHaveProperty("status", "healthy");
      expect(data).toHaveProperty("port", port);
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("version", "2.0.0");
      expect(data).toHaveProperty("uptime");
      expect(data).toHaveProperty("stats");
      expect(response.status).toBe(200);
    });

    it("should return health check", async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      const data = await response.json();
      expect(data).toHaveProperty("status", "ok");
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("database", "connected (in-memory)");
      expect(response.status).toBe(200);
    });
  });

  describe("Users API", () => {
    it("should return paginated users list", async () => {
      const response = await fetch(`${baseUrl}/api/users`);
      const data = await response.json();
      expect(data).toHaveProperty("items");
      expect(data).toHaveProperty("pagination");
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items.length).toBeGreaterThan(0);
      expect(data.pagination).toHaveProperty("page", 1);
      expect(data.pagination).toHaveProperty("limit", 10);
      expect(data.pagination).toHaveProperty("total");
      expect(response.status).toBe(200);
    });

    it("should filter users by search term", async () => {
      const response = await fetch(`${baseUrl}/api/users?search=alice`);
      const data = await response.json();
      expect(data.items.length).toBe(1);
      expect(data.items[0].name).toContain("Alice");
      expect(response.status).toBe(200);
    });

    it("should create a new user", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
        role: "user",
      };

      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("name", newUser.name);
      expect(data).toHaveProperty("email", newUser.email);
      expect(data).toHaveProperty("role", newUser.role);
      expect(response.status).toBe(201);
    });

    it("should validate user creation", async () => {
      const invalidUser = {
        name: "A", // Too short
        email: "invalid-email", // Invalid email
        role: "invalid-role", // Invalid role
      };

      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUser),
      });

      const data = await response.json();
      expect(data).toHaveProperty("error", "Validation failed");
      expect(data).toHaveProperty("errors");
      expect(Array.isArray(data.errors)).toBe(true);
      expect(data.errors.length).toBeGreaterThan(0);
      expect(response.status).toBe(400);
    });

    it("should get user by ID", async () => {
      const response = await fetch(`${baseUrl}/api/users/1`);
      const data = await response.json();
      expect(data).toHaveProperty("id", 1);
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("email");
      expect(response.status).toBe(200);
    });

    it("should return 404 for non-existent user", async () => {
      const response = await fetch(`${baseUrl}/api/users/999`);
      const data = await response.json();
      expect(data).toHaveProperty("error", "User not found");
      expect(response.status).toBe(404);
    });

    it("should update a user", async () => {
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
        role: "admin",
      };

      const response = await fetch(`${baseUrl}/api/users/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      expect(data).toHaveProperty("id", 1);
      expect(data).toHaveProperty("name", updateData.name);
      expect(data).toHaveProperty("email", updateData.email);
      expect(data).toHaveProperty("role", updateData.role);
      expect(response.status).toBe(200);
    });

    it("should delete a user", async () => {
      const response = await fetch(`${baseUrl}/api/users/2`, {
        method: "DELETE",
      });

      const data = await response.json();
      expect(data).toHaveProperty("message", "User deleted successfully");
      expect(response.status).toBe(200);
    });
  });

  describe("Posts API", () => {
    it("should return paginated posts list", async () => {
      const response = await fetch(`${baseUrl}/api/posts`);
      const data = await response.json();
      expect(data).toHaveProperty("items");
      expect(data).toHaveProperty("pagination");
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items.length).toBeGreaterThan(0);
      expect(data.items[0]).toHaveProperty("author");
      expect(response.status).toBe(200);
    });

    it("should filter posts by published status", async () => {
      const response = await fetch(`${baseUrl}/api/posts?published=true`);
      const data = await response.json();
      expect(data.items.every((post: any) => post.published === true)).toBe(
        true
      );
      expect(response.status).toBe(200);
    });

    it("should filter posts by author", async () => {
      const response = await fetch(`${baseUrl}/api/posts?authorId=1`);
      const data = await response.json();
      expect(data.items.every((post: any) => post.authorId === 1)).toBe(true);
      expect(response.status).toBe(200);
    });

    it("should create a post with authentication", async () => {
      const newPost = {
        title: "Test Post",
        content: "This is a test post content",
        published: true,
      };

      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret-token",
        },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("title", newPost.title);
      expect(data).toHaveProperty("content", newPost.content);
      expect(data).toHaveProperty("published", newPost.published);
      expect(response.status).toBe(201);
    });

    it("should require authentication for post creation", async () => {
      const newPost = {
        title: "Test Post",
        content: "This is a test post content",
      };

      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();
      expect(data).toHaveProperty(
        "error",
        "Missing or invalid authorization header"
      );
      expect(response.status).toBe(401);
    });

    it("should validate post creation", async () => {
      const invalidPost = {
        title: "", // Empty title
        content: "", // Empty content
      };

      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret-token",
        },
        body: JSON.stringify(invalidPost),
      });

      const data = await response.json();
      expect(data).toHaveProperty("error", "Validation failed");
      expect(data).toHaveProperty("errors");
      expect(Array.isArray(data.errors)).toBe(true);
      expect(response.status).toBe(400);
    });

    it("should get post by ID with author", async () => {
      const response = await fetch(`${baseUrl}/api/posts/1`);
      const data = await response.json();
      expect(data).toHaveProperty("id", 1);
      expect(data).toHaveProperty("title");
      expect(data).toHaveProperty("content");
      expect(data).toHaveProperty("author");
      expect(data.author).toHaveProperty("name");
      expect(response.status).toBe(200);
    });

    it("should update a post with authentication", async () => {
      const updateData = {
        title: "Updated Post Title",
        content: "Updated post content",
        published: true,
      };

      const response = await fetch(`${baseUrl}/api/posts/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret-token",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      expect(data).toHaveProperty("id", 1);
      expect(data).toHaveProperty("title", updateData.title);
      expect(data).toHaveProperty("content", updateData.content);
      expect(data).toHaveProperty("published", updateData.published);
      expect(response.status).toBe(200);
    });

    it("should delete a post with authentication", async () => {
      const response = await fetch(`${baseUrl}/api/posts/2`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer secret-token",
        },
      });

      const data = await response.json();
      expect(data).toHaveProperty("message", "Post deleted successfully");
      expect(response.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await fetch(`${baseUrl}/unknown-route`);
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toBe("Not Found");
    });

    it("should return 405 for unsupported methods", async () => {
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "PATCH",
      });
      expect(response.status).toBe(405);
      const text = await response.text();
      expect(text).toBe("Method not allowed");
    });

    it("should handle CORS preflight requests", async () => {
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "OPTIONS",
      });
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
        "GET"
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
        "Content-Type"
      );
    });

    it("should include CORS headers on all responses", async () => {
      const response = await fetch(`${baseUrl}/api/status`);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
        "GET"
      );
    });
  });

  describe("Authentication", () => {
    it("should reject invalid tokens", async () => {
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid-token",
        },
        body: JSON.stringify({
          title: "Test Post",
          content: "Test content",
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty("error", "Invalid token");
      expect(response.status).toBe(401);
    });

    it("should reject missing authorization header", async () => {
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Test Post",
          content: "Test content",
        }),
      });

      const data = await response.json();
      expect(data).toHaveProperty(
        "error",
        "Missing or invalid authorization header"
      );
      expect(response.status).toBe(401);
    });
  });
});
