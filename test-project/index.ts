#!/usr/bin/env bun

/**
 * Enhanced Bun API Server Template
 *
 * A production-ready REST API server template that demonstrates:
 * - ✅ Comprehensive debugging with verbose fetch logging
 * - ✅ Real-time performance metrics and monitoring
 * - ✅ Advanced benchmarking capabilities
 * - ✅ Professional error handling and structured responses
 * - ✅ Integration with external REST APIs
 *
 * Usage: bun run index.ts
 * Docs: https://bun.com/docs/runtime/templating/create#from-a-local-template
 */

interface ServerConfig {
  port: number;
  hostname: string;
}

interface ApiResponse {
  status: string;
  message: string;
  timestamp: string;
  data?: unknown;
  error?: string;
}

interface EndpointMetrics {
  requests: number;
  errors: number;
  avgResponseTime: number;
  totalResponseTime: number;
  lastAccess: Date | null;
}

interface MetricsData {
  totalRequests: number;
  totalErrors: number;
  uptime: string;
  endpoints: Record<string, EndpointMetrics>;
}

import { dns, fetch } from "bun";

class ApiServer {
  private config: ServerConfig;
  private startTime: Date;
  private metrics: MetricsData;

  constructor(config: ServerConfig = { port: 3000, hostname: "example.com" }) {
    // DNS prefetch for performance optimization
    dns.prefetch("example.com");
    // Preconnect to host for faster connection setup
    fetch.preconnect("http://example.com:3000");
    // Log DNS cache stats
    console.log(`[DNS] Cache stats:`, dns.getCacheStats());
    this.config = config;
    this.startTime = new Date();
    this.metrics = {
      totalRequests: 0,
      totalErrors: 0,
      uptime: "0ms",
      endpoints: {},
    };
  }

  /**
   * Update metrics for a specific endpoint
   */
  private updateMetrics(endpoint: string, responseTime: number, isError: boolean = false): void {
    if (!this.metrics.endpoints[endpoint]) {
      this.metrics.endpoints[endpoint] = {
        requests: 0,
        errors: 0,
        avgResponseTime: 0,
        totalResponseTime: 0,
        lastAccess: null,
      };
    }

    const endpointMetric = this.metrics.endpoints[endpoint];
    endpointMetric.requests++;
    endpointMetric.totalResponseTime += responseTime;
    endpointMetric.avgResponseTime = endpointMetric.totalResponseTime / endpointMetric.requests;
    endpointMetric.lastAccess = new Date();

    if (isError) {
      endpointMetric.errors++;
      this.metrics.totalErrors++;
    }

    this.metrics.totalRequests++;
    this.metrics.uptime = `${Date.now() - this.startTime.getTime()}ms`;
  }

  /**
   * Health check endpoint
   */
  private handleHealthCheck(): Response {
    const response: ApiResponse = {
      status: "success",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      data: {
        uptime: `${Date.now() - this.startTime.getTime()}ms`,
        version: "1.0.0",
      },
    };
    return Response.json(response);
  }

  /**
   * Root endpoint
   */
  private handleRoot(): Response {
    const response: ApiResponse = {
      status: "success",
      message: "Welcome to your enhanced Bun project",
      timestamp: new Date().toISOString(),
      data: {
        endpoints: ["/", "/health", "/info"],
        server: "Bun HTTP Server",
      },
    };
    return Response.json(response);
  }

  /**
   * Info endpoint with comprehensive debug information
   * Provides runtime details, system information, and server configuration
   */
  private handleInfo(): Response {
    const uptime = Date.now() - this.startTime.getTime();

    // Get memory usage using process.memoryUsage() (Node.js compatible)
    const memoryUsage = process.memoryUsage();

    // Get system information
    const systemInfo = {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      pid: process.pid,
      cwd: process.cwd(),
    };

    const response: ApiResponse = {
      status: "success",
      message: "Server information",
      timestamp: new Date().toISOString(),
      data: {
        // Runtime Information
        runtime: "Bun",
        bunVersion: Bun.version,
        bunRevision: Bun.revision,

        // Server Configuration
        server: {
          port: this.config.port,
          hostname: this.config.hostname,
          started: this.startTime.toISOString(),
          uptime: `${uptime}ms`,
        },

        // System Information
        system: systemInfo,

        // Memory Usage (in bytes)
        memory: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          arrayBuffers: memoryUsage.arrayBuffers,
        },

        // Environment Information
        environment: {
          nodeVersion: process.version,
          env: Object.fromEntries(Object.entries(process.env).filter(([key]) =>
            key.startsWith('NODE_') || key.startsWith('BUN_') || key === 'HOME' || key === 'PATH'
          )),
        },

        // Feature Detection
        features: {
          isBun: typeof Bun !== 'undefined',
          isMain: import.meta.main,
          hasJSX: true, // Bun supports JSX natively
        },
      },
    };
    return Response.json(response);
  }

  /**
   * 404 Not Found handler
   */
  private handleNotFound(): Response {
    const response: ApiResponse = {
      status: "error",
      message: "Endpoint not found",
      timestamp: new Date().toISOString(),
    };
    return Response.json(response, { status: 404 });
  }

  /**
   * Metrics endpoint - provides per-endpoint performance metrics
   */
  private handleMetrics(): Response {
    const response: ApiResponse = {
      status: "success",
      message: "Server metrics",
      timestamp: new Date().toISOString(),
      data: {
        // Overall server metrics
        server: {
          totalRequests: this.metrics.totalRequests,
          totalErrors: this.metrics.totalErrors,
          uptime: this.metrics.uptime,
          startTime: this.startTime.toISOString(),
          errorRate: this.metrics.totalRequests > 0
            ? (this.metrics.totalErrors / this.metrics.totalRequests * 100).toFixed(2) + '%'
            : '0%',
        },
        // Per-endpoint metrics
        endpoints: this.metrics.endpoints,
      },
    };
    return Response.json(response);
  }

  /**
   * Main request handler with routing and metrics tracking
   */
  private async fetchHandler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const startTime = Date.now();
    let response: Response;
    let isError = false;

    // Route handling with metrics
    try {
      switch (url.pathname) {
        case "/":
          response = this.handleRoot();
          break;

        case "/health":
          response = this.handleHealthCheck();
          break;

        case "/info":
          response = this.handleInfo();
          break;

        case "/metrics":
          response = this.handleMetrics();
          break;

        case "/external":
          response = await this.handleExternalApi();
          break;

        case "/verbose":
          response = this.handleVerboseToggle(req);
          break;

        case "/bench":
          response = await this.handleBenchmark(req);
          break;

        case "/test":
          response = this.handleTest();
          break;

        default:
          response = this.handleNotFound();
          isError = true;
          break;
      }
    } catch (error) {
      response = Response.json({
        status: "error",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }, { status: 500 });
      isError = true;
    }

    // Calculate response time and update metrics
    const responseTime = Date.now() - startTime;
    this.updateMetrics(url.pathname, responseTime, isError);

    return response;
  }

  /**
   * External API demo endpoint with verbose fetch logging
   * Demonstrates real-world REST API integration patterns
   */
  private async handleExternalApi(): Promise<Response> {
    try {
      // Enable verbose fetch logging for this request (clean output without curl)
      process.env.BUN_CONFIG_VERBOSE_FETCH = "true";

      console.log('\n[API] Starting multi-endpoint REST API demonstration...');

      // Example 1: Get a post from JSONPlaceholder
      console.log('[API] 1. Fetching post from JSONPlaceholder...');
      const postResponse = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Bun-Enhanced-API-Server/1.0.0",
        },
      });
      const post = await postResponse.json();

      // Example 2: Get user information
      console.log('[API] 2. Fetching user information...');
      const userResponse = await fetch("https://jsonplaceholder.typicode.com/users/1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Bun-Enhanced-API-Server/1.0.0",
        },
      });
      const user = await userResponse.json();

      // Example 3: Get comments for the post
      console.log('[API] 3. Fetching post comments...');
      const commentsResponse = await fetch("https://jsonplaceholder.typicode.com/comments?postId=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Bun-Enhanced-API-Server/1.0.0",
        },
      });
      const comments = await commentsResponse.json();

      console.log('[API] ✅ All external API calls completed successfully');

      const apiResponse: ApiResponse = {
        status: "success",
        message: "Real-world REST API integration demonstration completed",
        timestamp: new Date().toISOString(),
        data: {
          post: {
            id: post.id,
            title: post.title,
            body: post.body.substring(0, 100) + "...",
          },
          author: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          comments: {
            count: comments.length,
            sample: comments.slice(0, 2).map((c: any) => ({
              name: c.name,
              email: c.email,
              body: c.body.substring(0, 50) + "...",
            })),
          },
          verboseLogging: "Enabled via BUN_CONFIG_VERBOSE_FETCH",
          note: "Check server console for detailed fetch logs",
          apiSource: "JSONPlaceholder (https://jsonplaceholder.typicode.com)",
        },
      };
      return Response.json(apiResponse);
    } catch (error) {
      console.error('[API] ❌ External API call failed:', error);

      const errorResponse: ApiResponse = {
        status: "error",
        message: "External API integration failed",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        data: {
          troubleshooting: [
            "Check network connectivity",
            "Verify API endpoint availability",
            "Review rate limits if applicable",
            "Check CORS policies for external APIs",
          ],
        },
      };
      return Response.json(errorResponse, { status: 500 });
    } finally {
      // Clean up verbose logging
      delete process.env.BUN_CONFIG_VERBOSE_FETCH;
    }
  }

  /**
   * Debug endpoint to toggle verbose fetch logging
   */
  private handleVerboseToggle(req: Request): Response {
    const url = new URL(req.url);
    const enable = url.searchParams.get('enable') === 'true';

    if (enable) {
      process.env.BUN_CONFIG_VERBOSE_FETCH = "true";
      return Response.json({
        status: "success",
        message: "Verbose fetch logging enabled",
        timestamp: new Date().toISOString(),
        data: { verbose: true },
      });
    } else {
      delete process.env.BUN_CONFIG_VERBOSE_FETCH;
      return Response.json({
        status: "success",
        message: "Verbose fetch logging disabled",
        timestamp: new Date().toISOString(),
        data: { verbose: false },
      });
    }
  }

  /**
   * Benchmark endpoint - performance testing with detailed metrics
   */
  private async handleBenchmark(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const iterations = parseInt(url.searchParams.get('iterations') || '100');
    const target = url.searchParams.get('target') || 'health'; // health, info, metrics, or external

    console.log(`\n[BENCH] Starting benchmark: ${iterations} iterations against /${target}`);

    const benchmarkResults = {
      target: `/${target}`,
      iterations: iterations,
      startTime: Date.now(),
      results: [] as Array<{ iteration: number; responseTime: number; status: number }>,
      summary: {} as any,
    };

    // Run benchmark
    for (let i = 0; i < iterations; i++) {
      const iterationStart = Date.now();

      try {
        let response: Response;

        // Simulate the target endpoint
        switch (target) {
          case 'health':
            response = this.handleHealthCheck();
            break;
          case 'info':
            response = this.handleInfo();
            break;
          case 'metrics':
            response = this.handleMetrics();
            break;
          case 'external':
            // Simulate external API call without actual network request
            response = Response.json({
              status: "success",
              message: "Simulated external API response",
              timestamp: new Date().toISOString(),
              data: { simulated: true, iteration: i },
            });
            break;
          default:
            response = this.handleNotFound();
            break;
        }

        const responseTime = Date.now() - iterationStart;
        benchmarkResults.results.push({
          iteration: i + 1,
          responseTime: responseTime,
          status: response.status,
        });

        // Progress indicator every 10 iterations
        if ((i + 1) % 10 === 0 || i === iterations - 1) {
          console.log(`[BENCH] Progress: ${i + 1}/${iterations} iterations completed`);
        }

      } catch (error) {
        console.error(`[BENCH] Error in iteration ${i + 1}:`, error);
        benchmarkResults.results.push({
          iteration: i + 1,
          responseTime: 0,
          status: 500,
        });
      }
    }

    // Calculate statistics
    const responseTimes = benchmarkResults.results.map(r => r.responseTime);
    const successfulRequests = benchmarkResults.results.filter(r => r.status < 400).length;
    const totalTime = Date.now() - benchmarkResults.startTime;

    benchmarkResults.summary = {
      totalTime: totalTime,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      requestsPerSecond: (iterations / (totalTime / 1000)).toFixed(2),
      successRate: ((successfulRequests / iterations) * 100).toFixed(2) + '%',
      failedRequests: iterations - successfulRequests,
    };

    console.log(`[BENCH] Completed: ${iterations} iterations in ${totalTime}ms`);
    console.log(`[BENCH] Average: ${benchmarkResults.summary.averageResponseTime.toFixed(2)}ms`);
    console.log(`[BENCH] RPS: ${benchmarkResults.summary.requestsPerSecond}`);

    const apiResponse: ApiResponse = {
      status: "success",
      message: `Benchmark completed: ${iterations} iterations against /${target}`,
      timestamp: new Date().toISOString(),
      data: benchmarkResults,
    };

    return Response.json(apiResponse);
  }

  /**
   * Test endpoint - basic test endpoint
   */
  private handleTest(): Response {
    const response: ApiResponse = {
      status: "success",
      message: "Test endpoint is working",
      timestamp: new Date().toISOString(),
      data: {
        hostname: this.config.hostname,
        port: this.config.port,
        message: "Server is configured correctly",
      },
    };
    return Response.json(response);
  }

  /**
   * Start the server
   */
  public start(): void {
    // Bind to 0.0.0.0 (all interfaces) to support both example.com and localhost
    const server = Bun.serve({
      port: this.config.port,
      hostname: "0.0.0.0",
      fetch: (req) => this.fetchHandler(req),
    });

    console.log(`Server started successfully`);
    console.log(`http://example.com:${this.config.port}`);
    console.log(`http://localhost:${this.config.port}`);
    console.log(`Available endpoints:`);
    console.log(`   - / (root)`);
    console.log(`   - /health (health check)`);
    console.log(`   - /info (server info)`);
    console.log(`   - /metrics (performance metrics)`);
    console.log(`   - /external (external API demo with verbose logging)`);
    console.log(`   - /verbose?enable=true (toggle verbose fetch logging)`);
    console.log(`   - /bench?iterations=100&target=health (performance benchmark)`);
    console.log(`   - /test (test endpoint)`);
    console.log(`\nDebugging: Set BUN_CONFIG_VERBOSE_FETCH=true for clean logs, or "curl" for full curl format`);
    console.log(`Press Ctrl+C to stop the server`);
  }
}

// Main execution
if (import.meta.main) {
  // Connection pooling & simultaneous connection limit
  const maxHttpRequests = process.env.BUN_CONFIG_MAX_HTTP_REQUESTS || "256";
  console.log(`[HTTP] Max simultaneous connections: ${maxHttpRequests}`);

  const port = parseInt(process.env.PORT || process.env.BUN_PORT || process.env.NODE_PORT || "3000", 10);
  const server = new ApiServer({
    port,
    hostname: "example.com",
  });

  server.start();
}

export { ApiServer };
export type { ServerConfig, ApiResponse };
