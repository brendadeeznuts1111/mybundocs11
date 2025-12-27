
# Bun Fetch API Features Reference - Enhanced Tables

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

### Response Methods

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f1">1</a> | `✅ STABLE` | `🔴 CRITICAL` | **Response.text()** | `charset: string | null`<br>`encoding: "utf-8" | "utf-16" | "ascii"` | HTTP/HTTPS<br>RFC 7231 | `response.text(): Promise<string>` | `string` | [#2](#f2), [#3](#f3) | [ex-001](#ex-001) |
| <a id="f2">2</a> | `✅ STABLE` | `🔴 CRITICAL` | **Response.json()** | `parseMethod: "JSON.parse"`<br>`reviver: (key, value) => any` | HTTP/HTTPS<br>RFC 7159 | `response.json(): Promise<any>` | `any` | [#1](#f1), [#3](#f3) | [ex-001](#ex-001) |
| <a id="f3">3</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.formData()** | `boundary: string`<br>`charset: string` | HTTP/HTTPS<br>RFC 7578 | `response.formData(): Promise<FormData>` | `FormData` | [#1](#f1), [#2](#f2) | [ex-002](#ex-002) |
| <a id="f4">4</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Response.bytes()** | `bufferType: "Uint8Array"`<br>`zeroCopy: boolean` | HTTP/HTTPS<br>Binary Data | `response.bytes(): Promise<Uint8Array>` | `Uint8Array` | [#5](#f5), [#6](#f6) | [ex-004](#ex-004) |
| <a id="f5">5</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.arrayBuffer()** | `byteLength: number`<br>`byteOrder: "big-endian"` | HTTP/HTTPS<br>ArrayBuffer API | `response.arrayBuffer(): Promise<ArrayBuffer>` | `ArrayBuffer` | [#4](#f4), [#6](#f6) | [ex-003](#ex-003) |
| <a id="f6">6</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.blob()** | `type: MIME type`<br>`size: number` | HTTP/HTTPS<br>File API | `response.blob(): Promise<Blob>` | `Blob` | [#4](#f4), [#5](#f5) | [ex-003](#ex-003) |

### File Operations

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f7">7</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.write()** | `fileDescriptor: number`<br>`fileMode: number`<br>`flags: "w" \| "a" \| "x"` | File System<br>POSIX | `Bun.write(path: string \| number \| Blob, data: Blob \| Response): Promise<number>` | [#8](#f8), [#23](#f23) | [ex-004](#ex-004) |
| <a id="f8">8</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Sendfile Optimization** | `sendfileSyscall: true`<br>`zeroCopy: boolean`<br>`threshold: 32768` | HTTP/HTTPS<br>TCP<br>RFC 7230 | `Automatic (no API)` | [#7](#f7), [#37](#f37) | [ex-004](#ex-004) |

### Connection Management

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f9">9</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Prefetch** | `dnsType: "A" \| "AAAA"`<br>`cacheTTL: 30` | DNS<br>RFC 1035 | `dns.prefetch(hostname: string): void` | [#10](#f10), [#35](#f35) | [ex-005](#ex-005) |
| <a id="f10">10</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Cache Stats** | `cacheSize: number`<br>`hits: number`<br>`misses: number` | DNS<br>RFC 1035 | `dns.getCacheStats(): DNSCacheStats` | [#9](#f9), [#35](#f35) | [ex-005](#ex-005) |
| <a id="f11">11</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Preconnect** | `connectionPool: Map<string, Connection>`<br>`preWarm: boolean` | TCP/TLS<br>HTTP/2 | `fetch.preconnect(url: string): void` | [#12](#f12), [#13](#f13) | [ex-006](#ex-006) |
| <a id="f12">12</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Startup Preconnect** | `startupDelay: number`<br>`maxConnections: number` | TCP/TLS<br>HTTP/2 | `--fetch-preconnect <url>` (CLI) | [#11](#f11), [#13](#f13) | [ex-006](#ex-006) |
| <a id="f13">13</a> | `✅ STABLE` | `🔴 CRITICAL` | **Keep-Alive** | `keepAliveTimeout: number`<br>`maxRequests: number` | HTTP/1.1+<br>RFC 7230 | `fetch(url, { keepalive: boolean })` | [#11](#f11), [#12](#f12) | [ex-007](#ex-007) |
| <a id="f14">14</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Connection Limit** | `maxPoolSize: number`<br>`queueSize: number` | TCP<br>HTTP | `BUN_CONFIG_MAX_HTTP_REQUESTS=number` (Env) | [#13](#f13), [#36](#f36) | [ex-007](#ex-007) |

### Request Control

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f15">15</a> | `✅ STABLE` | `🔴 CRITICAL` | **AbortSignal Timeout** | `timeoutMs: number`<br>`autoAbort: boolean` | Event API<br>WHATWG | `AbortSignal.timeout(ms: number): AbortSignal` | [#16](#f16), [#38](#f38) | [ex-008](#ex-008) |
| <a id="f16">16</a> | `✅ STABLE` | `🔴 CRITICAL` | **AbortController** | `signal: AbortSignal`<br>`aborted: boolean` | Event API<br>WHATWG | `new AbortController(): AbortController` | [#15](#f15), [#38](#f38) | [ex-008](#ex-008) |
| <a id="f17">17</a> | `✅ STABLE` | `🔴 CRITICAL` | **Custom Headers** | `headerMap: Map<string, string>`<br>`caseSensitive: boolean` | HTTP<br>RFC 7230 | `fetch(url, { headers: HeadersInit })` | [#18](#f18), [#20](#f20) | [ex-009](#ex-009) |
| <a id="f18">18</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Verbose Logging** | `logLevel: "curl" \| boolean`<br>`timing: boolean` | HTTP Debug<br>CURL CLI | `fetch(url, { verbose: boolean \| "curl" })` | [#17](#f17) | [ex-010](#ex-010) |

### POST Methods

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f19">19</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST String** | `contentType: "text/plain"`<br>`charset: "utf-8"` | HTTP<br>RFC 7231 | `fetch(url, { method: "POST", body: string })` | [#17](#f17), [#20](#f20) | [ex-011](#ex-011) |
| <a id="f20">20</a> | `✅ STABLE` | `🔴 CRITICAL` | **POST JSON** | `contentType: "application/json"`<br>`stringify: boolean` | HTTP<br>RFC 7159 | `fetch(url, { method: "POST", body: object })` | [#17](#f17), [#19](#f19) | [ex-011](#ex-011) |
| <a id="f21">21</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST FormData** | `contentType: "multipart/form-data"`<br>`boundary: string` | HTTP<br>RFC 7578 | `fetch(url, { method: "POST", body: FormData })` | [#17](#f17), [#19](#f19) | [ex-012](#ex-012) |
| <a id="f22">22</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST ArrayBuffer** | `contentType: "application/octet-stream"`<br>`byteLength: number` | HTTP<br>Binary Data | `fetch(url, { method: "POST", body: ArrayBuffer })` | [#17](#f17), [#19](#f19) | [ex-013](#ex-013) |
| <a id="f23">23</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Streaming Request** | `contentType: "application/octet-stream"`<br>`chunked: boolean` | HTTP/1.1<br>RFC 7230 | `fetch(url, { body: ReadableStream })` | [#7](#f7), [#8](#f8) | [ex-014](#ex-014) |

### Advanced Options

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f24">24</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Proxy (Simple)** | `proxyType: "http" \| "https"`<br>`auth: string \| null` | HTTP Proxy<br>RFC 7230 | `fetch(url, { proxy: string })` | [#25](#f25) | [ex-015](#ex-015) |
| <a id="f25">25</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Proxy (Advanced)** | `proxyType: "http" \| "https" \| "socks5"`<br>`headers: HeadersInit` | HTTP Proxy<br>SOCKS5 | `fetch(url, { proxy: object })` | [#24](#f24) | [ex-015](#ex-015) |
| <a id="f26">26</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Client Cert** | `certType: "pem" \| "der"`<br>`keyType: "pem" \| "der"` | TLS 1.2+<br>RFC 8446 | `fetch(url, { tls: object })` | [#27](#f27) | [ex-016](#ex-016) |
| <a id="f27">27</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Custom Validation** | `caType: "pem" \| "der"`<br>`verifyDepth: number` | TLS<br>X.509 | `fetch(url, { tls: object })` | [#26](#f26) | [ex-016](#ex-016) |
| <a id="f28">28</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Disable Validation** | `rejectUnauthorized: false`<br>`selfSigned: true` | TLS<br>Development | `fetch(url, { tls: object })` | [#26](#f26) | [ex-016](#ex-016) |
| <a id="f29">29</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Decompression Control** | `algorithms: "gzip" \| "deflate" \| "br"`<br>`auto: boolean` | HTTP<br>RFC 7230 | `fetch(url, { decompress: boolean })` | [#24](#f24) | [ex-017](#ex-017) |

### URL Protocols

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f30">30</a> | `✅ STABLE` | `🟡 IMPORTANT` | **File URL** | `scheme: "file://"`<br>`path: string` | File URI<br>RFC 8089 | `fetch("file:///path")` | [#7](#f7) | [ex-018](#ex-018) |
| <a id="f31">31</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Data URL** | `scheme: "data:"`<br>`mimeType: string`<br>`base64: boolean` | Data URI<br>RFC 2397 | `fetch("data:...")` | [#32](#f32) | [ex-019](#ex-019) |
| <a id="f32">32</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Blob URL** | `scheme: "blob:"`<br>`origin: string`<br>`uuid: string` | Blob URI<br>WHATWG | `fetch(blobUrl)` | [#31](#f31) | [ex-020](#ex-020) |
| <a id="f33">33</a> | `✅ STABLE` | `🟡 IMPORTANT` | **S3 URL** | `scheme: "s3://"`<br>`bucket: string`<br>`region: string` | AWS S3<br>REST API | `fetch("s3://...", { s3: object })` | [#23](#f23) | [ex-021](#ex-021) |
| <a id="f34">34</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Unix Domain Socket** | `scheme: "unix:"`<br>`socketPath: string` | Unix Socket<br>POSIX | `fetch(url, { unix: string })` | [#11](#f11) | [ex-022](#ex-022) |

### Environment & Limits

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f35">35</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Cache TTL** | `ttlSeconds: 30`<br>`maxEntries: number` | DNS<br>RFC 1035 | `30 seconds (default)` | [#9](#f9) | [ex-005](#ex-005) |
| <a id="f36">36</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Connection Limit** | `maxRequests: 256`<br>`queueLimit: number` | TCP<br>HTTP | `BUN_CONFIG_MAX_HTTP_REQUESTS` | [#14](#f14) | [ex-007](#ex-007) |
| <a id="f37">37</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Sendfile Threshold** | `thresholdBytes: 32768`<br>`enabled: boolean` | TCP<br>System Call | `32KB (default)` | [#8](#f8) | [ex-004](#ex-004) |
| <a id="f38">38</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Request Timeout** | `timeoutMs: number`<br>`abortOnTimeout: boolean` | Event API<br>WHATWG | `AbortSignal.timeout(ms)` | [#15](#f15) | [ex-008](#ex-008) |

### Related Networking APIs

| # | Status | Priority | Feature | Type Properties | Protocol | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|
| <a id="f39">39</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.serve()** | `serverType: "http" \| "https"`<br>`maxBodySize: number` | HTTP/1.1<br>HTTP/2 | `Bun.serve({ fetch(req) })` | [#20](#f20) | [ex-023](#ex-023) |
| <a id="f40">40</a> | `✅ STABLE` | `🟡 IMPORTANT` | **HTMLRewriter** | `selector: string`<br>`handlerType: "element" \| "text"` | HTML5<br>DOM API | `new HTMLRewriter().transform(res)` | [#1](#f1) | [ex-024](#ex-024) |
| <a id="f41">41</a> | `✅ STABLE` | `🟡 IMPORTANT` | **FileSystemRouter** | `fileExt: ".ts" \| ".js"`<br>`routeStyle: "nextjs" \| "sveltekit"` | File System<br>URL Routing | `new Bun.FileSystemRouter(opts)` | [#39](#f39) | [ex-025](#ex-025) |
| <a id="f42">42</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.connect()** | `socketType: "tcp" \| "tls" \| "unix"`<br>`keepAlive: boolean` | TCP/TLS<br>Socket API | `Bun.connect(opts)` | [#34](#f34) | [ex-026](#ex-026) |
| <a id="f43">43</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.dns.lookup()** | `recordType: "A" \| "AAAA" \| "CNAME"`<br>`ttl: number` | DNS<br>RFC 1035 | `Bun.dns.lookup(host)` | [#9](#f9) | [ex-027](#ex-027) |

---

## Protocol Reference Legend

### Network Protocols
| Protocol | Standards | Port | Description |
|----------|-----------|------|-------------|
| **HTTP/HTTPS** | RFC 7230-7235 | 80/443 | Hypertext Transfer Protocol |
| **TCP** | RFC 793 | Various | Transmission Control Protocol |
| **TLS** | RFC 8446 | 443 | Transport Layer Security (1.2+) |
| **DNS** | RFC 1035 | 53 | Domain Name System |
| **File URI** | RFC 8089 | N/A | File system access via URI |
| **Data URI** | RFC 2397 | N/A | Inline data embedding |
| **Unix Socket** | POSIX | N/A | Inter-process communication |

### API Protocols
| Protocol Type | Standards | Implementation |
|---------------|-----------|----------------|
| **WHATWG** | Fetch, Streams, URL | Web standard APIs |
| **POSIX** | IEEE 1003.1 | Unix system calls |
| **File API** | W3C | Blob, File interfaces |
| **DOM API** | W3C | HTML/DOM manipulation |
| **System Call** | OS-specific | Kernel-level operations |

### AWS Protocols
| Protocol | Standards | Port | Description |
|----------|-----------|------|-------------|
| **S3** | REST API | 443 | Simple Storage Service |
| **AWS Signature** | v4 | N/A | Authentication scheme |

---

## Type Properties Reference

### Data Type Properties
| Property | Values | Description |
|----------|--------|-------------|
| **contentType** | MIME types | Content-Type header value |
| **charset** | "utf-8", "ascii", etc. | Character encoding |
| **bufferType** | "Uint8Array", "ArrayBuffer" | Binary data container |
| **byteLength** | number | Size in bytes |
| **cacheTTL** | seconds | Time-to-live in cache |
| **timeoutMs** | milliseconds | Timeout duration |
| **fileMode** | octal (e.g., 0o644) | Unix file permissions |
| **scheme** | "http://", "file://", etc. | URL scheme/protocol |

### Network Properties
| Property | Values | Description |
|----------|--------|-------------|
| **proxyType** | "http", "https", "socks5" | Proxy protocol |
| **dnsType** | "A", "AAAA", "CNAME" | DNS record type |
| **certType** | "pem", "der" | Certificate format |
| **socketType** | "tcp", "tls", "unix" | Socket type |
| **keepAlive** | boolean | Connection reuse |
| **zeroCopy** | boolean | Zero-copy optimization |

### Performance Properties
| Property | Values | Description |
|----------|--------|-------------|
| **threshold** | bytes | Minimum size for optimization |
| **maxRequests** | number | Maximum concurrent requests |
| **queueSize** | number | Request queue limit |
| **cacheSize** | number | Cache entry count |

---

## Protocol-Specific Details

### HTTP/HTTPS Protocol Stack
```
┌─────────────────────────────────┐
│         Application Layer        │
│  ┌─────────────────────────┐    │
│  │       Bun Fetch API      │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│         Transport Layer         │
│  ┌─────────────────────────┐    │
│  │  TCP/TLS (keep-alive)   │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│          Network Layer          │
│  ┌─────────────────────────┐    │
│  │    IP + DNS (prefetch)   │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### File Protocol Flow
```
Bun.fetch("file:///path")
    → File System Driver
    → POSIX open()/read()
    → Return as Response
    → Bun.write() [sendfile optimization]
```

### S3 Protocol Integration
```
Bun.fetch("s3://bucket/key")
    → AWS Signature v4
    → HTTPS to S3 endpoint
    → Streaming response
    → Automatic retry on failure
```

### Unix Socket Communication
```
Bun.fetch("http://localhost/", {unix: "/path"})
    → Unix domain socket
    → Local IPC (no network stack)
    → Docker API, system daemons
```

---

## Type Safety Matrix

### Response Methods Type Safety
| Method | Type Guard | Runtime Validation | Error Handling |
|--------|------------|-------------------|----------------|
| `text()` | `string` | Content-Type check | Throws on binary |
| `json()` | `any` | JSON.parse validation | SyntaxError on invalid JSON |
| `bytes()` | `Uint8Array` | Buffer allocation check | MemoryError on OOM |
| `blob()` | `Blob` | MIME type parsing | TypeError on invalid type |

### Network Operations Type Safety
| Operation | Input Validation | Output Guarantee | Error Recovery |
|-----------|-----------------|------------------|----------------|
| DNS Prefetch | Hostname format | Cache population | Silent fail on error |
| TCP Connect | Port range | Socket descriptor | ECONNREFUSED |
| TLS Handshake | Certificate chain | Encrypted channel | CertificateError |
| HTTP Keep-alive | Connection pool | Reused socket | Timeout reset |

### File Operations Type Safety
| Operation | Permission Check | Resource Management | Error Codes |
|-----------|------------------|---------------------|-------------|
| `Bun.write()` | File mode bits | FD auto-close | EACCES, ENOENT |
| Sendfile | File size check | Kernel buffer | EBADF, EINVAL |
| File URL | Path traversal | Symlink resolution | ELOOP, ENAMETOOLONG |

---

## Cross-Protocol Compatibility

### Protocol Conversion Matrix
| Source Protocol | Target Protocol | Conversion Method | Data Integrity |
|-----------------|-----------------|-------------------|----------------|
| **file://** → **HTTP** | Read file as body | Stream chunking | 100% (byte-for-byte) |
| **data:** → **Blob** | Base64 decode | Memory copy | 100% (exact match) |
| **HTTP** → **file://** | Response writing | sendfile() syscall | 100% (checksum) |
| **S3** → **HTTP** | REST API proxy | Stream pipe | 100% (multipart) |

### Network Stack Integration
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   HTTP/1.1  │ ←→ │   HTTP/2    │ ←→ │   QUIC      │
│   RFC 7230  │    │   RFC 7540  │    │   RFC 9000  │
└─────────────┘    └─────────────┘    └─────────────┘
        ↓                  ↓                  ↓
┌──────────────────────────────────────────────────┐
│            Bun Transport Layer (TCP/TLS)          │
└──────────────────────────────────────────────────┘
        ↓                  ↓                  ↓
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   IPv4/IPv6  │    │     DNS     │    │   mDNS     │
│   RFC 791    │    │   RFC 1035  │    │   RFC 6762 │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Security Protocol Stack
```
┌─────────────────────────────────────────┐
│         Application Security             │
│  • CORS headers                         │
│  • Content Security Policy              │
│  • Rate limiting                        │
└─────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│         Transport Security               │
│  • TLS 1.2/1.3 (RFC 8446)               │
│  • Certificate pinning                   │
│  • Perfect forward secrecy              │
└─────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│         Network Security                 │
│  • DNS over HTTPS/TLS                   │
│  • IP whitelisting                      │
│  • VPN/proxy tunneling                  │
└─────────────────────────────────────────┘
```

---

## Performance Characteristics by Protocol

### Latency Comparison
| Protocol | Average Latency | Connection Overhead | Best Use Case |
|----------|----------------|---------------------|---------------|
| **Unix Socket** | <1ms | None | Local IPC, Docker API |
| **File URI** | <5ms | File I/O | Local file access |
| **HTTP/2** | 10-50ms | TLS handshake | Web APIs, multiplexing |
| **HTTP/1.1** | 20-100ms | TCP handshake | Legacy systems |
| **S3** | 50-200ms | AWS signature | Cloud storage |
| **DNS** | 10-100ms | Cache lookup | Hostname resolution |

### Throughput Comparison
| Protocol | Max Throughput | Bottleneck | Optimization |
|----------|----------------|------------|--------------|
| **Unix Socket** | 10+ Gbps | Memory copy | Zero-copy sendfile |
| **File URI** | 5+ Gbps | Disk I/O | Direct I/O, async |
| **HTTP/2** | 1-5 Gbps | TLS encryption | Session resumption |
| **S3** | 500 Mbps - 5 Gbps | Network | Multipart upload |

### Memory Usage by Protocol
| Protocol | Per-Connection | Buffer Size | Pooling |
|----------|----------------|-------------|---------|
| **Unix Socket** | 4KB | 16KB | Connection pool |
| **HTTP** | 16KB | 64KB | Keep-alive pool |
| **TLS** | 32KB | 16KB | Session cache |
| **S3** | 64KB | 256KB | Request pool |

---

## Error Handling Matrix

### Protocol-Specific Errors
| Protocol | Common Errors | Recovery Strategy | Bun-specific Handling |
|----------|--------------|-------------------|----------------------|
| **HTTP/HTTPS** | 404, 500, timeout | Retry, fallback | Auto-retry with backoff |
| **DNS** | NXDOMAIN, timeout | Cache, fallback DNS | Prefetch with TTL |
| **TLS** | CERT_EXPIRED, HANDSHAKE | Certificate update | Custom CA bundle |
| **File URI** | ENOENT, EACCES | Permission check | File descriptor reuse |
| **S3** | AccessDenied, NoSuchKey | Credential refresh | Automatic region detection |

### Type Conversion Errors
| Conversion | Potential Error | Validation | Fallback |
|------------|-----------------|------------|----------|
| JSON → Object | SyntaxError, Cyclic | JSON.parse reviver | Safe parsing |
| Text → String | Invalid UTF-8 | BOM detection | Replacement chars |
| Binary → Blob | OOM, truncation | Size limit check | Stream chunking |
| FormData → Object | Boundary missing | Multipart parsing | Fallback encoding |

### Network Error Recovery
| Error Type | Detection | Automatic Recovery | Manual Intervention |
|------------|-----------|-------------------|---------------------|
| Connection reset | ECONNRESET | Reconnect with delay | Check server status |
| Timeout | ETIMEDOUT | Exponential backoff | Increase timeout |
| DNS failure | ENOTFOUND | Alternate DNS server | Check network config |
| TLS handshake | HandshakeError | Protocol downgrade | Update certificates |

---

## Best Practices by Protocol

### HTTP/HTTPS Best Practices
```typescript
// 1. Use connection pooling
await fetch(url, { keepalive: true });

// 2. Enable HTTP/2 when available
await fetch(url, { http2: true });

// 3. Set appropriate timeouts
await fetch(url, { signal: AbortSignal.timeout(5000) });

// 4. Use compression
await fetch(url, { compress: true });

// 5. Cache DNS lookups
dns.prefetch(hostname);
```

### File Protocol Best Practices
```typescript
// 1. Use absolute paths
await fetch(`file://${path.resolve('./file.txt')}`);

// 2. Check permissions before access
try {
  await Bun.file(path).text();
} catch (error) {
  // Handle permission errors
}

// 3. Use streaming for large files
const stream = Bun.file('large.txt').stream();
```

### S3 Protocol Best Practices
```typescript
// 1. Use multipart uploads for large files
await fetch('s3://bucket/large-file', {
  method: 'PUT',
  s3: { multipart: true }
});

// 2. Enable server-side encryption
await fetch('s3://bucket/secure-file', {
  s3: { serverSideEncryption: 'AES256' }
});

// 3. Use presigned URLs for security
const url = await generatePresignedS3Url();
```

### Unix Socket Best Practices
```typescript
// 1. Check socket existence
try {
  await Bun.file('/var/run/docker.sock').exists();
} catch {
  // Docker not running
}

// 2. Use appropriate permissions
// Ensure user has access to socket file

// 3. Handle connection limits
// Unix sockets have OS-level connection limits
```

---

## Protocol Testing Matrix

### Test Coverage by Protocol
| Protocol | Unit Tests | Integration Tests | Performance Tests |
|----------|------------|-------------------|-------------------|
| HTTP/HTTPS | ✅ Headers, body parsing | ✅ Proxy, redirects | ✅ Throughput, latency |
| DNS | ✅ Cache, prefetch | ✅ Multiple resolvers | ✅ Lookup speed |
| TLS | ✅ Cert validation | ✅ Handshake negotiation | ✅ Encryption overhead |
| File URI | ✅ Path resolution | ✅ Permission checks | ✅ I/O throughput |
| S3 | ✅ Signature v4 | ✅ Multipart uploads | ✅ Bandwidth usage |
| Unix Socket | ✅ IPC communication | ✅ Daemon integration | ✅ Latency |

### Compatibility Testing
| Protocol Combination | Test Scenario | Expected Behavior |
|----------------------|---------------|-------------------|
| HTTP → File | Download to local file | sendfile optimization |
| File → HTTP | Upload local file | Chunked transfer encoding |
| HTTPS → S3 | Secure cloud storage | TLS termination at S3 |
| Unix → HTTP | Docker API proxy | Socket to HTTP conversion |
| DNS → HTTP | Hostname resolution | Cached DNS for HTTP |

### Security Testing
| Protocol | Test Category | Security Controls |
|----------|--------------|-------------------|
| TLS | Certificate validation | CA bundle, pinning |
| HTTP | Injection prevention | Headers, sanitization |
| File URI | Path traversal | Normalization, checks |
| S3 | Access control | IAM policies, bucket policies |
| Unix Socket | Permission checks | User/group validation |

This enhanced table structure provides:
1. **Type Properties** - Technical characteristics and implementation details
2. **Protocol** - Standards compliance and protocol stack information
3. **Cross-referencing** - Relationships between different features
4. **Performance characteristics** - Latency, throughput, and optimization details
5. **Error handling** - Protocol-specific error recovery strategies

The enhanced tables now provide a comprehensive technical reference for developers working with Bun's Fetch API across different protocols and use cases.
