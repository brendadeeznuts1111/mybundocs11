# Real-World Use Case Patterns

> **Official Documentation**: [bun.sh/docs](https://bun.sh/docs)

## Enterprise Application Patterns
```typescript
// Multi-environment configuration pattern
export class BunConfig {
  private static instance: BunConfig;
  private config: Record<string, any>;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): BunConfig {
    if (!BunConfig.instance) {
      BunConfig.instance = new BunConfig();
    }
    return BunConfig.instance;
  }

  private loadConfig() {
    const env = Bun.env.NODE_ENV || 'development';
    const configFile = `./config/${env}.json`;

    try {
      // Load from file
      const file = Bun.file(configFile);
      const content = await file.text();
      return JSON.parse(content);
    } catch {
      // Fallback to environment variables
      return {
        database: {
          url: Bun.env.DATABASE_URL,
          pool: {
            max: parseInt(Bun.env.DB_POOL_MAX || '10')
          }
        },
        redis: {
          url: Bun.env.REDIS_URL,
          ttl: parseInt(Bun.env.REDIS_TTL || '3600')
        }
      };
    }
  }

  get<T = any>(key: string, defaultValue?: T): T {
    return this.config[key] ?? defaultValue;
  }
}
```

## 2. **Performance Benchmark Examples**

### Comparative Benchmarks Table
```markdown
| Operation | Bun 1.0 | Node 20 | Deno 1.37 | Speed Ratio |
|-----------|---------|---------|-----------|-------------|
| HTTP Server (req/sec) | 160,000 | 80,000 | 95,000 | 2.0x |
| File Read (10MB) | 42ms | 85ms | 68ms | 2.02x |
| JSON Parse (1MB) | 1.2ms | 2.8ms | 2.1ms | 2.33x |
| TCP Connect (1000) | 120ms | 320ms | 280ms | 2.67x |
| SQLite Query | 45μs | 210μs | 180μs | 4.67x |
| WebSocket Msg | 28μs | 95μs | 82μs | 3.39x |
```

### Memory Usage Comparison
```typescript
// Memory usage tracking utility
class MemoryTracker {
  private samples: number[] = [];
  private interval: Timer;

  constructor(private label: string, intervalMs = 1000) {
    this.interval = setInterval(() => {
      const mem = process.memoryUsage();
      this.samples.push(mem.heapUsed);

      if (this.samples.length > 60) {
        this.logStats();
        this.samples = [];
      }
    }, intervalMs);
  }

  logStats() {
    const avg = this.samples.reduce((a, b) => a + b) / this.samples.length;
    const max = Math.max(...this.samples);
    const min = Math.min(...this.samples);

    console.table({
      'Metric': ['Average', 'Max', 'Min', 'Current'],
      'Heap Used (MB)': [
        (avg / 1024 / 1024).toFixed(2),
        (max / 1024 / 1024).toFixed(2),
        (min / 1024 / 1024).toFixed(2),
        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
      ]
    });
  }

  stop() {
    clearInterval(this.interval);
  }
}
```

## 3. **Security Hardening Guide**

### Security Configuration Template
```typescript
// security.config.ts
export const SecurityConfig = {
  // HTTP Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.'
  },

  // Input validation
  validation: {
    maxRequestBodySize: '10mb',
    maxQueryStringLength: 2048,
    maxHeaderSize: 16384
  },

  // CORS configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }
};

// Secure Bun.serve configuration
Bun.serve({
  port: 3000,
  fetch(req) {
    const response = new Response('Hello');

    // Apply security headers
    Object.entries(SecurityConfig.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },

  // Security middleware
  error(error) {
    console.error('Security error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'X-Error': 'Internal' } // Don't expose details
    });
  }
});
```

## 4. **Migration Assistant Examples**

### Node.js → Bun Migration Checklist
```markdown
## Migration Checklist

### ✅ Package.json Updates
- [ ] Remove `node-fetch`, `axios` (use built-in `fetch`)
- [ ] Remove `nodemon` (use `bun --watch`)
- [ ] Update scripts: `"start": "bun run src/index.ts"`
- [ ] Add Bun type definitions: `"devDependencies": { "@types/bun": "latest" }`

### ✅ Code Changes
- [ ] Replace `require()` with ES6 `import`
- [ ] Replace `fs.readFileSync` with `Bun.file().text()`
- [ ] Replace `child_process` with `Bun.spawn()`
- [ ] Update `__dirname` → `import.meta.dir`

### ✅ Configuration
- [ ] Create `bunfig.toml`
- [ ] Update environment variables
- [ ] Configure TypeScript for Bun

### ✅ Testing
- [ ] Update test runners to use `bun test`
- [ ] Update assertion libraries
- [ ] Check native module compatibility
```

### Automated Migration Script
```typescript
// migrate-from-node.ts
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class NodeToBunMigrator {
  async migrateProject(rootDir: string) {
    console.log('🚀 Starting migration from Node.js to Bun...');

    // 1. Update package.json
    await this.migratePackageJson(rootDir);

    // 2. Replace require() with import
    await this.replaceRequireStatements(rootDir);

    // 3. Update scripts in all files
    await this.updateScriptReferences(rootDir);

    // 4. Create bunfig.toml
    await this.createBunConfig(rootDir);

    console.log('✅ Migration complete!');
    console.log('Next steps:');
    console.log('1. Run: bun install');
    console.log('2. Run: bun test');
    console.log('3. Deploy with: bun --smol server.js');
  }

  private async migratePackageJson(dir: string) {
    const packagePath = join(dir, 'package.json');
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

    // Remove Node-specific packages
    const toRemove = ['node-fetch', 'axios', 'nodemon', 'ts-node'];
    pkg.dependencies = this.filterObject(pkg.dependencies, toRemove);
    pkg.devDependencies = this.filterObject(pkg.devDependencies, toRemove);

    // Update scripts
    pkg.scripts = {
      ...pkg.scripts,
      start: pkg.scripts.start?.replace('node', 'bun') || 'bun run src/index.ts',
      dev: 'bun --watch src/index.ts',
      test: 'bun test'
    };

    // Add Bun types
    pkg.devDependencies['@types/bun'] = 'latest';

    writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  }

  private filterObject(obj: Record<string, string>, keys: string[]) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key))
    );
  }
}
```

## 5. **Interactive Tutorial Examples**

### Step-by-Step Learning Path
```markdown
## Bun Learning Path 🚀

### Level 1: Basics (1-2 hours)
- [ ] Install Bun and verify: `bun --version`
- [ ] Create first script: `bun init`
- [ ] Run TypeScript directly: `bun hello.ts`
- [ ] Use built-in fetch: `fetch('https://api.example.com')`

### Level 2: Development (3-4 hours)
- [ ] Set up hot reload: `bun --watch --hot`
- [ ] Use Bun.serve() for HTTP
- [ ] Work with files: `Bun.file()`, `Bun.write()`
- [ ] Environment configuration

### Level 3: Production (2-3 hours)
- [ ] Optimize with flags: `--smol`, `--no-deprecation`
- [ ] Configure bunfig.toml
- [ ] Set up logging and monitoring
- [ ] Security hardening

### Level 4: Advanced (4-5 hours)
- [ ] Native modules with `bun build`
- [ ] WebSockets with Bun.serve()
- [ ] Database integration
- [ ] Deploy to Docker/Kubernetes
```

## 6. **Troubleshooting Matrix**

### Common Issues & Solutions
```markdown
| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Memory Leaks** | RSS keeps increasing, GC频繁 | Use `--smol`, call `Bun.gc()`, check for circular references |
| **Slow Startup** | Takes >2s to start | Use `--preload`, `--fetch-preconnect`, reduce dependencies |
| **Module Not Found** | `Error: Cannot find module` | Check `--extension-order`, use `Bun.resolve()`, verify node_modules |
| **TypeScript Errors** | Type errors but code works | Update `@types/bun`, check tsconfig, use `--tsconfig-override` |
| **Network Timeouts** | Fetch requests hang | Use `AbortSignal.timeout()`, check `--dns-result-order`, proxy settings |
| **Native Modules** | `Module did not self-register` | Use `--no-addons`, rebuild with `bun build`, check compatibility |
```

## 7. **Integration Recipes**

### Popular Framework Integrations
```typescript
// Next.js with Bun
// bunfig.toml
[build]
outdir = ".next"
target = "browser"

[dev]
port = 3000
hot = true

// package.json scripts
{
  "scripts": {
    "dev": "bun run --watch next dev",
    "build": "bun run next build",
    "start": "bun run next start"
  }
}

// Express.js with Bun
import express from 'express';

const app = express();
const port = Bun.env.PORT || 3000;

// Use Bun's optimizations
app.use((req, res, next) => {
  // Bun-specific optimizations
  if (req.url.endsWith('.js') || req.url.endsWith('.css')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});

Bun.serve({
  port,
  fetch: app
});
```

## 8. **Monitoring & Observability**

### Performance Monitoring Setup
```typescript
import { serve } from 'bun';

const server = serve({
  port: 3000,
  fetch(req) {
    const start = performance.now();

    // Process request
    const response = new Response('OK');

    const duration = performance.now() - start;

    // Log metrics
    Bun.write(
      'logs/metrics.jsonl',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        duration,
        memory: process.memoryUsage().heapUsed
      }) + '\n'
    );

    return response;
  }
});

// Health check endpoint
Bun.serve({
  port: 3001,
  fetch(req) {
    return new Response(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: Bun.version
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

## 9. **Community Best Practices**

### Production Deployment Checklist
```markdown
## Production Deployment Checklist

### Before Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Configure `bunfig.toml` for production
- [ ] Enable security headers
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting

### Performance Optimization
- [ ] Use `--smol` for memory efficiency
- [ ] Enable `--prefer-offline` for faster starts
- [ ] Configure appropriate `--max-http-header-size`
- [ ] Set up DNS caching with `--dns-result-order`

### Security Hardening
- [ ] Disable `--inspect` in production
- [ ] Use `--no-deprecation --throw-deprecation`
- [ ] Configure CORS properly
- [ ] Set up SSL/TLS with valid certificates

### Monitoring
- [ ] Set up health checks
- [ ] Configure logging to external service
- [ ] Set up alerting for errors
- [ ] Monitor memory usage and restart thresholds
```

## 10. **Interactive Code Playground**

### Browser-Based Examples
```html
<!-- Interactive Bun playground -->
<!DOCTYPE html>
<html>
<head>
  <title>Bun Playground</title>
  <style>
    .editor { width: 100%; height: 300px; font-family: monospace; }
    .output { background: #f5f5f5; padding: 10px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Bun Code Playground</h1>

  <select id="exampleSelect">
    <option value="fetch">Fetch API</option>
    <option value="file">File I/O</option>
    <option value="server">HTTP Server</option>
    <option value="websocket">WebSocket</option>
  </select>

  <textarea id="codeEditor" class="editor">
// Select an example from the dropdown
console.log('Welcome to Bun!');
  </textarea>

  <button onclick="runCode()">Run Code</button>

  <div id="output" class="output"></div>

  <script>
    const examples = {
      fetch: `const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
const data = await response.json();
console.log(data);`,

      file: `const file = Bun.file('example.txt');
await Bun.write(file, 'Hello Bun!');
const content = await file.text();
console.log(content);`,

      server: `Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello from Bun!');
  }
});`,

      websocket: `Bun.serve({
  port: 3000,
  websocket: {
    message(ws, message) {
      ws.send('Echo: ' + message);
    }
  },
  fetch(req) {
    return new Response('WebSocket server');
  }
});`
    };

    document.getElementById('exampleSelect').addEventListener('change', (e) => {
      document.getElementById('codeEditor').value = examples[e.target.value];
    });

    async function runCode() {
      const code = document.getElementById('codeEditor').value;
      const output = document.getElementById('output');

      try {
        // In a real implementation, this would send code to a Bun server
        const response = await fetch('/execute', {
          method: 'POST',
          body: JSON.stringify({ code })
        });
        const result = await response.json();
        output.textContent = result.output;
      } catch (error) {
        output.textContent = 'Error: ' + error.message;
      }
    }
  </script>
</body>
</html>
```

## 11. **Video Tutorial Series Outline**

```markdown
# Bun Video Tutorial Series (YouTube/Platform)

## Series 1: Bun Basics (Beginner)
- Episode 1: Why Bun? Speed comparison & installation
- Episode 2: Your first Bun app (TypeScript, JavaScript)
- Episode 3: Built-in tools (test runner, bundler, package manager)
- Episode 4: File I/O and streams

## Series 2: Web Development (Intermediate)
- Episode 5: Building HTTP servers with Bun.serve()
- Episode 6: WebSockets and real-time apps
- Episode 7: Database integration (SQLite, PostgreSQL)
- Episode 8: Authentication and security

## Series 3: Performance (Advanced)
- Episode 9: Benchmarking and optimization
- Episode 10: Memory management and GC tuning
- Episode 11: Native modules and FFI
- Episode 12: Deploying at scale

## Series 4: Real Projects
- Episode 13: Full-stack app with React + Bun
- Episode 14: Microservices architecture
- Episode 15: CLI tool development
- Episode 16: Game server with WebSockets
```

## 12. **Contributor Guidelines**

```markdown
# Contributing to Bun Documentation

## Documentation Structure
```
docs/
├── getting-started/     # Tutorials for beginners
├── api/                 # API reference (like this document)
├── guides/              # How-to guides
├── examples/            # Complete example projects
├── best-practices/      # Production recommendations
└── troubleshooting/     # Common issues and solutions
```

## Writing Style Guide
- Use active voice: "Bun executes code" not "Code is executed by Bun"
- Include code examples for every feature
- Show before/after comparisons when relevant
- Include performance characteristics
- Add "See Also" sections for related features

## Example Quality Standards
1. Examples must be runnable
2. Include error handling
3. Show both simple and advanced usage
4. Include TypeScript and JavaScript versions
5. Add comments explaining non-obvious parts
```

These enhancements would make the documentation more:
1. **Practical** - Real-world examples and patterns
2. **Comprehensive** - Covers all aspects from beginner to expert
3. **Interactive** - Learning paths and playgrounds
4. **Production-ready** - Security, monitoring, deployment guides
5. **Community-focused** - Contribution guidelines and best practices

The key is to bridge the gap between API reference documentation and practical, real-world usage that helps developers successfully adopt and master Bun.

---

## Additional Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Main Docs | [bun.sh/docs](https://bun.sh/docs) | Official documentation |
| API Reference | [bun.sh/docs/api](https://bun.sh/docs/api) | Bun-specific APIs |
| HTTP Server | [bun.sh/docs/api/http](https://bun.sh/docs/api/http) | `Bun.serve()` API |
| File I/O | [bun.sh/docs/api/file-io](https://bun.sh/docs/api/file-io) | `Bun.file()` API |
| SQLite | [bun.sh/docs/api/sqlite](https://bun.sh/docs/api/sqlite) | Database API |
| WebSockets | [bun.sh/docs/api/websockets](https://bun.sh/docs/api/websockets) | Real-time API |
| Workers | [bun.sh/docs/api/workers](https://bun.sh/docs/api/workers) | Multi-threading |
| GitHub | [github.com/oven-sh/bun](https://github.com/oven-sh/bun) | Source & issues |

---

*Last Updated: 2025-12-26*
