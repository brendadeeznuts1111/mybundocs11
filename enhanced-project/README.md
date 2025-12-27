# My Bun Template

A feature-rich starter template for Bun projects with API endpoints, routing, and testing.

## Getting Started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Run in development mode:

   ```bash
   bun dev
   ```

3. Run in production mode:

   ```bash
   bun start
   ```

4. Run with custom port:

   ```bash
   PORT=8080 bun dev
   ```

5. Run tests:

   ```bash
   bun test
   ```

6. Run tests in watch mode:

   ```bash
   bun test:watch
   ```

## What's included?

- Basic TypeScript setup
- HTTP server with routing system
- RESTful API endpoints
- JSON responses
- Testing setup with Bun test
- Development scripts
- Configurable port via environment variables
- Ready to customize!

## API Endpoints

- `GET /` - Welcome message with endpoint list
- `GET /api/status` - Server health check
- `GET /api/users` - Get list of users
- `POST /api/users` - Create a new user
- `GET /static/*` - Static file serving (placeholder)

## Testing

The template includes comprehensive tests for all API endpoints:

```bash
bun test              # Run all tests
bun test --watch      # Run tests in watch mode
```

## Environment Variables

- `PORT`: Server port (defaults to 3000)

## Examples

### Testing the API

```bash
# Start the server
bun dev

# Test endpoints in another terminal
curl http://localhost:3000/api/status
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John","email":"john@example.com"}'
```

## Learn more

- [Bun Documentation](https://bun.sh/docs)
- [Bun API Reference](https://bun.sh/docs/api)
- [Bun Testing](https://bun.sh/docs/test)
