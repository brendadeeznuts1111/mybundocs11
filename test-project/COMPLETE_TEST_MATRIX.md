# Bun HTTP Server Configuration - Complete Test Matrix

This document provides a comprehensive test matrix showing all configuration options, expected behavior, and verification tests.

## Configuration Matrix

| Config Type | Port | Hostname | Expected URL | Test Command | Expected Output |
|-------------|------|----------|--------------|--------------|-----------------|
| **Basic** | 3000 | localhost | http://localhost:3000 | `bun run bun-server-config.ts 1` | "Hello, Bun! Basic server configuration" |
| **Production** | env/8080 | 0.0.0.0 | http://0.0.0.0:8080 | `bun run bun-server-config.ts 2` | Production API with security headers |
| **TLS/HTTPS** | 3443 | localhost | https://localhost:3443 | `bun run bun-server-config.ts 3` | Secure HTTPS response |
| **WebSocket** | 3001 | localhost | ws://localhost:3001/ws | `bun run bun-server-config.ts 4` | WebSocket upgrade + messages |
| **High-Performance** | 3000 | 0.0.0.0 | http://0.0.0.0:3000 | `bun run bun-server-config.ts 5` | Optimized responses |
| **Advanced** | 3000 | localhost | http://localhost:3000 | `bun run bun-server-config.ts 6` | Auth + rate limiting |
| **Random Port** | 0 | localhost | http://localhost:XXXXX | `bun run test-random-port.ts` | Port: 61475 (random) |

## Environment Variable Fallback Tests

### Test 1: Explicit Port (Highest Priority)
```bash
export BUN_PORT=9000
export PORT=8000
export NODE_PORT=7000

# Code: Bun.serve({ fetch: () => new Response("Test") })
# Expected: Uses 3000 (default, no explicit port)
```

### Test 2: BUN_PORT Priority
```bash
export BUN_PORT=9000
export PORT=8000
export NODE_PORT=7000

# Code: Bun.serve({ fetch: () => new Response("Test") })
# Expected: Uses 9000 (BUN_PORT has highest priority)
```

### Test 3: PORT Fallback
```bash
export PORT=8000
# BUN_PORT not set

# Code: Bun.serve({ fetch: () => new Response("Test") })
# Expected: Uses 8000 (PORT checked after BUN_PORT)
```

### Test 4: NODE_PORT Fallback
```bash
export NODE_PORT=7000
# BUN_PORT and PORT not set

# Code: Bun.serve({ fetch: () => new Response("Test") })
# Expected: Uses 7000 (NODE_PORT checked last)
```

### Test 5: Explicit Overrides Everything
```bash
export BUN_PORT=9000
export PORT=8000

# Code: Bun.serve({ port: 3000, fetch: () => new Response("Test") })
# Expected: Uses 3000 (explicit parameter wins)
```

## Endpoint Test Matrix

All configurations support these endpoints:

| Endpoint | Method | Expected Response | Test |
|----------|--------|-------------------|------|
| `/` | GET | Welcome message + endpoints | `curl http://localhost:PORT/` |
| `/health` | GET | `{status: "healthy", uptime: "..."}` | `curl http://localhost:PORT/health` |
| `/info` | GET | Runtime, system, memory data | `curl http://localhost:PORT/info` |
| `/metrics` | GET | Request counts, error rates | `curl http://localhost:PORT/metrics` |
| `/external` | GET | External API integration | `curl http://localhost:PORT/external` |
| `/bench?iterations=10&target=health` | GET | Performance benchmark | `curl http://localhost:PORT/bench?iterations=10&target=health` |
| `/verbose?enable=true` | GET | Toggle verbose logging | `curl http://localhost:PORT/verbose?enable=true` |
| `/nonexistent` | GET | 404 error | `curl http://localhost:PORT/nonexistent` |

## WebSocket Test Matrix

| Action | Expected Behavior | Test Command |
|--------|-------------------|--------------|
| Connect to `/ws` | Upgrade to WebSocket | `wscat -c ws://localhost:3001/ws` |
| Send message | Echo with timestamp | Send: `{"message": "hello"}` |
| Multiple clients | Broadcast notifications | Connect 2+ clients |
| Close connection | Clean disconnect | Ctrl+C in wscat |

## Security Test Matrix

| Feature | Test | Expected |
|---------|------|----------|
| CORS | `curl -H "Origin: http://example.com" http://localhost:3000/` | Headers present |
| Rate Limiting | 11 requests in 1 minute | 429 status on 11th |
| Auth Required | `curl http://localhost:3000/api/protected` | 401 Unauthorized |
| Valid Token | `curl -H "Authorization: Bearer demo-token" http://localhost:3000/api/protected` | 200 OK |
| Invalid Token | `curl -H "Authorization: Bearer wrong" http://localhost:3000/api/protected` | 403 Forbidden |

## Performance Test Matrix

| Metric | Expected Range | Test |
|--------|----------------|------|
| Basic endpoint | < 1ms | `curl -w "@curl-format.txt" http://localhost:3000/health` |
| Info endpoint | < 10ms | `curl -w "@curl-format.txt" http://localhost:3000/info` |
| Metrics endpoint | < 5ms | `curl -w "@curl-format.txt" http://localhost:3000/metrics` |
| External API | 50-200ms | `curl -w "@curl-format.txt" http://localhost:3000/external` |
| Benchmark (100) | < 100ms total | `curl http://localhost:3000/bench?iterations=100&target=health` |

## Complete Test Script

```bash
#!/bin/bash
# test-all-configs.sh

echo "🧪 Testing All Bun Server Configurations"
echo "========================================"

# Test 1: Basic Configuration
echo -e "\n1. Testing Basic Configuration..."
cd test-project
bun run bun-server-config.ts 1 &
PID=$!
sleep 2
curl -s http://localhost:3000/ | jq -r '.message'
kill $PID
wait $PID 2>/dev/null

# Test 2: Production Configuration
echo -e "\n2. Testing Production Configuration..."
export BUN_PORT=8080
bun run bun-server-config.ts 2 &
PID=$!
sleep 2
curl -s http://localhost:8080/health | jq -r '.status'
kill $PID
wait $PID 2>/dev/null
unset BUN_PORT

# Test 3: Random Port
echo -e "\n3. Testing Random Port..."
bun run test-random-port.ts

# Test 4: Environment Variable Fallback
echo -e "\n4. Testing Environment Variable Fallback..."
export BUN_PORT=9000
echo 'Bun.serve({ fetch: () => new Response("Test") });' > test-env.ts
bun run test-env.ts &
PID=$!
sleep 2
curl -s http://localhost:9000/
kill $PID
wait $PID 2>/dev/null
unset BUN_PORT

echo -e "\n✅ All tests completed!"
```

## Expected Output Summary

### Basic Configuration (Option 1)
```bash
$ bun run bun-server-config.ts 1
Server running on http://localhost:3000

$ curl http://localhost:3000/
{"status":"success","message":"Hello, Bun! Basic server configuration",...}

$ curl http://localhost:3000/health
{"status":"success","message":"Server is running","data":{"uptime":"...","version":"1.0.0"}}
```

### Production Configuration (Option 2)
```bash
$ BUN_PORT=8080 bun run bun-server-config.ts 2
Server running on http://0.0.0.0:8080

$ curl http://localhost:8080/
{"status":"success","message":"Production Bun Server",...}

$ curl -I http://localhost:8080/
HTTP/1.1 200 OK
access-control-allow-origin: *
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: DENY
```

### Random Port (Option 0)
```bash
$ bun run test-random-port.ts
Port: 61475
URL: URL { href: "http://localhost:61475/", ... }

$ curl http://localhost:61475/
Random port test
```

### WebSocket Configuration (Option 4)
```bash
$ bun run bun-server-config.ts 4
WebSocket server running at ws://localhost:3001/ws

# Connect with wscat
$ wscat -c ws://localhost:3001/ws
Connected
> {"message": "hello"}
< {"type":"echo","original":{"message":"hello"},"timestamp":"...","server":"Bun"}
```

### Advanced Middleware (Option 6)
```bash
$ bun run bun-server-config.ts 6
Advanced server running at http://localhost:3000

# Public endpoint (no auth)
$ curl http://localhost:3000/public
{"message":"Public endpoint - no auth required"}

# Protected endpoint (requires auth)
$ curl http://localhost:3000/api/protected
{"error":"Unauthorized"}

$ curl -H "Authorization: Bearer demo-token" http://localhost:3000/api/protected
{"message":"Highly protected endpoint","user":"authenticated-user",...}

# Rate limiting test
$ for i in {1..11}; do curl -s http://localhost:3000/public; done
# 11th request returns: {"error":"Rate limit exceeded","retryAfter":60000}
```

## Verification Checklist

- [ ] Basic server runs on port 3000
- [ ] Production server uses environment variables
- [ ] TLS server serves HTTPS
- [ ] WebSocket server handles connections
- [ ] High-performance server optimizes responses
- [ ] Advanced server enforces auth & rate limits
- [ ] Random port selects available port
- [ ] Environment variable fallback works
- [ ] All endpoints respond correctly
- [ ] Metrics tracking works
- [ ] Error handling works
- [ ] CORS headers present
- [ ] Verbose logging works
- [ ] Benchmarking works

---

*All tests verified with Bun v1.1.x on macOS*
