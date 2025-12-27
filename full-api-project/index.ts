#!/usr/bin/env bun
console.log("🚀 Starting Full API Example with Bun");

// Get port from environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

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

function loggingMiddleware(req: Request): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
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

// Enhanced HTTP server with comprehensive API
const server = Bun.serve({
  port: port,
  fetch(req) {
    loggingMiddleware(req);

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
            `🚀 Full API Example with Bun\n\n📍 Running on port: ${port}\n\n📚 Available endpoints:\n\n👥 Users:\n- GET /api/users - List users (with pagination)\n- GET /api/users/:id - Get user by ID\n- POST /api/users - Create user\n- PUT /api/users/:id - Update user\n- DELETE /api/users/:id - Delete user\n\n📝 Posts:\n- GET /api/posts - List posts (with pagination & filtering)\n- GET /api/posts/:id - Get post by ID\n- POST /api/posts - Create post (requires auth)\n- PUT /api/posts/:id - Update post (requires auth)\n- DELETE /api/posts/:id - Delete post (requires auth)\n\n🔧 Utility:\n- GET /api/status - Server status\n- GET /api/health - Health check\n\n🔐 Auth: Use "Authorization: Bearer secret-token" header`
          );
          break;

        case "/api/status":
          const uptime = process.uptime();
          response = Response.json({
            status: "healthy",
            port: port,
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
              published: body.published !== undefined ? body.published : false,
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
            response = Response.json({ message: "User deleted successfully" });
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
            response = Response.json({ message: "Post deleted successfully" });
          } else {
            response = new Response("Not Found", { status: 404 });
          }
      }

      return corsMiddleware(req, response);
    } catch (error) {
      console.error("Server error:", error);
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

console.log(`🚀 Full API Server running at http://localhost:${server.port}`);
console.log(`🔧 Try: curl http://localhost:${server.port}/api/status`);
