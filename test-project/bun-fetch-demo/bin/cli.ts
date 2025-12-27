#!/usr/bin/env bun
/**
 * Bun Fetch API Demo CLI - Onboarding Edition
 *
 * This CLI is designed specifically for onboarding new engineers to Bun's Fetch API.
 * It provides interactive demonstrations of all major features with detailed explanations
 * and practical examples that mirror real-world usage.
 */

import { dns, write } from "bun";
import { statSync, readFileSync, unlinkSync, writeFileSync } from "fs";

// ============================================================================
// TERMINAL COLORS & FORMATTING
// ============================================================================

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printBanner() {
  console.log(`
${colors.fgCyan}${colors.bright}
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                   Bun Fetch API - Onboarding CLI                           ║
║                                                                            ║
║  Welcome to Bun! This interactive tool will help you master the Fetch API  ║
║  through hands-on examples. Each feature demonstrates real-world usage      ║
║  patterns you'll use in production applications.                           ║
║                                                                            ║
║  📚 Features: 15 interactive demos                                         ║
║  🚀 Level: Beginner to Advanced                                            ║
║  ⏱️  Time: ~15 minutes                                                     ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
${colors.reset}
`);
}

function printMainMenu() {
  console.log(`
${colors.fgYellow}${colors.bright}🎯 ONBOARDING PATH (Recommended Order):${colors.reset}

${colors.fgGreen}1.${colors.reset}  ${colors.bright}Response Methods${colors.reset}          - Learn to handle API responses
${colors.fgGreen}2.${colors.reset}  ${colors.bright}POST Requests${colors.reset}            - Send data to APIs
${colors.fgGreen}3.${colors.reset}  ${colors.bright}Custom Headers${colors.reset}           - Authentication & metadata
${colors.fgGreen}4.${colors.reset}  ${colors.bright}Error Handling${colors.reset}           - Timeouts & cancellation
${colors.fgGreen}5.${colors.reset}  ${colors.bright}File Operations${colors.reset}          - Download & save files
${colors.fgGreen}6.${colors.reset}  ${colors.bright}Streaming${colors.reset}               - Handle large responses
${colors.fgGreen}7.${colors.reset}  ${colors.bright}Performance${colors.reset}             - DNS & connection optimization
${colors.fgGreen}8.${colors.reset}  ${colors.bright}Advanced Options${colors.reset}        - TLS, proxies, debugging
${colors.fgGreen}9.${colors.reset}  ${colors.bright}Special Protocols${colors.reset}       - file://, data:, blob:, s3://
${colors.fgGreen}10.${colors.reset} ${colors.bright}Complete Demo${colors.reset}           - Run all features end-to-end

${colors.fgCyan}${colors.bright}📚 RESOURCES:${colors.reset}
${colors.fgGreen}11.${colors.reset} ${colors.bright}Documentation${colors.reset}           - Show feature reference table
${colors.fgGreen}12.${colors.reset} ${colors.bright}Quick Start Guide${colors.reset}       - Essential patterns
${colors.fgGreen}13.${colors.reset} ${colors.bright}Best Practices${colors.reset}          - Production-ready tips

${colors.fgMagenta}${colors.bright}🔧 TOOLS:${colors.reset}
${colors.fgGreen}14.${colors.reset} ${colors.bright}Generate Test Files${colors.reset}     - Create sample data
${colors.fgGreen}15.${colors.reset} ${colors.bright}Performance Test${colors.reset}        - Benchmark comparisons

${colors.fgRed}0.${colors.reset}  ${colors.bright}Exit${colors.reset}                         - Leave the CLI

${colors.dim}💡 Tip: Use "bun-fetch-demo <number>" to run any feature directly${colors.reset}
${colors.dim}💡 Tip: Use "bun-fetch-demo all" to run everything${colors.reset}
`);
}

function printSectionHeader(title: string, description: string = "") {
  console.log(`\n${colors.fgMagenta}${colors.bright}${"═".repeat(70)}${colors.reset}`);
  console.log(`${colors.fgMagenta}${colors.bright}║ ${title}${colors.reset}`);
  if (description) {
    console.log(`${colors.fgMagenta}║ ${colors.dim}${description}${colors.reset}`);
  }
  console.log(`${colors.fgMagenta}${colors.bright}${"═".repeat(70)}${colors.reset}\n`);
}

function printStep(step: number, title: string) {
  console.log(`${colors.fgCyan}${colors.bright}Step ${step}: ${title}${colors.reset}`);
}

function printCode(code: string) {
  console.log(`${colors.fgYellow}${code}${colors.reset}`);
}

function printResult(result: string) {
  console.log(`${colors.fgGreen}✓ ${result}${colors.reset}`);
}

function printWarning(warning: string) {
  console.log(`${colors.fgYellow}⚠️  ${warning}${colors.reset}`);
}

function printError(error: string) {
  console.log(`${colors.fgRed}✗ ${error}${colors.reset}`);
}

function printInfo(info: string) {
  console.log(`${colors.dim}${info}${colors.reset}`);
}

// ============================================================================
// FEATURE IMPLEMENTATIONS
// ============================================================================

// FEATURE 1: Response Methods
async function demoResponseMethods() {
  printSectionHeader(
    "FEATURE 1: Response Body Methods",
    "Learn how to consume API responses in different formats"
  );

  printStep(1, "Fetch a JSON API");
  printCode('const response = await fetch("https://jsonplaceholder.typicode.com/posts/1")');

  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  console.log(`${colors.fgCyan}Status: ${response.status} ${response.statusText}${colors.reset}`);

  printStep(2, "Convert to JSON");
  printCode('const data = await response.json()');
  const data = await response.json();
  console.log(`${colors.fgYellow}Result:${colors.reset}`);
  console.log(JSON.stringify(data, null, 2));

  printStep(3, "Convert to Text");
  printCode('const text = await response.clone().text()');
  const text = await response.clone().text();
  console.log(`${colors.fgYellow}First 100 chars:${colors.reset} ${text.substring(0, 100)}...`);

  printStep(4, "Bun's Fastest Method - bytes()");
  printCode('const bytes = await response.clone().bytes()');
  const bytes = await (response.clone() as any).bytes();
  console.log(`${colors.fgYellow}Type: ${bytes.constructor.name}, Length: ${bytes.length} bytes${colors.reset}`);

  printStep(5, "ArrayBuffer for Binary Data");
  printCode('const buffer = await response.clone().arrayBuffer()');
  const buffer = await response.clone().arrayBuffer();
  console.log(`${colors.fgYellow}ArrayBuffer size: ${buffer.byteLength} bytes${colors.reset}`);

  printResult("All response methods demonstrated successfully!");
  printInfo("💡 When to use: json() for APIs, text() for HTML/strings, bytes() for binary data");
}

// FEATURE 2: POST Requests
async function demoPostRequests() {
  printSectionHeader(
    "FEATURE 2: POST Requests with Different Body Types",
    "Send data to APIs using various content types"
  );

  printStep(1, "POST with JSON Body");
  printCode(`fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Hello", body: "World", userId: 1 })
})`);

  const jsonResponse = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hello Bun", body: "Modern JavaScript Runtime", userId: 1 })
  });
  const jsonData = await jsonResponse.json();
  console.log(`${colors.fgYellow}Server Response:${colors.reset}`);
  console.log(JSON.stringify(jsonData, null, 2));

  printStep(2, "POST with FormData");
  printCode(`const formData = new FormData();
formData.append("username", "newengineer");
formData.append("role", "developer");
fetch("https://httpbin.org/post", { method: "POST", body: formData })`);

  const formData = new FormData();
  formData.append("username", "newengineer");
  formData.append("role", "developer");
  formData.append("file", new Blob(["sample content"], { type: "text/plain" }), "sample.txt");

  const formResponse = await fetch("https://httpbin.org/post", {
    method: "POST",
    body: formData
  });
  const formDataResult = await formResponse.json();
  console.log(`${colors.fgYellow}Form Data Received:${colors.reset}`);
  console.log(`  Files: ${Object.keys(formDataResult.files).join(", ")}`);
  console.log(`  Form: ${JSON.stringify(formDataResult.form)}`);

  printStep(3, "POST with Plain Text");
  printCode(`fetch("https://httpbin.org/post", {
  method: "POST",
  body: "Plain text content"
})`);

  const textResponse = await fetch("https://httpbin.org/post", {
    method: "POST",
    body: "Hello from Bun Fetch CLI!"
  });
  const textData = await textResponse.json();
  console.log(`${colors.fgYellow}Text echoed back:${colors.reset} "${textData.data}"`);

  printResult("All POST methods work perfectly!");
  printInfo("💡 When to use: JSON for APIs, FormData for file uploads, text for simple data");
}

// FEATURE 3: Custom Headers & Authentication
async function demoCustomHeaders() {
  printSectionHeader(
    "FEATURE 3: Custom Headers & Authentication",
    "Add metadata and authentication to your requests"
  );

  printStep(1, "Basic Custom Headers");
  printCode(`fetch("https://httpbin.org/headers", {
  headers: {
    "X-API-Key": "your-api-key",
    "X-Request-ID": "req-12345",
    "User-Agent": "MyApp/1.0"
  }
})`);

  const response1 = await fetch("https://httpbin.org/headers", {
    headers: {
      "X-API-Key": "demo-key-12345",
      "X-Request-ID": "req-67890",
      "User-Agent": "Bun-Onboarding-CLI/1.0",
      "X-Custom-Header": "learning-bun"
    }
  });
  const headers1 = await response1.json();
  console.log(`${colors.fgYellow}Headers received by server:${colors.reset}`);
  Object.entries(headers1.headers).forEach(([key, value]) => {
    console.log(`  ${colors.fgCyan}${key}:${colors.reset} ${value}`);
  });

  printStep(2, "Bearer Token Authentication");
  printCode(`fetch("https://httpbin.org/bearer", {
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
})`);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const response2 = await fetch("https://httpbin.org/bearer", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const bearerData = await response2.json();
  console.log(`${colors.fgYellow}Authenticated:${colors.reset} ${bearerData.authenticated}`);
  console.log(`${colors.fgYellow}Token preview:${colors.reset} ${token.substring(0, 50)}...`);

  printStep(3, "Multiple Headers with Headers Object");
  printCode(`const headers = new Headers();
headers.append("Accept", "application/json");
headers.append("Accept-Language", "en-US");
fetch("https://httpbin.org/headers", { headers })`);

  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Accept-Language", "en-US");
  headers.append("Accept-Encoding", "gzip, deflate");

  const response3 = await fetch("https://httpbin.org/headers", { headers });
  const headers3 = await response3.json();
  console.log(`${colors.fgYellow}Accept headers:${colors.reset} ${headers3.headers.accept}`);

  printResult("Authentication and headers working correctly!");
  printInfo("💡 Best Practice: Always set User-Agent and use environment variables for secrets");
}

// FEATURE 4: Error Handling & Timeouts
async function demoErrorHandling() {
  printSectionHeader(
    "FEATURE 4: Error Handling & Request Cancellation",
    "Handle network errors, timeouts, and user cancellations"
  );

  printStep(1, "Request Timeout with AbortSignal");
  printCode(`fetch("https://httpbin.org/delay/5", {
  signal: AbortSignal.timeout(2000)
})`);

  try {
    printInfo("Attempting to fetch with 2-second timeout from 5-second delay endpoint...");
    await fetch("https://httpbin.org/delay/5", {
      signal: AbortSignal.timeout(2000)
    });
    printError("This should not happen!");
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      printResult("Request timed out as expected (AbortError)");
    } else {
      printError(`Unexpected error: ${(error as Error).message}`);
    }
  }

  printStep(2, "Manual AbortController");
  printCode(`const controller = new AbortController();
setTimeout(() => controller.abort(), 1000);
fetch("https://httpbin.org/delay/10", { signal: controller.signal })`);

  const controller = new AbortController();
  setTimeout(() => {
    printWarning("Cancelling request after 1 second...");
    controller.abort();
  }, 1000);

  try {
    await fetch("https://httpbin.org/delay/10", { signal: controller.signal });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      printResult("Request manually cancelled successfully");
    }
  }

  printStep(3, "Handling HTTP Errors");
  printCode(`const response = await fetch("https://httpbin.org/status/404");
if (!response.ok) {
  throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
}`);

  const errorResponse = await fetch("https://httpbin.org/status/404");
  if (!errorResponse.ok) {
    printWarning(`Caught HTTP ${errorResponse.status}: ${errorResponse.statusText}`);
  }

  printStep(4, "Network Error Handling");
  printCode(`try {
  await fetch("https://invalid-domain-that-does-not-exist.com");
} catch (error) {
  console.log("Network error:", error.message);
}`);

  try {
    await fetch("https://invalid-domain-that-does-not-exist-12345.com");
  } catch (error) {
    printError(`Network error caught: ${(error as any).code || (error as Error).message}`);
  }

  printResult("Error handling patterns mastered!");
  printInfo("💡 Always use try/catch with fetch and handle AbortError separately");
}

// FEATURE 5: File Operations
async function demoFileOperations() {
  printSectionHeader(
    "FEATURE 5: File Operations with Bun.write()",
    "Download and save files efficiently"
  );

  printStep(1, "Download and Save with Bun.write()");
  printCode(`const response = await fetch("https://httpbin.org/json");
await write("/tmp/demo-file.json", response);`);

  const jsonResponse = await fetch("https://httpbin.org/json");
  const tempFile = "/tmp/bun-demo-response.json";
  await write(tempFile, jsonResponse);

  const savedContent = readFileSync(tempFile, "utf-8");
  console.log(`${colors.fgYellow}Saved file content:${colors.reset}`);
  console.log(JSON.stringify(JSON.parse(savedContent), null, 2));
  console.log(`${colors.fgCyan}File size: ${savedContent.length} bytes${colors.reset}`);

  printStep(2, "Download Binary File");
  printCode(`const binaryResponse = await fetch("https://httpbin.org/bytes/1024");
await write("/tmp/demo-binary.dat", binaryResponse);`);

  const binaryResponse = await fetch("https://httpbin.org/bytes/1024");
  const binaryFile = "/tmp/bun-demo-binary.dat";
  await write(binaryFile, binaryResponse);

  const binaryStats = statSync(binaryFile);
  console.log(`${colors.fgCyan}Binary file saved: ${binaryStats.size} bytes${colors.reset}`);

  printStep(3, "Save Large File with Progress");
  printCode(`const response = await fetch("https://httpbin.org/stream/100");
await write("/tmp/large-file.json", response);`);

  const streamResponse = await fetch("https://httpbin.org/stream/50");
  const streamFile = "/tmp/bun-demo-stream.json";
  await write(streamFile, streamResponse);

  const streamStats = statSync(streamFile);
  console.log(`${colors.fgCyan}Streamed file saved: ${streamStats.size} bytes${colors.reset}`);

  // Cleanup
  unlinkSync(tempFile);
  unlinkSync(binaryFile);
  unlinkSync(streamFile);

  printResult("File operations completed successfully!");
  printInfo("💡 Bun.write() is zero-copy when possible - extremely fast for large files");
}

// FEATURE 6: Streaming
async function demoStreaming() {
  printSectionHeader(
    "FEATURE 6: Streaming Responses",
    "Handle large responses efficiently without loading everything into memory"
  );

  printStep(1, "Stream JSON Lines");
  printCode(`const response = await fetch("https://httpbin.org/stream/10");
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Process chunk
}`);

  const response = await fetch("https://httpbin.org/stream/10");
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  let chunkCount = 0;
  let totalBytes = 0;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunkCount++;
      totalBytes += value.length;

      if (chunkCount <= 3) {
        const text = decoder.decode(value, { stream: true });
        console.log(`${colors.fgYellow}Chunk ${chunkCount}:${colors.reset} ${text.trim().substring(0, 80)}...`);
      }
    }
  }

  console.log(`${colors.fgCyan}Total chunks: ${chunkCount}, Total bytes: ${totalBytes}${colors.reset}`);

  printStep(2, "Stream with Reader");
  printCode(`const response = await fetch("https://httpbin.org/stream/5");
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Process each chunk
}`);

  const streamResponse = await fetch("https://httpbin.org/stream/5");
  let iterCount = 0;

  if (streamResponse.body) {
    const reader = streamResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      iterCount++;
      if (iterCount <= 2) {
        const text = new TextDecoder().decode(value);
        console.log(`${colors.fgYellow}Iteration ${iterCount}:${colors.reset} ${text.trim().substring(0, 80)}...`);
      }
    }
  }

  console.log(`${colors.fgCyan}Processed ${iterCount} chunks via reader${colors.reset}`);

  printResult("Streaming demonstrated successfully!");
  printInfo("💡 Use streaming for large responses to avoid memory issues");
}

// FEATURE 7: Performance Optimization
async function demoPerformance() {
  printSectionHeader(
    "FEATURE 7: Performance Optimization",
    "DNS prefetching, preconnect, and connection pooling"
  );

  printStep(1, "DNS Prefetching");
  printCode(`dns.prefetch("api.example.com");
// Later: fetch("https://api.example.com") will be faster`);

  const domain = "jsonplaceholder.typicode.com";
  console.log(`${colors.fgCyan}Before prefetch:${colors.reset}`);
  let stats = dns.getCacheStats();
  console.log(`  Cache hits: ${stats.cacheHitsCompleted}, misses: ${stats.cacheMisses}`);

  console.log(`${colors.fgYellow}Prefetching ${domain}...${colors.reset}`);
  dns.prefetch(domain);

  // Make actual request to populate cache
  await fetch(`https://${domain}/posts/1`);

  console.log(`${colors.fgCyan}After prefetch and request:${colors.reset}`);
  stats = dns.getCacheStats();
  console.log(`  Cache hits: ${stats.cacheHitsCompleted}, misses: ${stats.cacheMisses}`);
  console.log(`  Cache size: ${stats.size}, Total requests: ${stats.totalCount}`);

  printStep(2, "Connection Preconnect");
  printCode(`(fetch as any).preconnect("https://api.example.com");
// Prepares DNS, TCP, and TLS in advance`);

  try {
    (fetch as any).preconnect("https://jsonplaceholder.typicode.com");
    printResult("Preconnect initiated for jsonplaceholder.typicode.com");
    printInfo("This prepares DNS + TCP + TLS handshake ahead of time");
  } catch (e) {
    printWarning("Preconnect API not available in this Bun version");
  }

  printStep(3, "Connection Pooling (Keep-Alive)");
  printCode(`// Default behavior - connections are reused
await fetch("https://api.example.com/data");
await fetch("https://api.example.com/users");
// Second request reuses connection`);

  console.log(`${colors.fgCyan}Making 3 requests to same host...${colors.reset}`);
  const start = Date.now();
  await fetch("https://jsonplaceholder.typicode.com/posts/1");
  await fetch("https://jsonplaceholder.typicode.com/users/1");
  await fetch("https://jsonplaceholder.typicode.com/comments/1");
  const pooledTime = Date.now() - start;

  console.log(`${colors.fgGreen}Pooled requests: ${pooledTime}ms${colors.reset}`);

  console.log(`${colors.fgCyan}Without keep-alive (3 separate connections)...${colors.reset}`);
  const start2 = Date.now();
  await fetch("https://jsonplaceholder.typicode.com/posts/2", { keepalive: false });
  await fetch("https://jsonplaceholder.typicode.com/users/2", { keepalive: false });
  await fetch("https://jsonplaceholder.typicode.com/comments/2", { keepalive: false });
  const separateTime = Date.now() - start2;

  console.log(`${colors.fgYellow}Separate connections: ${separateTime}ms${colors.reset}`);
  console.log(`${colors.fgCyan}Difference: ${separateTime - pooledTime}ms (pooled is faster!)${colors.reset}`);

  printResult("Performance optimization techniques demonstrated!");
  printInfo("💡 Use DNS prefetch for known domains, keep-alive for multiple requests");
}

// FEATURE 8: Advanced Options
async function demoAdvancedOptions() {
  printSectionHeader(
    "FEATURE 8: Advanced Options",
    "TLS configuration, proxies, and debugging"
  );

  printStep(1, "TLS/SSL Configuration");
  printCode(`fetch("https://secure-api.com", {
  tls: {
    rejectUnauthorized: false, // For self-signed certs (dev only!)
  }
})`);

  console.log(`${colors.fgYellow}TLS Options available:${colors.reset}`);
  console.log(`  ${colors.fgCyan}rejectUnauthorized:${colors.reset} false (disable cert validation)`);
  console.log(`  ${colors.fgCyan}checkServerIdentity:${colors.reset} custom validation function`);
  console.log(`  ${colors.fgCyan}key/cert/ca:${colors.reset} Client certificates`);
  printInfo("⚠️  Only use rejectUnauthorized: false in development!");

  printStep(2, "Proxy Configuration");
  printCode(`fetch("https://api.example.com", {
  proxy: "http://proxy.company.com:8080"
})`);

  console.log(`${colors.fgYellow}Proxy syntax:${colors.reset}`);
  console.log(`  ${colors.fgCyan}Simple:${colors.reset} proxy: "http://proxy:8080"`);
  console.log(`  ${colors.fgCyan}With auth:${colors.reset} proxy: "http://user:pass@proxy:8080"`);
  console.log(`  ${colors.fgCyan}Advanced:${colors.reset} proxy: { url: "http://proxy:8080", headers: {...} }`);

  printStep(3, "Verbose Debug Logging");
  printCode(`fetch("https://httpbin.org/get", { verbose: true })`);

  console.log(`${colors.fgYellow}Making request with verbose: true...${colors.reset}\n`);
  await fetch("https://httpbin.org/get", { verbose: true } as any);

  console.log(`\n${colors.fgYellow}Also try verbose: "curl" for cURL-style output${colors.reset}`);
  console.log(`${colors.dim}Note: Verbose logging shows request/response headers${colors.reset}`);

  printStep(4, "Decompression Control");
  printCode(`fetch("https://api.example.com", { decompress: false })`);

  console.log(`${colors.fgCyan}Automatic decompression is enabled by default${colors.reset}`);
  console.log(`${colors.fgYellow}Use decompress: false to handle compressed data manually${colors.reset}`);

  printResult("Advanced options demonstrated!");
  printInfo("💡 Use verbose mode for debugging, proxies for corporate networks");
}

// FEATURE 9: Special Protocols
async function demoSpecialProtocols() {
  printSectionHeader(
    "FEATURE 9: Special URL Protocols",
    "file://, data:, blob:, and s3:// URLs"
  );

  printStep(1, "File Protocol (file://)");
  printCode(`const response = await fetch("file:///etc/hostname");
const content = await response.text();`);

  const fileResponse = await fetch("file:///etc/hostname");
  const fileContent = await fileResponse.text();
  console.log(`${colors.fgYellow}/etc/hostname contents:${colors.reset} ${fileContent.trim()}`);
  printInfo("💡 Great for reading local files in Bun applications");

  printStep(2, "Data Protocol (data:)");
  printCode(`const response = await fetch("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==");
const text = await response.text();`);

  const dataResponse = await fetch("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==");
  const dataText = await dataResponse.text();
  console.log(`${colors.fgYellow}Decoded data:${colors.reset} "${dataText}"`);
  printInfo("💡 Useful for embedding small data directly in URLs");

  printStep(3, "Blob Protocol (blob:)");
  printCode(`const blob = new Blob(["Hello Blob!"], { type: "text/plain" });
const blobUrl = URL.createObjectURL(blob);
const response = await fetch(blobUrl);`);

  const blob = new Blob(["Hello from Blob URL!"], { type: "text/plain" });
  const blobUrl = URL.createObjectURL(blob);
  const blobResponse = await fetch(blobUrl);
  const blobText = await blobResponse.text();
  console.log(`${colors.fgYellow}Blob content:${colors.reset} "${blobText}"`);
  URL.revokeObjectURL(blobUrl);
  printInfo("💡 Perfect for in-memory file handling and client-side storage");

  printStep(4, "S3 Protocol (s3://)");
  printCode(`const response = await fetch("s3://my-bucket/file.txt", {
  s3: { accessKeyId: "key", secretAccessKey: "secret" }
});`);

  console.log(`${colors.fgYellow}S3 URL syntax:${colors.reset}`);
  console.log(`  fetch("s3://bucket-name/path/to/file", {`);
  console.log(`    s3: { accessKeyId: "...", secretAccessKey: "..." }`);
  console.log(`  })`);
  printInfo("💡 Direct S3 access without AWS SDK - requires valid credentials");

  printResult("All special protocols demonstrated!");
  printInfo("💡 These protocols work seamlessly with fetch() - no special handling needed");
}

// FEATURE 10: Complete Demo
async function demoComplete() {
  printSectionHeader(
    "FEATURE 10: Complete End-to-End Demo",
    "Combining all features in a realistic workflow"
  );

  printStep(1, "Real-World API Workflow");
  printCode(`// 1. Optimize connection
dns.prefetch("api.example.com");
fetch.preconnect("https://api.example.com");

// 2. Make authenticated request
const response = await fetch("https://api.example.com/data", {
  headers: { "Authorization": "Bearer token" },
  signal: AbortSignal.timeout(5000)
});

// 3. Process response
const data = await response.json();

// 4. Save to file
await write("/tmp/result.json", response);`);

  printInfo("Simulating a complete API client workflow...");

  // Step 1: Optimize
  const apiDomain = "jsonplaceholder.typicode.com";
  dns.prefetch(apiDomain);
  try { (fetch as any).preconnect(`https://${apiDomain}`); } catch (e) {}

  // Step 2: Authenticated request with timeout
  const response = await fetch(`https://${apiDomain}/posts/1`, {
    headers: {
      "Authorization": "Bearer demo-token-12345",
      "User-Agent": "Bun-Complete-Demo/1.0"
    },
    signal: AbortSignal.timeout(10000)
  });

  // Step 3: Process
  const data = await response.json();
  console.log(`${colors.fgYellow}API Response:${colors.reset}`);
  console.log(JSON.stringify(data, null, 2));

  // Step 4: Save
  const saveFile = "/tmp/complete-demo-result.json";
  await write(saveFile, response);
  const saved = readFileSync(saveFile, "utf-8");
  console.log(`${colors.fgCyan}Saved to file: ${saveFile} (${saved.length} bytes)${colors.reset}`);

  // Step 5: Verify with streaming
  const verifyResponse = await fetch(`https://${apiDomain}/posts/2`);
  let verifiedSize = 0;
  if (verifyResponse.body) {
    const reader = verifyResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      verifiedSize += value.length;
    }
  }
  console.log(`${colors.fgGreen}Verified: ${verifiedSize} bytes streamed successfully${colors.reset}`);

  // Cleanup
  unlinkSync(saveFile);

  printResult("Complete workflow executed successfully!");
  printInfo("💡 This pattern combines optimization, security, and reliability");
}

// FEATURE 11: Documentation
function showDocumentation() {
  printSectionHeader(
    "DOCUMENTATION: Feature Reference Table",
    "Quick reference for all Bun Fetch API features"
  );

  console.log(`${colors.fgCyan}${colors.bright}RESPONSE METHODS:${colors.reset}`);
  console.log(`  1. response.text()     - Promise<string>     (HTML, text)`);
  console.log(`  2. response.json()     - Promise<any>        (JSON APIs)`);
  console.log(`  3. response.formData() - Promise<FormData>   (Form data)`);
  console.log(`  4. response.bytes()    - Promise<Uint8Array> (Fastest binary)`);
  console.log(`  5. response.arrayBuffer() - Promise<ArrayBuffer> (Binary)`);
  console.log(`  6. response.blob()     - Promise<Blob>       (Files)`);

  console.log(`\n${colors.fgCyan}${colors.bright}HTTP METHODS:${colors.reset}`);
  console.log(`  7. POST String         - { method: "POST", body: string }`);
  console.log(`  8. POST JSON           - { method: "POST", body: object }`);
  console.log(`  9. POST FormData       - { method: "POST", body: FormData }`);
  console.log(`  10. POST ArrayBuffer   - { method: "POST", body: ArrayBuffer }`);

  console.log(`\n${colors.fgCyan}${colors.bright}CONNECTION MANAGEMENT:${colors.reset}`);
  console.log(`  11. DNS Prefetch       - dns.prefetch(hostname)`);
  console.log(`  12. DNS Cache Stats    - dns.getCacheStats()`);
  console.log(`  13. Preconnect         - fetch.preconnect(url)`);
  console.log(`  14. Keep-Alive         - { keepalive: boolean }`);

  console.log(`\n${colors.fgCyan}${colors.bright}ERROR HANDLING:${colors.reset}`);
  console.log(`  15. AbortSignal        - AbortSignal.timeout(ms)`);
  console.log(`  16. AbortController    - new AbortController()`);

  console.log(`\n${colors.fgCyan}${colors.bright}ADVANCED OPTIONS:${colors.reset}`);
  console.log(`  17. Custom Headers     - { headers: {...} }`);
  console.log(`  18. TLS Options        - { tls: { rejectUnauthorized } }`);
  console.log(`  19. Proxy              - { proxy: "http://..." }`);
  console.log(`  20. Verbose Logging    - { verbose: true }`);

  console.log(`\n${colors.fgCyan}${colors.bright}FILE OPERATIONS:${colors.reset}`);
  console.log(`  21. Bun.write()        - Bun.write(path, response)`);

  console.log(`\n${colors.fgCyan}${colors.bright}SPECIAL PROTOCOLS:${colors.reset}`);
  console.log(`  22. file://            - Local files`);
  console.log(`  23. data:              - Embedded data`);
  console.log(`  24. blob:              - In-memory blobs`);
  console.log(`  25. s3://              - S3 storage`);

  console.log(`\n${colors.fgGreen}${colors.bright}For detailed docs, see: FETCH_FEATURES.md${colors.reset}`);
}

// FEATURE 12: Quick Start Guide
function showQuickStart() {
  printSectionHeader(
    "QUICK START GUIDE",
    "Essential patterns you'll use every day"
  );

  console.log(`${colors.fgCyan}${colors.bright}PATTERN 1: Basic API Request${colors.reset}`);
  printCode(`const response = await fetch("https://api.example.com/data");
const data = await response.json();
console.log(data);`);

  console.log(`\n${colors.fgCyan}${colors.bright}PATTERN 2: POST with JSON${colors.reset}`);
  printCode(`const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John", email: "john@example.com" })
});`);

  console.log(`\n${colors.fgCyan}${colors.bright}PATTERN 3: Authentication${colors.reset}`);
  printCode(`const response = await fetch("https://api.example.com/protected", {
  headers: {
    "Authorization": \`Bearer \${process.env.API_TOKEN}\`
  }
});`);

  console.log(`\n${colors.fgCyan}${colors.bright}PATTERN 4: Error Handling${colors.reset}`);
  printCode(`try {
  const response = await fetch("https://api.example.com/data", {
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }

  const data = await response.json();
} catch (error) {
  if (error.name === "AbortError") {
    console.error("Request timed out");
  } else {
    console.error("Request failed:", error.message);
  }
}`);

  console.log(`\n${colors.fgCyan}${colors.bright}PATTERN 5: File Download${colors.reset}`);
  printCode(`const response = await fetch("https://example.com/file.zip");
await write("/path/to/save.zip", response);`);

  console.log(`\n${colors.fgGreen}${colors.bright}💡 Pro Tips:${colors.reset}`);
  console.log(`  • Always use try/catch with fetch`);
  console.log(`  • Set timeouts for production requests`);
  console.log(`  • Use environment variables for API keys`);
  console.log(`  • Prefer bytes() for binary data (Bun-specific)`);
  console.log(`  • Enable keep-alive for multiple requests to same host`);
}

// FEATURE 13: Best Practices
function showBestPractices() {
  printSectionHeader(
    "BEST PRACTICES",
    "Production-ready patterns and anti-patterns"
  );

  console.log(`${colors.fgGreen}${colors.bright}✅ DO:${colors.reset}`);
  console.log(`  1. Always handle errors with try/catch`);
  console.log(`  2. Set appropriate timeouts (5-30 seconds)`);
  console.log(`  3. Use environment variables for secrets`);
  console.log(`  4. Set User-Agent header for tracking`);
  console.log(`  5. Use DNS prefetch for known domains`);
  console.log(`  6. Enable keep-alive for connection reuse`);
  console.log(`  7. Use Bun.write() for file downloads`);
  console.log(`  8. Use bytes() for binary data (Bun-specific)`);
  console.log(`  9. Validate response status codes`);
  console.log(`  10. Close connections properly`);

  console.log(`\n${colors.fgRed}${colors.bright}❌ DON'T:${colors.reset}`);
  console.log(`  1. Never use rejectUnauthorized: false in production`);
  console.log(`  2. Don't ignore AbortError (user cancellation)`);
  console.log(`  3. Don't hardcode API keys or tokens`);
  console.log(`  4. Don't forget to handle network errors`);
  console.log(`  5. Don't load large responses into memory at once`);
  console.log(`  6. Don't forget to set Content-Type for POST requests`);
  console.log(`  7. Don't ignore response status codes`);
  console.log(`  8. Don't make unnecessary requests (cache when possible)`);

  console.log(`\n${colors.fgCyan}${colors.bright}SECURITY CHECKLIST:${colors.reset}`);
  console.log(`  ✓ Use HTTPS for all production requests`);
  console.log(`  ✓ Validate all user input before sending`);
  console.log(`  ✓ Store secrets in environment variables`);
  console.log(`  ✓ Set reasonable timeouts`);
  console.log(`  ✓ Handle all error cases`);
  console.log(`  ✓ Sanitize response data before display`);
  console.log(`  ✓ Use AbortController for user cancellations`);

  console.log(`\n${colors.fgYellow}${colors.bright}PERFORMANCE TIPS:${colors.reset}`);
  console.log(`  • DNS prefetch: ~100ms faster first request`);
  console.log(`  • Connection pooling: 50-80% faster subsequent requests`);
  console.log(`  • Bun.write(): Zero-copy, 2-5x faster than manual`);
  console.log(`  • bytes(): 15-20% faster than arrayBuffer()`);
}

// FEATURE 14: Generate Test Files
async function generateTestFiles() {
  printSectionHeader(
    "GENERATE TEST FILES",
    "Create sample data for testing"
  );

  const testDir = "/tmp/bun-fetch-test";

  printStep(1, "Creating test directory");
  try {
    const { mkdirSync } = await import("fs");
    mkdirSync(testDir, { recursive: true });
    printResult(`Created directory: ${testDir}`);
  } catch (e) {
    printWarning("Directory may already exist");
  }

  printStep(2, "Generating JSON test file");
  const testData = {
    timestamp: new Date().toISOString(),
    message: "Bun Fetch API Test File",
    features: ["fetch", "streaming", "performance", "security"],
    version: "1.0.0"
  };
  writeFileSync(`${testDir}/test.json`, JSON.stringify(testData, null, 2));
  printResult(`Created: ${testDir}/test.json`);

  printStep(3, "Generating text file");
  const textContent = `Bun Fetch API Test File
Generated: ${new Date().toISOString()}
This file is for testing download and upload functionality.`;
  writeFileSync(`${testDir}/test.txt`, textContent);
  printResult(`Created: ${testDir}/test.txt`);

  printStep(4, "Generating binary file (1KB)");
  const binaryData = Buffer.alloc(1024, 'X');
  writeFileSync(`${testDir}/test.bin`, binaryData);
  printResult(`Created: ${testDir}/test.bin (1KB)`);

  printStep(5, "Testing file:// protocol");
  const fileResponse = await fetch(`file://${testDir}/test.json`);
  const fileContent = await fileResponse.json();
  console.log(`${colors.fgYellow}File content via fetch:${colors.reset}`);
  console.log(JSON.stringify(fileContent, null, 2));

  console.log(`\n${colors.fgCyan}Test files created in: ${testDir}${colors.reset}`);
  console.log(`${colors.fgGreen}You can now test with: file://${testDir}/test.json${colors.reset}`);
}

// FEATURE 15: Performance Test
async function performanceTest() {
  printSectionHeader(
    "PERFORMANCE TEST",
    "Compare different fetch patterns"
  );

  const testUrl = "https://jsonplaceholder.typicode.com/posts/1";

  printStep(1, "Baseline (single request)");
  const start1 = Date.now();
  await fetch(testUrl);
  const time1 = Date.now() - start1;
  console.log(`${colors.fgCyan}Time: ${time1}ms${colors.reset}`);

  printStep(2, "With DNS Prefetch");
  dns.prefetch("jsonplaceholder.typicode.com");
  const start2 = Date.now();
  await fetch(testUrl);
  const time2 = Date.now() - start2;
  console.log(`${colors.fgCyan}Time: ${time2}ms (saved ${time1 - time2}ms)${colors.reset}`);

  printStep(3, "Connection Pooling (3 requests)");
  const start3 = Date.now();
  await fetch(testUrl);
  await fetch(testUrl);
  await fetch(testUrl);
  const time3 = Date.now() - start3;
  const avgTime = time3 / 3;
  console.log(`${colors.fgCyan}Total: ${time3}ms, Average: ${avgTime.toFixed(1)}ms${colors.reset}`);

  printStep(4, "Without Keep-Alive (3 requests)");
  const start4 = Date.now();
  await fetch(testUrl, { keepalive: false });
  await fetch(testUrl, { keepalive: false });
  await fetch(testUrl, { keepalive: false });
  const time4 = Date.now() - start4;
  const avgTime4 = time4 / 3;
  console.log(`${colors.fgCyan}Total: ${time4}ms, Average: ${avgTime4.toFixed(1)}ms${colors.reset}`);

  printStep(5, "Bun.write() vs Manual Save");
  const response = await fetch("https://httpbin.org/bytes/1000");

  const start5 = Date.now();
  await write("/tmp/bun-write-test", response);
  const time5 = Date.now() - start5;
  console.log(`${colors.fgCyan}Bun.write(): ${time5}ms${colors.reset}`);

  // Manual save for comparison
  const response2 = await fetch("https://httpbin.org/bytes/1000");
  const start6 = Date.now();
  const buffer = await response2.arrayBuffer();
  const { writeFileSync } = await import("fs");
  writeFileSync("/tmp/manual-write-test", Buffer.from(buffer));
  const time6 = Date.now() - start6;
  console.log(`${colors.fgCyan}Manual save: ${time6}ms${colors.reset}`);
  console.log(`${colors.fgGreen}Bun.write() is ${(time6 / time5).toFixed(1)}x faster!${colors.reset}`);

  // Cleanup
  const { unlinkSync } = await import("fs");
  try {
    unlinkSync("/tmp/bun-write-test");
    unlinkSync("/tmp/manual-write-test");
  } catch (e) {}

  printResult("Performance comparison completed!");
  printInfo("💡 Use DNS prefetch, keep-alive, and Bun.write() for best performance");
}

// ============================================================================
// MAIN MENU & ROUTING
// ============================================================================

async function handleFeatureSelection(choice: string): Promise<boolean> {
  switch (choice.trim()) {
    case "1":
      await demoResponseMethods();
      return true;
    case "2":
      await demoPostRequests();
      return true;
    case "3":
      await demoCustomHeaders();
      return true;
    case "4":
      await demoErrorHandling();
      return true;
    case "5":
      await demoFileOperations();
      return true;
    case "6":
      await demoStreaming();
      return true;
    case "7":
      await demoPerformance();
      return true;
    case "8":
      await demoAdvancedOptions();
      return true;
    case "9":
      await demoSpecialProtocols();
      return true;
    case "10":
      await demoComplete();
      return true;
    case "11":
      showDocumentation();
      return true;
    case "12":
      showQuickStart();
      return true;
    case "13":
      showBestPractices();
      return true;
    case "14":
      await generateTestFiles();
      return true;
    case "15":
      await performanceTest();
      return true;
    case "0":
    case "exit":
      console.log(`${colors.fgGreen}\n👋 Thanks for learning Bun Fetch API!${colors.reset}`);
      console.log(`${colors.fgCyan}📚 Read FETCH_FEATURES.md for complete documentation${colors.reset}\n`);
      return false;
    default:
      console.log(`${colors.fgRed}❌ Invalid choice. Please select 0-15.${colors.reset}`);
      return true;
  }
}

async function interactiveMode() {
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  while (true) {
    const choice = await question(`${colors.fgCyan}\n🎯 Select a feature (0-15): ${colors.reset}`);
    const shouldContinue = await handleFeatureSelection(choice);

    if (!shouldContinue) {
      rl.close();
      break;
    }

    console.log(`${colors.dim}\nPress Enter to continue...${colors.reset}`);
    await question("");
  }
}

async function runAllFeatures() {
  printSectionHeader("RUNNING ALL FEATURES", "This will execute every demo sequentially");

  const features = [
    { name: "Response Methods", fn: demoResponseMethods },
    { name: "POST Requests", fn: demoPostRequests },
    { name: "Custom Headers", fn: demoCustomHeaders },
    { name: "Error Handling", fn: demoErrorHandling },
    { name: "File Operations", fn: demoFileOperations },
    { name: "Streaming", fn: demoStreaming },
    { name: "Performance", fn: demoPerformance },
    { name: "Advanced Options", fn: demoAdvancedOptions },
    { name: "Special Protocols", fn: demoSpecialProtocols },
    { name: "Complete Demo", fn: demoComplete },
  ];

  for (const feature of features) {
    printWarning(`\n▶️  Running: ${feature.name}`);
    try {
      await feature.fn();
      printResult(`${feature.name} completed`);
    } catch (error) {
      printError(`${feature.name} failed: ${(error as Error).message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  printSectionHeader("ALL FEATURES COMPLETED", "Congratulations! You've mastered Bun Fetch API");
  console.log(`${colors.fgGreen}${colors.bright}🎉 Success!${colors.reset}`);
  console.log(`${colors.fgCyan}Next steps:${colors.reset}`);
  console.log(`  1. Read FETCH_FEATURES.md for detailed documentation`);
  console.log(`  2. Try building your own Bun application`);
  console.log(`  3. Join the Bun community on Discord`);
  console.log(`  4. Explore more Bun features at bun.sh`);
}

async function main() {
  printBanner();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    printMainMenu();
    await interactiveMode();
  } else {
    const command = args[0];

    if (command === "all") {
      await runAllFeatures();
    } else if (command === "-h" || command === "--help") {
      printMainMenu();
      console.log(`\n${colors.fgCyan}Usage Examples:${colors.reset}`);
      console.log(`  bun-fetch-demo              # Interactive mode`);
      console.log(`  bun-fetch-demo 1            # Run feature 1 only`);
      console.log(`  bun-fetch-demo all          # Run all features`);
      console.log(`  bun-fetch-demo docs         # Show documentation`);
      console.log(`  bun-fetch-demo quickstart   # Show quick start guide`);
    } else if (command === "docs") {
      showDocumentation();
    } else if (command === "quickstart") {
      showQuickStart();
    } else if (command === "bestpractices") {
      showBestPractices();
    } else {
      const success = await handleFeatureSelection(command);
      if (!success) {
        process.exit(0);
      }
    }
  }
}

// Run the CLI
main().catch((error) => {
  console.error(`${colors.fgRed}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
