import { describe, expect, it } from "bun:test";

describe("Server API", () => {
  const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

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
    expect(data).toHaveProperty("port");
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
  });
});
