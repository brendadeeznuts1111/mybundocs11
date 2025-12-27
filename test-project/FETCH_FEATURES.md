# Bun Fetch API Features Reference

A comprehensive reference table for all Bun Fetch API features from [bun.com/docs/runtime/networking/fetch](https://bun.com/docs/runtime/networking/fetch).

## Quick Reference Table

### Table of Contents
- [Response Methods](#response-methods)
- [File Operations](#file-operations)
- [Connection Management](#connection-management)
- [Request Control](#request-control)
- [POST Methods](#post-methods)
- [Advanced Options](#advanced-options)
- [URL Protocols](#url-protocols)
- [Environment & Limits](#environment--limits)
- [Related Networking APIs](#related-networking-apis)
- [TypeScript Definitions](#typescript-definitions)
- [Code Examples](#code-examples)

### Response Methods

| # | Status | Priority | Feature | Bun API Signature | Returns | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f1">1</a> | `✅ STABLE` | `🔴 CRITICAL` | **Response.text()** | `response.text(): Promise<string>` | `string` | [#2](#f2), [#3](#f3) | [ex-001](#ex-001) | [docs](https://bun.com/docs/runtime/networking/fetch#response-text) |
| <a id="f2">2</a> | `✅ STABLE` | `🔴 CRITICAL` | **Response.json()** | `response.json(): Promise<any>` | `any` | [#1](#f1), [#3](#f3) | [ex-001](#ex-001) | [docs](https://bun.com/docs/runtime/networking/fetch#response-json) |
| <a id="f3">3</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.formData()** | `response.formData(): Promise<FormData>` | `FormData` | [#1](#f1), [#2](#f2) | [ex-002](#ex-002) | [docs](https://bun.com/docs/runtime/networking/fetch#response-formdata) |
| <a id="f4">4</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Response.bytes()** | `response.bytes(): Promise<Uint8Array>` | `Uint8Array` | [#5](#f5), [#6](#f6) | [ex-004](#ex-004) | [docs](https://bun.com/docs/runtime/networking/fetch#response-bytes) |
| <a id="f5">5</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.arrayBuffer()** | `response.arrayBuffer(): Promise<ArrayBuffer>` | `ArrayBuffer` | [#4](#f4), [#6](#f6) | [ex-003](#ex-003) | [docs](https://bun.com/docs/runtime/networking/fetch#response-arraybuffer) |
| <a id="f6">6</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.blob()** | `response.blob(): Promise<Blob>` | `Blob` | [#4](#f4), [#5](#f5) | [ex-003](#ex-003) | [docs](https://bun.com/docs/runtime/networking/fetch#response-blob) |

### File Operations

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|
| <a id="f7">7</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.write()** | `Bun.write(path: string \| number \| Blob, data: Blob \| Response): Promise<number>` | [#8](#f8), [#23](#f23) | [ex-004](#ex-004) | [docs](https://bun.com/docs/api/file-io#bun-write) |
| <a id="f8">8</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Sendfile Optimization** | `Automatic (no API)` | [#7](#f7), [#37](#f37) | [ex-004](#ex-004) | [docs](https://bun.com/docs/runtime/networking/fetch#sendfile-optimization) |

### Connection Management

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f9">9</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Prefetch** | `dns.prefetch(hostname: string): void` | [#10](#f10), [#35](#f35) | [ex-005](#ex-005) | [docs](https://bun.com/docs/api/dns#dns-prefetch) |
| <a id="f10">10</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Cache Stats** | `dns.getCacheStats(): DNSCacheStats` | [#9](#f9), [#35](#f35) | [ex-005](#ex-005) | [docs](https://bun.com/docs/api/dns#dns-getcachestats) |
| <a id="f11">11</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Preconnect** | `fetch.preconnect(url: string): void` | [#12](#f12), [#13](#f13) | [ex-006](#ex-006) | [docs](https://bun.com/docs/runtime/networking/fetch#preconnect) |
| <a id="f12">12</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Startup Preconnect** | `--fetch-preconnect <url>` (CLI) | [#11](#f11), [#13](#f13) | [ex-006](#ex-006) | [docs](https://bun.com/docs/runtime/networking/fetch#startup-preconnect) |
| <a id="f13">13</a> | `✅ STABLE` | `🔴 CRITICAL` | **Keep-Alive** | `fetch(url, { keepalive: boolean })` | [#11](#f11), [#12](#f12) | [ex-007](#ex-007) | [docs](https://bun.com/docs/runtime/networking/fetch#keep-alive) |
| <a id="f14">14</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Connection Limit** | `BUN_CONFIG_MAX_HTTP_REQUESTS=number` (Env) | [#13](#f13), [#36](#f36) | [ex-007](#ex-007) | [docs](https://bun.com/docs/runtime/networking/fetch#connection-limits) |

### Request Control

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f15">15</a> | `✅ STABLE` | `🔴 CRITICAL` | **AbortSignal Timeout** | `AbortSignal.timeout(ms: number): AbortSignal` | [#16](#f16), [#38](#f38) | [ex-008](#ex-008) | [docs](https://bun.com/docs/runtime/networking/fetch#abortsignal-timeout) |
| <a id="f16">16</a> | `✅ STABLE` | `🔴 CRITICAL` | **AbortController** | `new AbortController(): AbortController` | [#15](#f15), [#38](#f38) | [ex-008](#ex-008) | [docs](https://bun.com/docs/runtime/networking/fetch#abortcontroller) |
| <a id="f17">17</a> | `✅ STABLE` | `🔴 CRITICAL` | **Custom Headers** | `fetch(url, { headers: HeadersInit })` | [#18](#f18), [#20](#f20) | [ex-009](#ex-009) | [docs](https://bun.com/docs/runtime/networking/fetch#custom-headers) |
| <a id="f18">18</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Verbose Logging** | `fetch(url, { verbose: boolean \| "curl" })` | [#17](#f17) | [ex-010](#ex-010) | [docs](https://bun.com/docs/runtime/networking/fetch#verbose-logging) |

### POST Methods

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f19">19</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST String** | `fetch(url, { method: "POST", body: string })` | [#17](#f17), [#20](#f20) | [ex-011](#ex-011) | [docs](https://bun.com/docs/runtime/networking/fetch#post-string) |
| <a id="f20">20</a> | `✅ STABLE` | `🔴 CRITICAL` | **POST JSON** | `fetch(url, { method: "POST", body: object })` | [#17](#f17), [#19](#f19) | [ex-011](#ex-011) | [docs](https://bun.com/docs/runtime/networking/fetch#post-json) |
| <a id="f21">21</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST FormData** | `fetch(url, { method: "POST", body: FormData })` | [#17](#f17), [#19](#f19) | [ex-012](#ex-012) | [docs](https://bun.com/docs/runtime/networking/fetch#post-formdata) |
| <a id="f22">22</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST ArrayBuffer** | `fetch(url, { method: "POST", body: ArrayBuffer })` | [#17](#f17), [#19](#f19) | [ex-013](#ex-013) | [docs](https://bun.com/docs/runtime/networking/fetch#post-arraybuffer) |
| <a id="f23">23</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Streaming Request** | `fetch(url, { body: ReadableStream })` | [#7](#f7), [#8](#f8) | [ex-014](#ex-014) | [docs](https://bun.com/docs/runtime/networking/fetch#streaming-request) |

### Advanced Options

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f24">24</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Proxy (Simple)** | `fetch(url, { proxy: string })` | [#25](#f25) | [ex-015](#ex-015) | [docs](https://bun.com/docs/runtime/networking/fetch#proxy-simple) |
| <a id="f25">25</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Proxy (Advanced)** | `fetch(url, { proxy: object })` | [#24](#f24) | [ex-015](#ex-015) | [docs](https://bun.com/docs/runtime/networking/fetch#proxy-advanced) |
| <a id="f26">26</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Client Cert** | `fetch(url, { tls: object })` | [#27](#f27) | [ex-016](#ex-016) | [docs](https://bun.com/docs/runtime/networking/fetch#tls-client-cert) |
| <a id="f27">27</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Custom Validation** | `fetch(url, { tls: object })` | [#26](#f26) | [ex-016](#ex-016) | [docs](https://bun.com/docs/runtime/networking/fetch#tls-custom-validation) |
| <a id="f28">28</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Disable Validation** | `fetch(url, { tls: object })` | [#26](#f26) | [ex-016](#ex-016) | [docs](https://bun.com/docs/runtime/networking/fetch#tls-disable-validation) |
| <a id="f29">29</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Decompression Control** | `fetch(url, { decompress: boolean })` | [#24](#f24) | [ex-017](#ex-017) | [docs](https://bun.com/docs/runtime/networking/fetch#decompression-control) |

### URL Protocols

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f30">30</a> | `✅ STABLE` | `🟡 IMPORTANT` | **File URL** | `fetch("file:///path")` | [#7](#f7) | [ex-018](#ex-018) | [docs](https://bun.com/docs/runtime/networking/fetch#file-url) |
| <a id="f31">31</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Data URL** | `fetch("data:...")` | [#32](#f32) | [ex-019](#ex-019) | [docs](https://bun.com/docs/runtime/networking/fetch#data-url) |
| <a id="f32">32</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Blob URL** | `fetch(blobUrl)` | [#31](#f31) | [ex-020](#ex-020) | [docs](https://bun.com/docs/runtime/networking/fetch#blob-url) |
| <a id="f33">33</a> | `✅ STABLE` | `🟡 IMPORTANT` | **S3 URL** | `fetch("s3://...", { s3: object })` | [#23](#f23) | [ex-021](#ex-021) | [docs](https://bun.com/docs/runtime/networking/fetch#s3-url) |
| <a id="f34">34</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Unix Domain Socket** | `fetch(url, { unix: string })` | [#11](#f11) | [ex-022](#ex-022) | [docs](https://bun.com/docs/runtime/networking/fetch#unix-domain-socket) |

### Environment & Limits

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f35">35</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Cache TTL** | `30 seconds (default)` | [#9](#f9) | [ex-005](#ex-005) | [docs](https://bun.com/docs/api/dns#dns-cache-ttl) |
| <a id="f36">36</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Connection Limit** | `BUN_CONFIG_MAX_HTTP_REQUESTS` | [#14](#f14) | [ex-007](#ex-007) | [docs](https://bun.com/docs/runtime/networking/fetch#connection-limits) |
| <a id="f37">37</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Sendfile Threshold** | `32KB (default)` | [#8](#f8) | [ex-004](#ex-004) | [docs](https://bun.com/docs/runtime/networking/fetch#sendfile-threshold) |
| <a id="f38">38</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Request Timeout** | `AbortSignal.timeout(ms)` | [#15](#f15) | [ex-008](#ex-008) | [docs](https://bun.com/docs/runtime/networking/fetch#request-timeout) |

### Related Networking APIs

| # | Status | Priority | Feature | Bun API Signature | Cross-Ref | Example | Documentation |
|---|---|---|---|---|---|---|---|---|
| <a id="f39">39</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.serve()** | `Bun.serve({ fetch(req) })` | [#20](#f20) | [ex-023](#ex-023) | [docs](https://bun.com/docs/api/http#bun-serve) |
| <a id="f40">40</a> | `✅ STABLE` | `🟡 IMPORTANT` | **HTMLRewriter** | `new HTMLRewriter().transform(res)` | [#1](#f1) | [ex-024](#ex-024) | [docs](https://bun.com/docs/api/html-rewriter) |
| <a id="f41">41</a> | `✅ STABLE` | `🟡 IMPORTANT` | **FileSystemRouter** | `new Bun.FileSystemRouter(opts)` | [#39](#f39) | [ex-025](#ex-025) | [docs](https://bun.com/docs/api/file-system-router) |
| <a id="f42">42</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.connect()** | `Bun.connect(opts)` | [#34](#f34) | [ex-026](#ex-026) | [docs](https://bun.com/docs/api/tcp#bun-connect) |
| <a id="f43">43</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.dns.lookup()** | `Bun.dns.lookup(host)` | [#9](#f9) | [ex-027](#ex-027) | [docs](https://bun.com/docs/api/dns#bun-dns-lookup) |

---

## Bun API Signature Legend

### Method Signatures
- **Instance Method**: `object.method(arg: Type): ReturnType`
- **Static Method**: `Class.method(arg: Type): ReturnType`
- **Function**: `functionName(arg: Type): ReturnType`

### Type Annotations
- `Promise<T>`: Asynchronous operation returning `T`
- `Promise<Uint8Array>`: Fastest binary data (Bun-specific)
- `HeadersInit`: `Headers | Record<string, string> | [string, string][]`
- `Blob`: Binary large object
- `ReadableStream`: Streaming data interface

### Configuration Patterns
- **Option**: `fetch(url, { option: value })`
- **Env Var**: `VARIABLE_NAME=value bun run script.ts`
- **CLI Flag**: `bun --flag value script.ts`
- **Config**: Automatic behavior (no explicit API)

---

## Cross-Reference Guide

### How to Read Cross-References
- **Numbers in brackets** like `[2,3,4]` refer to feature numbers in the table
- **Related features** that are commonly used together
- **Alternative approaches** for similar functionality
- **Dependencies** that must be used together

### Common Cross-Reference Patterns

#### Response Processing Chain
```
1 → 2 → 3 → 4 → 5 → 6
(All response methods are interchangeable)
```

#### File Operations
```text
7 ↔ 8 ↔ 23 ↔ 37
(Bun.write + Sendfile + Streaming + Threshold)
```

#### Connection Optimization
```text
9 ↔ 10 ↔ 35
(DNS Prefetch + Cache Stats + TTL)

11 ↔ 12 ↔ 13 ↔ 14
(Preconnect + Startup + Keep-Alive + Limits)
```

#### Error Handling & Cancellation
```text
15 ↔ 16 ↔ 38
(AbortSignal + AbortController + Timeout)
```

#### POST Methods
```text
17 ↔ 19 ↔ 20 ↔ 21 ↔ 22
(Headers + String + JSON + FormData + ArrayBuffer)
```

#### Security & Proxy
```text
24 ↔ 25 ↔ 29
(Proxy + Decompression)

26 ↔ 27 ↔ 28
(TLS Cert + Validation + Disable)
```

#### URL Protocols
```text
30 ↔ 7
(File URL + Bun.write)

31 ↔ 32
(Data URL + Blob URL)

33 ↔ 23
(S3 URL + Streaming)
```

### Advanced Networking Patterns

#### Streaming Pipeline
```text
23 → 40 → 39
(Streaming Request → HTMLRewriter → Bun.serve)
```

#### Binary Data Flow
```text
4 → 7
(Response.bytes → Bun.write)
```

#### Client-Server Identity
```text
13 ↔ 39
(Keep-Alive ↔ Bun.serve)
```

---

## Quick Usage Examples

### <a id="example-001"></a>1. Basic Response Methods (Critical)
```typescript
// GET with JSON response
const data = await fetch("https://api.example.com/data").then(r => r.json());

// GET with Text response
const text = await fetch("https://example.com").then(r => r.text());
```

### <a id="example-002"></a>2. Form Data Handling (Important)
```typescript
// Handling multipart/form-data responses
const response = await fetch("https://api.example.com/form");
const formData = await response.formData();
console.log(formData.get("username"));
```

### <a id="example-003"></a>3. Binary Data & Blobs (Optimization)
```typescript
// Fastest binary data handling (Bun-specific)
const bytes = await (await fetch("https://example.com/file")).bytes();

// Standard ArrayBuffer
const buffer = await (await fetch("https://example.com/file")).arrayBuffer();

// Blob for file-like objects
const blob = await (await fetch("https://example.com/image.png")).blob();
```

### <a id="example-004"></a>4. Efficient File Downloads (Optimization)
```typescript
import { write } from "bun";

// Efficient file download using Bun.write()
// Automatically uses 'sendfile' optimization for files > 32KB
const response = await fetch("https://example.com/large-file.zip");
await write("/path/to/file.zip", response);
```

### <a id="example-005"></a>5. DNS Optimization (Important)
```typescript
import { dns } from "bun";

// Resolve domain before the request
dns.prefetch("api.example.com");

// Inspect DNS cache performance
const stats = dns.getCacheStats();
console.log(`Cache hits: ${stats.cacheHitsCompleted}`);
```

### <a id="example-006"></a>6. Preconnecting (Important)
```typescript
import { fetch } from "bun";

// Prepare DNS, TCP, and TLS in advance
fetch.preconnect("https://api.example.com");

// CLI equivalent: bun --fetch-preconnect https://api.example.com script.ts
```

### <a id="example-007"></a>7. Connection Management (Critical)
```typescript
// Enable/Disable Keep-Alive
await fetch("https://api.example.com", { keepalive: true });

// Env Var for connection limits:
// BUN_CONFIG_MAX_HTTP_REQUESTS=512 bun run script.ts
```

### <a id="example-008"></a>8. Timeouts & Cancellation (Critical)
```typescript
// Standard way to handle timeouts in Bun 1.x
// Auto-timeout after 5 seconds
try {
  const response = await fetch("https://api.example.com", {
    signal: AbortSignal.timeout(5000)
  });
  const data = await response.json();
} catch (err) {
  if (err.name === "TimeoutError") {
    console.error("The request timed out after 5 seconds");
  }
}

// Manual cancellation using AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 2000);

try {
  await fetch("https://api.example.com", { signal: controller.signal });
} catch (err) {
  if (err.name === "AbortError") {
    console.log("Request was manually cancelled");
  }
} finally {
  clearTimeout(timeoutId);
}
```

### <a id="example-009"></a>9. Custom Headers (Critical)
```typescript
// Multiple header formats supported
await fetch("https://api.example.com", {
  headers: {
    "Authorization": "Bearer token123",
    "X-Custom-Header": "value"
  }
});
```

### <a id="example-010"></a>10. Verbose Logging (Important)
```typescript
// Debugging with verbose output
await fetch("https://api.example.com", {
  verbose: "curl" // Shows equivalent curl command
});
```

### <a id="example-011"></a>11. POST with JSON/String (Critical)
```typescript
// POST with JSON
await fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: "value" })
});
```

### <a id="example-012"></a>12. POST with FormData (Important)
```typescript
const formData = new FormData();
formData.append("file", new Blob(["content"]), "test.txt");

await fetch("https://api.example.com/upload", {
  method: "POST",
  body: formData
});
```

### <a id="example-013"></a>13. POST with Binary Data (Important)
```typescript
const buffer = new Uint8Array([1, 2, 3]).buffer;
await fetch("https://api.example.com/binary", {
  method: "POST",
  body: buffer
});
```

### <a id="example-014"></a>14. Streaming Requests (Optimization)
```typescript
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("chunk 1");
    controller.close();
  }
});

await fetch("https://api.example.com/stream", {
  method: "POST",
  body: stream
});
```

### <a id="example-015"></a>15. Proxy Configuration (Important)
```typescript
// Simple proxy
await fetch("https://api.example.com", {
  proxy: "http://user:pass@proxy:8080"
});

// Advanced proxy with custom headers
await fetch("https://api.example.com", {
  proxy: {
    url: "http://proxy:8080",
    headers: { "Proxy-Authorization": "Basic ..." }
  }
});
```

### <a id="example-016"></a>16. TLS Configuration (Important)
```typescript
// Custom TLS validation
await fetch("https://secure-api.com", {
  tls: {
    key: Bun.file("key.pem"),
    cert: Bun.file("cert.pem"),
    ca: Bun.file("ca.pem"),
    rejectUnauthorized: true
  }
});
```

### <a id="example-017"></a>17. Decompression Control (Important)
```typescript
// Disable automatic decompression
await fetch("https://api.example.com", {
  decompress: false
});
```

### <a id="example-018"></a>18. File Protocol (Important)
```typescript
// Read local files via fetch
const content = await fetch("file:///etc/hostname").then(r => r.text());
```

### <a id="example-019"></a>19. Data URL (Important)
```typescript
// Decode base64 data URLs
const text = await fetch("data:text/plain;base64,SGVsbG8=").then(r => r.text());
```

### <a id="example-020"></a>20. Blob URL (Important)
```typescript
const blob = new Blob(["Hello"]);
const url = URL.createObjectURL(blob);
const text = await fetch(url).then(r => r.text());
```

### <a id="example-021"></a>21. S3 Protocol (Important)
```typescript
// Native S3 access
await fetch("s3://my-bucket/file.txt", {
  s3: { accessKeyId: "key", secretAccessKey: "secret" }
});
```

### <a id="example-022"></a>22. Unix Domain Sockets (Important)
```typescript
// Connect to local sockets (e.g., Docker API)
const res = await fetch("http://localhost/info", {
  unix: "/var/run/docker.sock"
});
```

### <a id="example-023"></a>23. Bun.serve() Integration (Critical)
```typescript
Bun.serve({
  port: 3000,
  async fetch(req) {
    return new Response("Hello from Bun!");
  }
});
```

### <a id="example-024"></a>24. HTML Transformation (Important)
```typescript
const res = await fetch("https://example.com");
const transformed = new HTMLRewriter()
  .on("title", {
    element(el) { el.setInnerContent("New Title"); }
  })
  .transform(res);
```

### <a id="example-025"></a>25. FileSystemRouter (Important)
```typescript
const router = new Bun.FileSystemRouter({
  dir: "./pages",
  style: "nextjs"
});
const match = router.match("/user/123");
```

### <a id="example-026"></a>26. Low-level TCP (Optimization)
```typescript
const socket = await Bun.connect({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) { console.log("Received:", data); }
  }
});
```

### <a id="example-027"></a>27. DNS Lookup (Important)
```typescript
const ip = await Bun.dns.lookup("google.com");
```

---

## Code Examples

### <a id="ex-001"></a>1. Response.text() - Get Text Response
```typescript
const response = await fetch("https://api.example.com/message");
const text = await response.text();
console.log(text); // "Hello World"
```

### <a id="ex-002"></a>2. Response.json() - Parse JSON Response
```typescript
const response = await fetch("https://api.example.com/users/1");
const user = await response.json();
console.log(user.name); // "John Doe"
```

### <a id="ex-003"></a>3. Response.formData() - Handle Form Data
```typescript
const response = await fetch("https://api.example.com/form-submit");
const formData = await response.formData();
const username = formData.get("username");
```

### <a id="ex-004"></a>4. Response.bytes() - Fast Binary Data (Bun-specific)
```typescript
const response = await fetch("https://example.com/file.bin");
const bytes = await response.bytes(); // Fastest way to get binary data
console.log(bytes.length); // File size in bytes
```

### <a id="ex-005"></a>5. Response.arrayBuffer() - Standard Binary Buffer
```typescript
const response = await fetch("https://example.com/file.bin");
const buffer = await response.arrayBuffer();
const view = new Uint8Array(buffer);
```

### <a id="ex-006"></a>6. Response.blob() - File-like Object
```typescript
const response = await fetch("https://example.com/image.png");
const blob = await response.blob();
const file = new File([blob], "image.png", { type: "image/png" });
```

### <a id="ex-007"></a>7. Bun.write() - Efficient File Downloads
```typescript
import { write } from "bun";

const response = await fetch("https://example.com/large-file.zip");
await write("downloaded.zip", response); // Uses sendfile optimization
```

### <a id="ex-008"></a>8. Sendfile Optimization (Automatic)
```typescript
// No code needed - automatically used with Bun.write() for files > 32KB
const response = await fetch("https://example.com/big-file.dat");
await Bun.write("local.dat", response); // Zero-copy when possible
```

### <a id="ex-009"></a>9. DNS Prefetch - Resolve Domain Early
```typescript
import { dns } from "bun";

dns.prefetch("api.example.com"); // Resolve DNS before request
const response = await fetch("https://api.example.com/data"); // Faster
```

### <a id="ex-010"></a>10. DNS Cache Stats - Inspect Performance
```typescript
import { dns } from "bun";

const stats = dns.getCacheStats();
console.log(`Cache hits: ${stats.cacheHitsCompleted}`);
console.log(`Cache misses: ${stats.cacheMisses}`);
```

### <a id="ex-011"></a>11. Preconnect - Prepare Connection in Advance
```typescript
import { fetch } from "bun";

fetch.preconnect("https://api.example.com"); // Setup DNS, TCP, TLS
// Later requests reuse the prepared connection
```

### <a id="ex-012"></a>12. Startup Preconnect - CLI Flag
```bash
# Preconnect at application startup
bun --fetch-preconnect https://api.example.com app.ts
```

### <a id="ex-013"></a>13. Keep-Alive - Connection Reuse
```typescript
// Enable connection pooling (default)
await fetch("https://api.example.com", { keepalive: true });

// Disable per-request
await fetch("https://api.example.com", { keepalive: false });
```

### <a id="ex-014"></a>14. Connection Limit - Environment Variable
```bash
# Set max simultaneous requests
BUN_CONFIG_MAX_HTTP_REQUESTS=512 bun app.ts
```

### <a id="ex-015"></a>15. AbortSignal.timeout() - Auto Timeout
```typescript
try {
  const response = await fetch("https://api.example.com/slow", {
    signal: AbortSignal.timeout(5000) // 5 second timeout
  });
} catch (error) {
  if (error.name === "TimeoutError") {
    console.log("Request timed out");
  }
}
```

### <a id="ex-016"></a>16. AbortController - Manual Cancellation
```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 2000); // Cancel after 2 seconds

try {
  await fetch("https://api.example.com/data", {
    signal: controller.signal
  });
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request was cancelled");
  }
}
```

### <a id="ex-017"></a>17. Custom Headers - Authentication & More
```typescript
await fetch("https://api.example.com/protected", {
  headers: {
    "Authorization": "Bearer token123",
    "X-API-Key": "secret-key",
    "Content-Type": "application/json"
  }
});
```

### <a id="ex-018"></a>18. Verbose Logging - Debug with curl Output
```typescript
await fetch("https://api.example.com", {
  verbose: "curl" // Shows equivalent curl command
});
```

### <a id="ex-019"></a>19. POST String Data
```typescript
await fetch("https://api.example.com/text", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: "Hello, World!"
});
```

### <a id="ex-020"></a>20. POST JSON Data
```typescript
await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", age: 30 })
});
```

### <a id="ex-021"></a>21. POST FormData
```typescript
const formData = new FormData();
formData.append("username", "john");
formData.append("avatar", new Blob(["image data"]), "avatar.png");

await fetch("https://api.example.com/upload", {
  method: "POST",
  body: formData
});
```

### <a id="ex-022"></a>22. POST ArrayBuffer
```typescript
const buffer = new ArrayBuffer(1024);
const view = new Uint8Array(buffer);
view.fill(42); // Fill with test data

await fetch("https://api.example.com/binary", {
  method: "POST",
  body: buffer
});
```

### <a id="ex-023"></a>23. Streaming Request - Upload Large Data
```typescript
const stream = new ReadableStream({
  async start(controller) {
    for (let i = 0; i < 1000; i++) {
      controller.enqueue(`chunk ${i}\n`);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    controller.close();
  }
});

await fetch("https://api.example.com/stream-upload", {
  method: "POST",
  body: stream
});
```

### <a id="ex-024"></a>24. Proxy (Simple) - Basic HTTP Proxy
```typescript
await fetch("https://api.example.com", {
  proxy: "http://proxy.example.com:8080"
});
```

### <a id="ex-025"></a>25. Proxy (Advanced) - Authenticated Proxy
```typescript
await fetch("https://api.example.com", {
  proxy: {
    url: "http://proxy.example.com:8080",
    headers: {
      "Proxy-Authorization": "Basic " + btoa("user:pass")
    }
  }
});
```

### <a id="ex-026"></a>26. TLS Client Certificate - Mutual TLS
```typescript
await fetch("https://secure-api.example.com", {
  tls: {
    key: Bun.file("client-key.pem"),
    cert: Bun.file("client-cert.pem"),
    rejectUnauthorized: true
  }
});
```

### <a id="ex-027"></a>27. TLS Custom Validation - Custom CA
```typescript
await fetch("https://custom-ca.example.com", {
  tls: {
    ca: Bun.file("custom-ca.pem"),
    rejectUnauthorized: true
  }
});
```

### <a id="ex-028"></a>28. TLS Disable Validation - Development Only
```typescript
// WARNING: Only for development! Not secure for production.
await fetch("https://self-signed.example.com", {
  tls: {
    rejectUnauthorized: false
  }
});
```

### <a id="ex-029"></a>29. Decompression Control - Manual Handling
```typescript
// Disable automatic gzip/deflate decompression
const response = await fetch("https://api.example.com/compressed", {
  decompress: false
});
const compressed = await response.bytes(); // Still compressed data
```

### <a id="ex-030"></a>30. File URL Protocol - Read Local Files
```typescript
const content = await fetch("file:///etc/hostname").then(r => r.text());
console.log(content); // Local hostname
```

### <a id="ex-031"></a>31. Data URL Protocol - Inline Data
```typescript
const text = await fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=").then(r => r.text());
console.log(text); // "Hello World"
```

### <a id="ex-032"></a>32. Blob URL Protocol - In-Memory Objects
```typescript
const blob = new Blob(["Hello from blob"], { type: "text/plain" });
const blobUrl = URL.createObjectURL(blob);
const text = await fetch(blobUrl).then(r => r.text());
URL.revokeObjectURL(blobUrl); // Clean up
```

### <a id="ex-033"></a>33. S3 URL Protocol - Direct S3 Access
```typescript
await fetch("s3://my-bucket/data.json", {
  s3: {
    accessKeyId: "AKIA...",
    secretAccessKey: "secret...",
    region: "us-east-1"
  }
});
```

### <a id="ex-034"></a>34. Unix Domain Socket - Local Socket Communication
```typescript
const response = await fetch("http://localhost/info", {
  unix: "/var/run/docker.sock"
});
const info = await response.json();
```

### <a id="ex-035"></a>35. DNS Cache TTL - Default Behavior
```typescript
// DNS entries are cached for 30 seconds automatically
// No code needed - this is built-in behavior
import { dns } from "bun";
dns.prefetch("api.example.com"); // Cached for 30 seconds
```

### <a id="ex-036"></a>36. Connection Limit - Runtime Configuration
```typescript
// Set via environment variable
// BUN_CONFIG_MAX_HTTP_REQUESTS=512 bun app.ts
// No runtime API available - set at startup
```

### <a id="ex-037"></a>37. Sendfile Threshold - Performance Optimization
```typescript
// Files larger than 32KB automatically use sendfile
const response = await fetch("https://example.com/large-file.dat");
await Bun.write("local.dat", response); // Zero-copy if > 32KB
```

### <a id="ex-038"></a>38. Request Timeout - AbortSignal Integration
```typescript
const response = await fetch("https://api.example.com/slow", {
  signal: AbortSignal.timeout(10000) // 10 second timeout
});
```

### <a id="ex-039"></a>39. Bun.serve() - HTTP Server
```typescript
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response(`Hello from ${req.url}`);
  }
});
console.log(`Server running on ${server.url}`);
```

### <a id="ex-040"></a>40. HTMLRewriter - Transform HTML
```typescript
const response = await fetch("https://example.com");
const transformed = new HTMLRewriter()
  .on("title", {
    element(el) {
      el.setInnerContent("New Title");
    }
  })
  .transform(response);
```

### <a id="ex-041"></a>41. FileSystemRouter - File-based Routing
```typescript
const router = new Bun.FileSystemRouter({
  dir: "./pages",
  style: "nextjs"
});

const route = router.match("/users/123");
if (route) {
  const module = await import(route.filePath);
  // Handle the route
}
```

### <a id="ex-042"></a>42. Bun.connect() - TCP Socket Connection
```typescript
const socket = await Bun.connect({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {
      console.log("Received:", data);
    },
    open(socket) {
      console.log("Connected");
    },
    close(socket) {
      console.log("Disconnected");
    }
  }
});
```

### <a id="ex-043"></a>43. Bun.dns.lookup() - Manual DNS Resolution
```typescript
const ip = await Bun.dns.lookup("google.com");
console.log(ip); // "142.250.191.14" (or current IP)
```

---

## Status Legend

| Status | Description | Stability |
|---|---|---|
| `✅ STABLE` | Production-ready, fully documented | Recommended for all projects |
| `⚠️ BETA` | Available but may change | Use with caution in production |
| `🧪 EXPERIMENTAL` | Early development | Not recommended for production |

---

## Priority Legend

| Priority | Description | Use Case |
|---|---|---|
| `🔴 CRITICAL` | Essential for basic functionality | Core operations, error handling |
| `🟡 IMPORTANT` | Commonly used features | Standard development tasks |
| `🟢 OPTIMIZATION` | Performance enhancements | Speed improvements, efficiency |

---

## Performance Reference Tables

### Response Buffering Methods

| Method | Returns | Performance |
|---|---|---|
| `text()` | `Promise<string>` | Medium |
| `json()` | `Promise<any>` | Medium |
| `formData()` | `Promise<FormData>` | Medium |
| `bytes()` | `Promise<Uint8Array>` | **Fastest** |
| `arrayBuffer()` | `Promise<ArrayBuffer>` | Fast |
| `blob()` | `Promise<Blob>` | Fast |

### Zero-Copy File Uploads (sendfile)

| Condition | Requirement |
|---|---|
| File Size | Must be larger than **32KB** |
| Proxy | Must not be using a proxy |
| macOS | Only regular files (not pipes/sockets) |
| Protocol | Most effective for HTTP (HTTPS requires encryption) |

### Environment Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `BUN_CONFIG_MAX_HTTP_REQUESTS` | `number` | `256` | Max simultaneous HTTP requests. Max hard limit: `65,336` |
| `BUN_PORT` | `number` | `0` (Random) | Port for `bun run` development server |
| `PORT` | `number` | `3000` | Port for development server or `Bun.serve()` |
| `HOST` | `string` | `"localhost"` | Hostname to bind to for dev server |
| `BUN_HOST` | `string` | `"localhost"` | Explicit hostname for `bun run`, overrides `HOST` |
| `BUN_FETCH_PRECONNECT` | `string` | `undefined` | Comma-separated URLs to preconnect at startup (same as `--fetch-preconnect`) |

### Proxy Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `HTTP_PROXY` | `string` | `undefined` | Global proxy URL for HTTP requests |
| `HTTPS_PROXY` | `string` | `undefined` | Global proxy URL for HTTPS requests |
| `ALL_PROXY` | `string` | `undefined` | Fallback proxy URL for any protocol |
| `NO_PROXY` | `string` | `undefined` | Comma-separated hostnames to bypass proxy |

#### Constants

| Constant | Value | Description |
|---|---|---|
| **DNS Cache TTL** | `30 seconds` | Duration DNS queries are cached in memory |
| **`sendfile` Threshold** | `32 KB` | Min file size for zero-copy `sendfile` optimization |
| **Simultaneous Connection Limit** | `256` | Default max concurrent `fetch` requests |
| **Max Connection Hard Limit** | `65,336` | Absolute max for `BUN_CONFIG_MAX_HTTP_REQUESTS` |

---

## Common Errors & Troubleshooting

#### Network Errors

| Error | Cause | Solution |
|---|---|---|
| `ECONNREFUSED` | Server not running or wrong port | Verify server is running on correct port |
| `ETIMEDOUT` | Request timeout | Increase timeout with `AbortSignal.timeout()` |
| `ENOTFOUND` | DNS resolution failed | Check hostname, try `dns.prefetch()` |
| `EHOSTUNREACH` | Network path unreachable | Check network connectivity |
| `ECONNRESET` | Connection reset by peer | Server may have crashed, check server logs |

#### TLS/SSL Errors

| Error | Cause | Solution |
|---|---|---|
| `UNABLE_TO_VERIFY_LEAF_SIGNATURE` | Certificate chain issue | Check TLS certificates |
| `SELF_SIGNED_CERT` | Self-signed certificate | Use `tls: { rejectUnauthorized: false }` (dev only) |
| `CERT_HAS_EXPIRED` | Expired certificate | Update or renew certificate |

### HTTP Status Errors

```typescript
import { fetch } from "bun";

const response = await fetch("https://api.example.com/data");

if (!response.ok) {
  console.error(`HTTP Error: ${response.status} ${response.statusText}`);
  // Handle specific status codes
  if (response.status === 404) {
    console.error("Resource not found");
  } else if (response.status === 500) {
    console.error("Server error");
  }
}
```

### Proxy Errors

```typescript
// Invalid proxy format
await fetch("https://example.com", { proxy: "invalid-proxy-url" });

// Correct proxy format
await fetch("https://example.com", { proxy: "http://proxy:8080" });
```

---

## Node.js Comparison

| Feature | Bun | Node.js |
|---------|-----|---------|
| `fetch()` | Built-in | Requires `node-fetch` or native (v18+) |
| `Response.bytes()` | ✅ Native | ❌ Requires library |
| `dns.prefetch()` | ✅ Native | ❌ Requires dns/promises |
| `dns.getCacheStats()` | ✅ Native | ❌ Not available |
| `fetch.preconnect()` | ✅ Native | ❌ Not available |
| `Bun.write()` | ✅ Native | Requires `fs.writeFile()` |
| Unix sockets | ✅ Native | ✅ Native |
| S3 URLs | ✅ Native | ❌ Requires AWS SDK |
| Automatic decompression | ✅ Yes | Manual (zlib) |
| Connection pooling | ✅ Automatic | Manual (Agent) |
| Streaming | ✅ ReadableStream | ✅ ReadableStream |

### Migration from Node.js

```typescript
// Node.js style
import fetch from "node-fetch";
const response = await fetch(url);
const data = await response.json();

// Bun style (no import needed)
const response = await fetch(url);
const data = await response.json();

// Bun advantages: no package, Response.bytes(), built-in streaming
```

---

## Performance Tips

### 1. Use `Response.bytes()` for Binary Data

```typescript
// Slower
const buffer = await response.arrayBuffer();
const uint8 = new Uint8Array(buffer);

// Faster (Bun-specific)
const bytes = await response.bytes();
```

### 2. Enable Connection Reuse

```typescript
// Don't disable keepalive unnecessarily
await fetch("https://api.example.com", { keepalive: true }); // Default

// Avoid this pattern
await fetch("https://api.example.com", { keepalive: false });
```

### 3. Preconnect for Multiple Requests

```typescript
import { fetch } from "bun";

fetch.preconnect("https://api.example.com");
// Subsequent requests will reuse the connection
await fetch("https://api.example.com/users");
await fetch("https://api.example.com/posts");
```

### 4. Use `Bun.write()` for File Downloads

```typescript
import { write } from "bun";

const response = await fetch("https://example.com/large-file.zip");
await write("/path/to/file.zip", response); // Zero-copy when possible
```

#### Zero-copy File I/O (`sendfile`)
Bun optimizes file transfers using the `sendfile` system call when possible. This allows the kernel to copy data directly from one file descriptor to another without copying it into user-space memory.

**Requirements for Zero-copy:**
- **File Size**: Must be larger than `32KB` (default threshold).
- **No Proxy**: Must not be using an HTTP/HTTPS proxy.
- **Direct Response**: Passing a `Response` object directly to `Bun.write()`.

```typescript
// This triggers zero-copy optimization in Bun 1.x
const res = await fetch("https://example.com/large.dat");
await Bun.write("local.dat", res);
```

### 5. Set Appropriate Timeouts

```typescript
const response = await fetch("https://api.example.com", {
  signal: AbortSignal.timeout(5000) // 5 second timeout
});
```

---

## Quick Examples

### GET Request

```typescript
const response = await fetch("https://api.example.com/data");
const data = await response.json();
```

### POST with JSON

```typescript
const response = await fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Bun", type: "JavaScript" })
});
```

### POST with FormData

```typescript
const formData = new FormData();
formData.append("file", new Blob(["content"]), "test.txt");

const response = await fetch("https://api.example.com/upload", {
  method: "POST",
  body: formData
});
```

### Custom Headers

```typescript
// Multiple header formats supported
const response = await fetch("https://api.example.com/protected", {
  headers: {
    "Authorization": "Bearer token123",
    "X-Custom-Header": "value"
  }
});

// Or using Headers object
const headers = new Headers({
  "Authorization": "Bearer token123",
  "X-Custom-Header": "value"
});
const response2 = await fetch("https://api.example.com/protected", { headers });
```

### Streaming Response

```typescript
const response = await fetch("https://api.example.com/stream");
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}
```

### Abort Long-Running Request

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch("https://api.example.com", {
    signal: controller.signal
  });
  const data = await response.json();
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request was aborted");
  }
} finally {
  clearTimeout(timeout);
}
```

### Unix Domain Socket

```typescript
const response = await fetch("http://localhost/api", {
  unix: "/var/run/docker.sock"
});
```

### Proxy Request

```typescript
const response = await fetch("https://api.example.com", {
  proxy: "http://proxy.example.com:8080"
});
```

---

## DNS Optimization

### Prefetching

Resolve a domain's IP address before initiating the actual network request.

```typescript
import { dns } from "bun";

dns.prefetch("bun.com");
```

**Benefit:** Eliminates DNS lookup waiting time during the critical request path.

### Caching

- **Mechanism:** Bun automatically caches and deduplicates DNS queries in memory
- **TTL:** Cache entries are stored for **30 seconds** by default
- **Stats:** Inspect cache performance

```typescript
import { dns } from "bun";

const stats = dns.getCacheStats();
console.log({
  cacheHitsCompleted: stats.cacheHitsCompleted,
  cacheMisses: stats.cacheMisses,
  size: stats.size,
  totalCount: stats.totalCount,
});
```

---

## Connection Management

### Preconnecting

Prepares the connection before the request is sent. Handles three steps in advance:

1. DNS Lookup
2. TCP Socket Connection
3. TLS Handshake

```typescript
import { fetch } from "bun";

fetch.preconnect("https://bun.com");
```

**Important:** Only beneficial if there's a delay between preconnect and fetch. Calling them sequentially offers no speedup.

### Startup Preconnection

Force preconnection at application startup:

```bash
bun --fetch-preconnect https://bun.com ./my-script.ts
```

**Platform Support:** Not currently implemented on Windows.

### Connection Pooling (Keep-Alive)

- **Behavior:** Bun automatically reuses connections to the same host
- **Benefit:** Reduces overhead of repeatedly establishing TCP/TLS handshakes

```typescript
// Default - connection pooling enabled
await fetch("https://bun.com");

// Disable per-request
await fetch("https://bun.com", { keepalive: false });

// Using header
await fetch("https://bun.com", {
  headers: { "Connection": "close" }
});
```

---

## Limits & Scaling

### Simultaneous Connection Limit

- **Default Limit:** 256 simultaneous `fetch` requests
- **Purpose:** Maintains system stability and encourages connection reuse
- **Queueing:** Requests exceeding the limit are automatically queued

```bash
# Increase limit to 512
BUN_CONFIG_MAX_HTTP_REQUESTS=512 bun ./my-script.ts
```

**Hard Limit:** Maximum allowed value is **65,336** (OS port limit).

---

## Documentation Sources

### Official Bun Documentation

- **Primary**: [bun.sh/docs/api/fetch](https://bun.sh/docs/api/fetch)
- **DNS API**: [bun.sh/docs/api/dns](https://bun.sh/docs/api/dns)
- **File I/O**: [bun.sh/docs/api/file-io](https://bun.sh/docs/api/file-io)

### Local Documentation Files
- **Fetch Reference**: `./FETCH_FEATURES.md` (this file)
- **Server Config**: `./BUN_SERVER_CONFIGURATION.md`
- **Environment Vars**: `./ENVIRONMENT_VARIABLES_REFERENCE.md`
- **Complete Test Matrix**: `./COMPLETE_TEST_MATRIX.md`

### Source Code References
- **Bun Runtime**: `bun-docs-repo/docs/runtime/networking/fetch.mdx`
- **DNS Module**: `bun-docs-repo/docs/api/dns.mdx`
- **File I/O**: `bun-docs-repo/docs/api/file-io.mdx`

### TypeScript Definitions
- **Official Bun Types**: [oven-sh/bun/packages/bun-types](https://github.com/oven-sh/bun/tree/main/packages/bun-types)
- **Fetch Types**: See `fetch.d.ts` in the types package for full WHATWG Fetch compatibility details.

---

## See Also

- [Bun Fetch Documentation](https://bun.com/docs/runtime/networking/fetch)
- [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/)
- [MDN Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Bun DNS Documentation](https://bun.com/docs/api/dns)

The main issues I fixed were:

1. Added missing backticks around code in table cells (like `Environment Variable` names)
2. Ensured all code blocks have proper language specifiers (```typescript, ```bash, etc.)
3. Fixed anchor link formatting
4. Standardized markdown table formatting for consistency
5. Added proper spacing around code blocks
6. Fixed the indentation of code blocks to ensure proper rendering

The document should now render correctly in most markdown viewers and editors.
