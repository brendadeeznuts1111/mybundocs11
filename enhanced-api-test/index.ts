#!/usr/bin/env bun
console.log("🚀 Starting Enhanced Full API Example with Bun");

// Get port from environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Database setup (SQLite for production example)
import { Database } from "bun:sqlite";

// Initialize SQLite database
const db = new Database("api.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL UNIQUE,
    request_count INTEGER DEFAULT 0,
    window_start TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users (id)
  );
`);

// Seed initial data if tables are empty
const userCount = db.query("SELECT COUNT(*) as count FROM users").get() as {
  count: number;
};
if (userCount.count === 0) {
  const now = new Date().toISOString();
  db.exec(`
    INSERT INTO users (name, email, role, created_at, updated_at) VALUES
    ('Alice Johnson', 'alice@example.com', 'user', '${now}', '${now}'),
    ('Bob Smith', 'bob@example.com', 'admin', '${now}', '${now}');

    INSERT INTO posts (title, content, author_id, published, created_at, updated_at) VALUES
    ('Welcome to Bun', 'This is the first post', 1, TRUE, '${now}', '${now}'),
    ('API Development', 'Building APIs with Bun', 2, FALSE, '${now}', '${now}');
  `);
}

// Database interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

// JWT implementation
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

function generateJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 15 * 60; // 15 minutes

  const jwtPayload = { ...payload, iat: now, exp };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(jwtPayload)).toString(
    "base64url"
  );

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = Buffer.from(signatureInput).toString("base64url");

  return `${signatureInput}.${signature}`;
}

function verifyJWT(token: string): JWTPayload | null {
  try {
    const [header, payload, signature] = token.split(".");
    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );

    if (
      decodedPayload.exp &&
      decodedPayload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null; // Token expired
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

function generateRefreshToken(): string {
  return Buffer.from(
    `${Date.now()}-${Math.random().toString(36).substring(2)}`
  ).toString("base64");
}

// Enhanced middleware functions
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
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip}`);
}

function rateLimitMiddleware(req: Request): Response | null {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = new Date().toISOString();
  const windowStart = new Date(Date.now() - 60000).toISOString(); // 1 minute window

  // Clean old rate limit records
  db.exec("DELETE FROM rate_limits WHERE window_start < ?", [windowStart]);

  // Get or create rate limit record
  let rateLimit = db
    .query("SELECT * FROM rate_limits WHERE ip_address = ?")
    .get(ip) as any;

  if (!rateLimit) {
    db.exec(
      "INSERT INTO rate_limits (ip_address, request_count, window_start, created_at) VALUES (?, 1, ?, ?)",
      [ip, windowStart, now]
    );
    return null;
  }

  // Update window if needed
  if (rateLimit.window_start < windowStart) {
    db.exec(
      "UPDATE rate_limits SET request_count = 1, window_start = ? WHERE ip_address = ?",
      [windowStart, ip]
    );
    return null;
  }

  // Check rate limit (100 requests per minute)
  if (rateLimit.request_count >= 100) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Increment request count
  db.exec(
    "UPDATE rate_limits SET request_count = request_count + 1 WHERE ip_address = ?",
    [ip]
  );
  return null;
}

function authMiddleware(
  req: Request
): { authenticated: boolean; user?: User; payload?: JWTPayload } | Response {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { error: "Missing or invalid authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  const payload = verifyJWT(token);

  if (!payload) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const user = db
    .query("SELECT * FROM users WHERE id = ?")
    .get(payload.userId) as User;

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

  return { authenticated: true, user, payload };
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
    data.author_id &&
    (typeof data.author_id !== "number" ||
      !db.query("SELECT id FROM users WHERE id = ?").get(data.author_id))
  ) {
    errors.push("Valid author_id is required");
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

// File upload helper functions
function generateUniqueFilename(originalName: string): string {
  const ext = originalName.split(".").pop() || "";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}.${ext}`;
}

function validateFile(file: File): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push("File size must be less than 10MB");
  }

  // Check file type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "text/plain",
    "application/pdf",
    "application/json",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push(
      "File type not supported. Allowed types: images, PDF, JSON, CSV, Excel"
    );
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

async function saveUploadedFile(file: File, filename: string): Promise<string> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = "./uploads";
  try {
    await Bun.write(`${uploadsDir}/${filename}`, file);
    return `${uploadsDir}/${filename}`;
  } catch (error) {
    throw new Error("Failed to save file");
  }
}

// WebSocket connection counter
let connectedClients = 0;

// Enhanced HTTP server with WebSocket support for real-time features
const server = Bun.serve({
  port: port,
  development: process.env.NODE_ENV !== "production", // Enable development mode for better error handling
  fetch: async (req, server) => {
    // Apply rate limiting first
    const rateLimitResponse = rateLimitMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;

    loggingMiddleware(req);

    const url = new URL(req.url);
    const method = req.method;

    // Handle WebSocket upgrade for real-time features
    if (url.pathname === "/ws") {
      const success = server.upgrade(req, {
        data: {
          connected: new Date().toISOString(),
        },
      });
      if (success) {
        // Bun automatically returns a 101 Switching Protocols
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return corsMiddleware(req, new Response(null, { status: 200 }));
    }

    // Route handling
    try {
      let response: Response;

      switch (url.pathname) {
        // Root endpoint
        case "/":
          response = new Response(
            `🚀 Enhanced Full API Example with Bun\n\n📍 Running on port: ${port}\n\n📚 Available endpoints:\n\n👥 Users:\n- GET /api/users - List users (with pagination)\n- GET /api/users/:id - Get user by ID\n- POST /api/users - Create user\n- PUT /api/users/:id - Update user\n- DELETE /api/users/:id - Delete user\n\n📝 Posts:\n- GET /api/posts - List posts (with pagination & filtering)\n- GET /api/posts/:id - Get post by ID\n- POST /api/posts - Create post (requires auth)\n- PUT /api/posts/:id - Update post (requires auth)\n- DELETE /api/posts/:id - Delete post (requires auth)\n\n📁 Files:\n- POST /api/files/upload - Upload file (requires auth)\n- GET /api/files - List uploaded files (with pagination)\n- GET /api/files/:id - Get file info by ID\n- GET /api/files/:id/download - Download file by ID\n- DELETE /api/files/:id - Delete file (requires auth)\n\n🌐 WebSocket:\n- WS /ws - Real-time WebSocket connection\n  • Types: authenticate, chat_message, ping\n  • Channels: global-notifications, global-chat, user-{id}\n  • Features: Real-time chat, notifications, status updates\n\n🔐 Authentication:\n- POST /api/auth/login - Login with email/password\n- POST /api/auth/refresh - Refresh access token\n- POST /api/auth/logout - Logout (invalidate refresh token)\n\n🔧 Utility:\n- GET /api/status - Server status\n- GET /api/health - Health check with database\n\n🔐 Auth: Use JWT tokens (15min expiry) with refresh tokens\n📁 File Upload: Supports images, PDF, JSON, CSV, Excel (max 10MB)\n🌐 WebSocket: Real-time features with authentication and pub/sub`
          );
          break;

        // Status endpoints
        case "/api/status":
          const uptime = process.uptime();
          const userCount = db
            .query("SELECT COUNT(*) as count FROM users")
            .get() as { count: number };
          const postCount = db
            .query("SELECT COUNT(*) as count FROM posts")
            .get() as { count: number };
          const fileCount = db
            .query("SELECT COUNT(*) as count FROM files")
            .get() as { count: number };

          response = Response.json({
            status: "healthy",
            port: port,
            timestamp: new Date().toISOString(),
            version: "3.0.0",
            uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
            stats: {
              users: userCount.count,
              posts: postCount.count,
              files: fileCount.count,
              connectedClients: connectedClients,
            },
            features: [
              "SQLite Database",
              "JWT Authentication",
              "Rate Limiting",
              "Enhanced Logging",
              "File Upload Support",
              "WebSocket Real-time Features",
            ],
            websocket: {
              endpoint: `ws://localhost:${port}/ws`,
              connectedClients: connectedClients,
              channels: ["global-notifications", "global-chat", "user-{id}"],
            },
          });
          break;

        case "/api/health":
          try {
            // Test database connectivity
            db.query("SELECT 1").get();
            response = Response.json({
              status: "ok",
              timestamp: new Date().toISOString(),
              database: "connected (SQLite)",
              features: [
                "SQLite Database",
                "JWT Authentication",
                "Rate Limiting",
                "Enhanced Logging",
              ],
            });
          } catch (error) {
            response = Response.json(
              {
                status: "error",
                timestamp: new Date().toISOString(),
                database: "disconnected",
                error: error instanceof Error ? error.message : "Unknown error",
              },
              { status: 503 }
            );
          }
          break;

        // Test error endpoint to demonstrate development mode error handling
        case "/api/test-error":
          throw new Error(
            "woops! This is a test error to demonstrate Bun's development mode error handling"
          );

        // Authentication endpoints
        case "/api/auth/login":
          if (method === "POST") {
            const body = await parseBody(req);

            if (!body.email || !body.password) {
              response = Response.json(
                { error: "Email and password are required" },
                { status: 400 }
              );
              break;
            }

            // Simple password check (in production, use bcrypt)
            const user = db
              .query("SELECT * FROM users WHERE email = ?")
              .get(body.email) as User;

            if (!user || body.password !== "password123") {
              // Simple demo password
              response = Response.json(
                { error: "Invalid credentials" },
                { status: 401 }
              );
              break;
            }

            // Generate JWT and refresh token
            const jwtToken = generateJWT({
              userId: user.id,
              email: user.email,
              role: user.role,
            });

            const refreshToken = generateRefreshToken();
            const expiresAt = new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(); // 7 days

            // Store refresh token
            db.exec(
              "INSERT INTO refresh_tokens (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)",
              [user.id, refreshToken, expiresAt, new Date().toISOString()]
            );

            response = Response.json({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
              tokens: {
                accessToken: jwtToken,
                refreshToken: refreshToken,
                expiresIn: JWT_EXPIRES_IN,
              },
            });
          } else {
            response = new Response("Method not allowed", { status: 405 });
          }
          break;

        case "/api/auth/refresh":
          if (method === "POST") {
            const body = await parseBody(req);

            if (!body.refreshToken) {
              response = Response.json(
                { error: "Refresh token is required" },
                { status: 400 }
              );
              break;
            }

            // Validate refresh token
            const tokenRecord = db
              .query(
                `SELECT rt.*, u.* FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = ? AND rt.expires_at > ?`
              )
              .get(body.refreshToken, new Date().toISOString()) as any;

            if (!tokenRecord) {
              response = Response.json(
                { error: "Invalid or expired refresh token" },
                { status: 401 }
              );
              break;
            }

            // Generate new JWT
            const jwtToken = generateJWT({
              userId: tokenRecord.user_id,
              email: tokenRecord.email,
              role: tokenRecord.role,
            });

            response = Response.json({
              accessToken: jwtToken,
              expiresIn: JWT_EXPIRES_IN,
            });
          } else {
            response = new Response("Method not allowed", { status: 405 });
          }
          break;

        case "/api/auth/logout":
          if (method === "POST") {
            const body = await parseBody(req);

            if (body.refreshToken) {
              // Invalidate refresh token
              db.exec(
                "DELETE FROM refresh_tokens WHERE token = ?",
                body.refreshToken
              );
            }

            response = Response.json({ message: "Logged out successfully" });
          } else {
            response = new Response("Method not allowed", { status: 405 });
          }
          break;

        // Users endpoints
        case "/api/users":
          if (method === "GET") {
            const page = parseInt(url.searchParams.get("page") || "1");
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const search = url.searchParams.get("search") || "";

            let query = "SELECT * FROM users";
            let params: any[] = [];

            if (search) {
              query += " WHERE name LIKE ? OR email LIKE ?";
              params.push(`%${search}%`, `%${search}%`);
            }

            query += " ORDER BY created_at DESC";

            const users = db.query(query).all(...params) as User[];
            const result = paginate(users, page, limit);
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

            try {
              const now = new Date().toISOString();
              const result = db.run(
                `INSERT INTO users (name, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
                [
                  body.name.trim(),
                  body.email.trim(),
                  body.role || "user",
                  now,
                  now,
                ]
              );

              const newUser = db
                .query("SELECT * FROM users WHERE id = ?")
                .get(result.lastInsertRowid) as User;
              response = Response.json(newUser, { status: 201 });
            } catch (error: any) {
              if (error.message?.includes("UNIQUE constraint failed")) {
                response = Response.json(
                  { error: "Email already exists" },
                  { status: 409 }
                );
              } else {
                response = Response.json(
                  { error: "Database error", message: error.message },
                  { status: 500 }
                );
              }
            }
          } else {
            response = new Response("Method not allowed", { status: 405 });
          }
          break;

        // Posts endpoints
        case "/api/posts":
          if (method === "GET") {
            const page = parseInt(url.searchParams.get("page") || "1");
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const published = url.searchParams.get("published");
            const authorId = url.searchParams.get("authorId");

            let query = `
              SELECT p.*, u.name as author_name, u.email as author_email
              FROM posts p
              JOIN users u ON p.author_id = u.id
            `;
            let params: any[] = [];
            let conditions: string[] = [];

            if (published !== null) {
              conditions.push("p.published = ?");
              params.push(published === "true");
            }

            if (authorId) {
              conditions.push("p.author_id = ?");
              params.push(parseInt(authorId));
            }

            if (conditions.length > 0) {
              query += " WHERE " + conditions.join(" AND ");
            }

            query += " ORDER BY p.created_at DESC";

            const posts = db.query(query).all(...params) as any[];

            // Transform to match expected format
            const transformedPosts = posts.map((post) => ({
              id: post.id,
              title: post.title,
              content: post.content,
              author_id: post.author_id,
              published: Boolean(post.published),
              created_at: post.created_at,
              updated_at: post.updated_at,
              author: {
                id: post.author_id,
                name: post.author_name,
                email: post.author_email,
              },
            }));

            const result = paginate(transformedPosts, page, limit);
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

            const now = new Date().toISOString();
            const result = db.run(
              `INSERT INTO posts (title, content, author_id, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
              [
                body.title.trim(),
                body.content.trim(),
                body.author_id || (auth as any).user.id,
                body.published !== undefined ? body.published : false,
                now,
                now,
              ]
            );

            const newPost = db
              .query(
                `SELECT p.*, u.name as author_name, u.email as author_email FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?`
              )
              .get(result.lastInsertRowid) as any;

            const transformedPost = {
              id: newPost.id,
              title: newPost.title,
              content: newPost.content,
              author_id: newPost.author_id,
              published: Boolean(newPost.published),
              created_at: newPost.created_at,
              updated_at: newPost.updated_at,
              author: {
                id: newPost.author_id,
                name: newPost.author_name,
                email: newPost.author_email,
              },
            };

            response = Response.json(transformedPost, { status: 201 });
          } else {
            response = new Response("Method not allowed", { status: 405 });
          }
          break;

        // User by ID endpoint
        default:
          if (url.pathname.startsWith("/api/users/") && method === "GET") {
            const id = parseInt(url.pathname.split("/")[3]);
            const user = db
              .query("SELECT * FROM users WHERE id = ?")
              .get(id) as User;

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
            const user = db
              .query("SELECT * FROM users WHERE id = ?")
              .get(id) as User;

            if (!user) {
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

            try {
              const now = new Date().toISOString();
              db.run(
                `UPDATE users SET name = ?, email = ?, role = ?, updated_at = ? WHERE id = ?`,
                [
                  body.name.trim(),
                  body.email.trim(),
                  body.role || user.role,
                  now,
                  id,
                ]
              );

              const updatedUser = db
                .query("SELECT * FROM users WHERE id = ?")
                .get(id) as User;
              response = Response.json(updatedUser);
            } catch (error: any) {
              if (error.message?.includes("UNIQUE constraint failed")) {
                response = Response.json(
                  { error: "Email already exists" },
                  { status: 409 }
                );
              } else {
                response = Response.json(
                  { error: "Database error", message: error.message },
                  { status: 500 }
                );
              }
            }
          } else if (
            url.pathname.startsWith("/api/users/") &&
            method === "DELETE"
          ) {
            const id = parseInt(url.pathname.split("/")[3]);
            const user = db
              .query("SELECT * FROM users WHERE id = ?")
              .get(id) as User;

            if (!user) {
              response = Response.json(
                { error: "User not found" },
                { status: 404 }
              );
              break;
            }

            // Delete user and related data
            db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [id]);
            db.run("DELETE FROM posts WHERE author_id = ?", [id]);
            db.run("DELETE FROM users WHERE id = ?", [id]);

            response = Response.json({ message: "User deleted successfully" });
          } else if (
            url.pathname.startsWith("/api/posts/") &&
            method === "GET"
          ) {
            const id = parseInt(url.pathname.split("/")[3]);
            const post = db
              .query(
                `SELECT p.*, u.name as author_name, u.email as author_email FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?`
              )
              .get(id) as any;

            if (!post) {
              response = Response.json(
                { error: "Post not found" },
                { status: 404 }
              );
              break;
            }

            const transformedPost = {
              id: post.id,
              title: post.title,
              content: post.content,
              author_id: post.author_id,
              published: Boolean(post.published),
              created_at: post.created_at,
              updated_at: post.updated_at,
              author: {
                id: post.author_id,
                name: post.author_name,
                email: post.author_email,
              },
            };

            response = Response.json(transformedPost);
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
            const post = db
              .query("SELECT * FROM posts WHERE id = ?")
              .get(id) as Post;

            if (!post) {
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

            const now = new Date().toISOString();
            db.run(
              `UPDATE posts SET title = ?, content = ?, published = ?, updated_at = ? WHERE id = ?`,
              [
                body.title.trim(),
                body.content.trim(),
                body.published !== undefined ? body.published : post.published,
                now,
                id,
              ]
            );

            const updatedPost = db
              .query(
                `SELECT p.*, u.name as author_name, u.email as author_email FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?`
              )
              .get(id) as any;

            const transformedPost = {
              id: updatedPost.id,
              title: updatedPost.title,
              content: updatedPost.content,
              author_id: updatedPost.author_id,
              published: Boolean(updatedPost.published),
              created_at: updatedPost.created_at,
              updated_at: updatedPost.updated_at,
              author: {
                id: updatedPost.author_id,
                name: updatedPost.author_name,
                email: updatedPost.author_email,
              },
            };

            response = Response.json(transformedPost);
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
            const post = db
              .query("SELECT * FROM posts WHERE id = ?")
              .get(id) as Post;

            if (!post) {
              response = Response.json(
                { error: "Post not found" },
                { status: 404 }
              );
              break;
            }

            db.run("DELETE FROM posts WHERE id = ?", [id]);
            response = Response.json({ message: "Post deleted successfully" });
          } else if (url.pathname.startsWith("/api/files")) {
            // File upload endpoints
            if (url.pathname === "/api/files/upload" && method === "POST") {
              const auth = authMiddleware(req);
              if (auth instanceof Response) {
                response = auth;
                break;
              }

              try {
                const formData = await req.formData();
                const file = formData.get("file") as File;

                if (!file) {
                  response = Response.json(
                    { error: "No file provided" },
                    { status: 400 }
                  );
                  break;
                }

                const validation = validateFile(file);
                if (!validation.valid) {
                  response = Response.json(
                    { error: "Validation failed", errors: validation.errors },
                    { status: 400 }
                  );
                  break;
                }

                const uniqueFilename = generateUniqueFilename(file.name);
                const filePath = await saveUploadedFile(file, uniqueFilename);

                const now = new Date().toISOString();
                const result = db.run(
                  `INSERT INTO files (filename, original_name, mimetype, size, uploaded_by, file_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                  [
                    uniqueFilename,
                    file.name,
                    file.type,
                    file.size,
                    auth.user?.id || 0,
                    filePath,
                    now,
                  ]
                );

                const uploadedFile = db
                  .query(
                    `SELECT f.*, u.name as uploader_name, u.email as uploader_email FROM files f JOIN users u ON f.uploaded_by = u.id WHERE f.id = ?`
                  )
                  .get(result.lastInsertRowid) as any;

                response = Response.json(
                  {
                    id: uploadedFile.id,
                    filename: uploadedFile.filename,
                    original_name: uploadedFile.original_name,
                    mimetype: uploadedFile.mimetype,
                    size: uploadedFile.size,
                    created_at: uploadedFile.created_at,
                    uploader: {
                      id: uploadedFile.uploaded_by,
                      name: uploadedFile.uploader_name,
                      email: uploadedFile.uploader_email,
                    },
                  },
                  { status: 201 }
                );
              } catch (error) {
                response = Response.json(
                  {
                    error: "Upload failed",
                    message:
                      error instanceof Error ? error.message : "Unknown error",
                  },
                  { status: 500 }
                );
              }
            } else if (url.pathname === "/api/files" && method === "GET") {
              const page = parseInt(url.searchParams.get("page") || "1");
              const limit = parseInt(url.searchParams.get("limit") || "10");

              const files = db
                .query(
                  `SELECT f.*, u.name as uploader_name, u.email as uploader_email FROM files f JOIN users u ON f.uploaded_by = u.id ORDER BY f.created_at DESC`
                )
                .all() as any[];

              const result = paginate(files, page, limit);
              response = Response.json(result);
            } else if (
              url.pathname.startsWith("/api/files/") &&
              method === "GET"
            ) {
              const id = parseInt(url.pathname.split("/")[3]);
              const isDownload = url.pathname.endsWith("/download");

              if (isDownload) {
                // Handle file download
                const fileId = parseInt(url.pathname.split("/")[3]);
                const file = db
                  .query("SELECT * FROM files WHERE id = ?")
                  .get(fileId) as any;

                if (!file) {
                  response = Response.json(
                    { error: "File not found" },
                    { status: 404 }
                  );
                  break;
                }

                try {
                  const fileData = Bun.file(file.file_path);
                  response = new Response(fileData, {
                    headers: {
                      "Content-Type": file.mimetype,
                      "Content-Disposition": `attachment; filename="${file.original_name}"`,
                    },
                  });
                } catch (error) {
                  response = Response.json(
                    { error: "File not found on disk" },
                    { status: 404 }
                  );
                }
              } else {
                // Get file info
                const file = db
                  .query(
                    `SELECT f.*, u.name as uploader_name, u.email as uploader_email FROM files f JOIN users u ON f.uploaded_by = u.id WHERE f.id = ?`
                  )
                  .get(id) as any;

                if (!file) {
                  response = Response.json(
                    { error: "File not found" },
                    { status: 404 }
                  );
                  break;
                }

                response = Response.json({
                  id: file.id,
                  filename: file.filename,
                  original_name: file.original_name,
                  mimetype: file.mimetype,
                  size: file.size,
                  created_at: file.created_at,
                  uploader: {
                    id: file.uploaded_by,
                    name: file.uploader_name,
                    email: file.uploader_email,
                  },
                });
              }
            } else if (
              url.pathname.startsWith("/api/files/") &&
              method === "DELETE"
            ) {
              const auth = authMiddleware(req);
              if (auth instanceof Response) {
                response = auth;
                break;
              }

              const id = parseInt(url.pathname.split("/")[3]);
              const file = db
                .query("SELECT * FROM files WHERE id = ?")
                .get(id) as any;

              if (!file) {
                response = Response.json(
                  { error: "File not found" },
                  { status: 404 }
                );
                break;
              }

              // Delete file from disk
              try {
                await Bun.write(file.file_path, ""); // Clear file
                // Note: In production, you'd want to properly delete the file
              } catch (error) {
                console.error("Failed to delete file from disk:", error);
              }

              // Delete from database
              db.run("DELETE FROM files WHERE id = ?", [id]);
              response = Response.json({
                message: "File deleted successfully",
              });
            } else {
              response = new Response("Method not allowed", { status: 405 });
            }
          } else {
            response = new Response("Not Found", { status: 404 });
          }
      }

      // Apply CORS middleware to all responses
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
  websocket: {
    // TypeScript: specify the type of ws.data
    data: {} as {
      connected: string;
      userId?: number;
      username?: string;
      authenticated?: boolean;
    },

    // Called when a WebSocket connection is established
    open(ws) {
      connectedClients++;
      console.log(
        `🔌 WebSocket client connected at ${ws.data.connected} (Total: ${connectedClients})`
      );

      // Subscribe to global notifications
      ws.subscribe("global-notifications");

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: "welcome",
          message: "Connected to enhanced API real-time features",
          timestamp: new Date().toISOString(),
          connected: ws.data.connected,
        })
      );

      // Broadcast connection notification
      server.publish(
        "global-notifications",
        JSON.stringify({
          type: "user_connected",
          message: "New user connected to real-time features",
          timestamp: new Date().toISOString(),
          connectedClients: connectedClients,
        })
      );
    },

    // Called when a message is received from a WebSocket client
    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case "authenticate":
            // Authenticate WebSocket connection with JWT
            if (data.token) {
              try {
                const payload = verifyJWT(data.token) as any;
                ws.data.userId = payload.userId;
                ws.data.username = payload.email;
                ws.data.authenticated = true;

                // Subscribe to user-specific notifications
                ws.subscribe(`user-${payload.userId}`);

                ws.send(
                  JSON.stringify({
                    type: "authenticated",
                    message: "WebSocket connection authenticated",
                    user: { id: payload.userId, email: payload.email },
                  })
                );

                // Broadcast user status
                server.publish(
                  "global-notifications",
                  JSON.stringify({
                    type: "user_authenticated",
                    message: `User ${payload.email} authenticated`,
                    timestamp: new Date().toISOString(),
                  })
                );
              } catch (error) {
                ws.send(
                  JSON.stringify({
                    type: "authentication_error",
                    message: "Invalid authentication token",
                  })
                );
              }
            }
            break;

          case "chat_message":
            // Handle chat messages (requires authentication)
            if (ws.data.authenticated && data.message) {
              const chatMessage = {
                type: "chat_message",
                id: Date.now(),
                userId: ws.data.userId,
                username: ws.data.username,
                message: data.message,
                timestamp: new Date().toISOString(),
              };

              // Broadcast to all connected clients
              server.publish("global-chat", JSON.stringify(chatMessage));
            } else {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Authentication required to send messages",
                })
              );
            }
            break;

          case "ping":
            // Handle ping for connection testing
            ws.send(
              JSON.stringify({
                type: "pong",
                timestamp: new Date().toISOString(),
              })
            );
            break;

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Unknown message type",
              })
            );
        }
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid JSON message format",
          })
        );
      }
    },

    // Called when a WebSocket connection is closed
    close(ws, code, message) {
      connectedClients--;
      console.log(
        `🔌 WebSocket client disconnected: ${code} ${message} (Total: ${connectedClients})`
      );

      // Broadcast disconnection notification
      server.publish(
        "global-notifications",
        JSON.stringify({
          type: "user_disconnected",
          message: "User disconnected from real-time features",
          timestamp: new Date().toISOString(),
          connectedClients: connectedClients,
        })
      );

      // Unsubscribe from all topics
      ws.unsubscribe("global-notifications");
      ws.unsubscribe("global-chat");
      if (ws.data.userId) {
        ws.unsubscribe(`user-${ws.data.userId}`);
      }
    },

    // Handle WebSocket errors - Note: error handler not supported in Bun WebSocket API
    // Errors are handled through try-catch blocks in message handlers
    drain(ws) {
      // Handle when socket is ready to accept more data (optional)
    },
  },
  error(error) {
    // Handle server-side errors with proper error response using Bun's enhanced debugging
    console.error("🚨 Server error:", error);

    // Use Bun.inspect for enhanced error debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 Enhanced error preview:");
      console.log(Bun.inspect(error, { colors: true }));
    }

    // Return a proper error response with enhanced debugging information
    const errorResponse = {
      error: "Internal server error",
      message: error.message || "Unknown error occurred",
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== "production" && {
        stack: error.stack,
        development: true,
        // Add enhanced debugging info using Bun.inspect
        debugInfo: Bun.inspect(error, { colors: false }).replace(
          /\x1b\[[0-9;]*m/g,
          ""
        ), // Remove color codes for JSON
        fileName: error.stack?.split("\n")[1]?.trim().replace("at ", ""),
        lineNumber: error.stack?.split("\n")[1]?.match(/:(\d+):\d+/)?.[1],
      }),
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  },
});

console.log(
  `🚀 Enhanced Full API Server running at http://localhost:${server.port}`
);
console.log(`📚 Features: SQLite Database, JWT Authentication, Rate Limiting`);
console.log(`🔧 Try: curl http://localhost:${server.port}/api/status`);
