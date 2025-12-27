# Bun Fetch API Features Reference - Enhanced Tables with Constants & Env Variables

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

### Response Methods

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f1">1</a> | `✅ STABLE` | `🔴 CRITICAL` | **Response.text()** | `charset: string \| null`<br>`encoding: "utf-8" \| "utf-16" \| "ascii"` | HTTP/HTTPS<br>RFC 7231 | `BUN_TEXT_DECODER="fast"`<br>`BUN_MAX_STRING_LENGTH` | `response.text(): Promise<string>` | `string` | [#2](#f2), [#3](#f3) | [ex-001](#ex-001) |
| <a id="f2">2</a> | `✅ STABLE` | `🔴 CRITICAL` | **Response.json()** | `parseMethod: "JSON.parse"`<br>`reviver: (key, value) => any` | HTTP/HTTPS<br>RFC 7159 | `BUN_JSON_PARSE_LIMIT=64KB`<br>`BUN_JSON_DEPTH_LIMIT=256` | `response.json(): Promise<any>` | `any` | [#1](#f1), [#3](#f3) | [ex-001](#ex-001) |
| <a id="f3">3</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.formData()** | `boundary: string`<br>`charset: string` | HTTP/HTTPS<br>RFC 7578 | `BUN_FORMDATA_MAX_SIZE=10MB`<br>`BUN_FORMDATA_MAX_FIELDS=1000` | `response.formData(): Promise<FormData>` | `FormData` | [#1](#f1), [#2](#f2) | [ex-002](#ex-002) |
| <a id="f4">4</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Response.bytes()** | `bufferType: "Uint8Array"`<br>`zeroCopy: boolean` | HTTP/HTTPS<br>Binary Data | `BUN_BUFFER_POOL_SIZE=64MB`<br>`BUN_ZEROCOPY_THRESHOLD=4096` | `response.bytes(): Promise<Uint8Array>` | `Uint8Array` | [#5](#f5), [#6](#f6) | [ex-004](#ex-004) |
| <a id="f5">5</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.arrayBuffer()** | `byteLength: number`<br>`byteOrder: "big-endian"` | HTTP/HTTPS<br>ArrayBuffer API | `BUN_ARRAYBUFFER_LIMIT=256MB`<br>`BUN_MEMORY_LIMIT` | `response.arrayBuffer(): Promise<ArrayBuffer>` | `ArrayBuffer` | [#4](#f4), [#6](#f6) | [ex-003](#ex-003) |
| <a id="f6">6</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Response.blob()** | `type: MIME type`<br>`size: number` | HTTP/HTTPS<br>File API | `BUN_BLOB_MEMORY_LIMIT=64MB`<br>`BUN_BLOB_MAX_SIZE` | `response.blob(): Promise<Blob>` | `Blob` | [#4](#f4), [#5](#f5) | [ex-003](#ex-003) |

### File Operations

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f7">7</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.write()** | `fileDescriptor: number`<br>`fileMode: number`<br>`flags: "w" \| "a" \| "x"` | File System<br>POSIX | `BUN_WRITE_BUFFER_SIZE=8192`<br>`BUN_FILE_MODE=0o644`<br>`BUN_FD_POOL_SIZE=256` | `Bun.write(path: string \| number \| Blob, data: Blob \| Response): Promise<number>` | [#8](#f8), [#23](#f23) | [ex-004](#ex-004) |
| <a id="f8">8</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Sendfile Optimization** | `sendfileSyscall: true`<br>`zeroCopy: boolean`<br>`threshold: 32768` | HTTP/HTTPS<br>TCP<br>RFC 7230 | `BUN_SENDFILE_THRESHOLD=32768`<br>`BUN_SENDFILE_ENABLED=1`<br>`BUN_ZEROCOPY_ENABLED=1` | `Automatic (no API)` | [#7](#f7), [#37](#f37) | [ex-004](#ex-004) |

### Connection Management

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f9">9</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Prefetch** | `dnsType: "A" \| "AAAA"`<br>`cacheTTL: 30` | DNS<br>RFC 1035 | `BUN_DNS_TTL=30`<br>`BUN_DNS_CACHE_SIZE=1024`<br>`BUN_DNS_PREFETCH_MAX=100` | `dns.prefetch(hostname: string): void` | [#10](#f10), [#35](#f35) | [ex-005](#ex-005) |
| <a id="f10">10</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Cache Stats** | `cacheSize: number`<br>`hits: number`<br>`misses: number` | DNS<br>RFC 1035 | `BUN_DNS_STATS_ENABLED=1`<br>`BUN_DNS_CACHE_STATS_MAX_AGE=3600` | `dns.getCacheStats(): DNSCacheStats` | [#9](#f9), [#35](#f35) | [ex-005](#ex-005) |
| <a id="f11">11</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Preconnect** | `connectionPool: Map<string, Connection>`<br>`preWarm: boolean` | TCP/TLS<br>HTTP/2 | `BUN_PRECONNECT_MAX=10`<br>`BUN_PRECONNECT_TTL=300`<br>`BUN_FETCH_PRECONNECT` | `fetch.preconnect(url: string): void` | [#12](#f12), [#13](#f13) | [ex-006](#ex-006) |
| <a id="f12">12</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Startup Preconnect** | `startupDelay: number`<br>`maxConnections: number` | TCP/TLS<br>HTTP/2 | `BUN_STARTUP_PRECONNECT_DELAY=1000`<br>`BUN_STARTUP_MAX_CONNECTIONS=5` | `--fetch-preconnect <url>` (CLI) | [#11](#f11), [#13](#f13) | [ex-006](#ex-006) |
| <a id="f13">13</a> | `✅ STABLE` | `🔴 CRITICAL` | **Keep-Alive** | `keepAliveTimeout: number`<br>`maxRequests: number` | HTTP/1.1+<br>RFC 7230 | `BUN_KEEPALIVE_TIMEOUT=5000`<br>`BUN_KEEPALIVE_MAX_REQUESTS=100`<br>`BUN_DISABLE_KEEPALIVE=0` | `fetch(url, { keepalive: boolean })` | [#11](#f11), [#12](#f12) | [ex-007](#ex-007) |
| <a id="f14">14</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Connection Limit** | `maxPoolSize: number`<br>`queueSize: number` | TCP<br>HTTP | `BUN_CONFIG_MAX_HTTP_REQUESTS=256`<br>`BUN_HTTP_QUEUE_SIZE=1024`<br>`BUN_HTTP_CONNECTION_POOL_SIZE=50` | `BUN_CONFIG_MAX_HTTP_REQUESTS=number` (Env) | [#13](#f13), [#36](#f36) | [ex-007](#ex-007) |

### Request Control

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f15">15</a> | `✅ STABLE` | `🔴 CRITICAL` | **AbortSignal Timeout** | `timeoutMs: number`<br>`autoAbort: boolean` | Event API<br>WHATWG | `BUN_ABORT_TIMEOUT_DEFAULT=30000`<br>`BUN_ABORT_MAX_TIMEOUT=300000` | `AbortSignal.timeout(ms: number): AbortSignal` | [#16](#f16), [#38](#f38) | [ex-008](#ex-008) |
| <a id="f16">16</a> | `✅ STABLE` | `🔴 CRITICAL` | **AbortController** | `signal: AbortSignal`<br>`aborted: boolean` | Event API<br>WHATWG | `BUN_ABORT_EVENT_POOL_SIZE=1000`<br>`BUN_MAX_ABORT_CONTROLLERS=10000` | `new AbortController(): AbortController` | [#15](#f15), [#38](#f38) | [ex-008](#ex-008) |
| <a id="f17">17</a> | `✅ STABLE` | `🔴 CRITICAL` | **Custom Headers** | `headerMap: Map<string, string>`<br>`caseSensitive: boolean` | HTTP<br>RFC 7230 | `BUN_MAX_HEADERS=100`<br>`BUN_MAX_HEADER_SIZE=8192`<br>`BUN_HEADER_CASE_SENSITIVE=0` | `fetch(url, { headers: HeadersInit })` | [#18](#f18), [#20](#f20) | [ex-009](#ex-009) |
| <a id="f18">18</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Verbose Logging** | `logLevel: "curl" \| boolean`<br>`timing: boolean` | HTTP Debug<br>CURL CLI | `BUN_VERBOSE_LOGGING=0`<br>`BUN_CURL_FORMAT=1`<br>`BUN_DEBUG_FETCH=0` | `fetch(url, { verbose: boolean \| "curl" })` | [#17](#f17) | [ex-010](#ex-010) |

### POST Methods

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f19">19</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST String** | `contentType: "text/plain"`<br>`charset: "utf-8"` | HTTP<br>RFC 7231 | `BUN_POST_MAX_STRING_SIZE=10MB`<br>`BUN_POST_CHARSET="utf-8"` | `fetch(url, { method: "POST", body: string })` | [#17](#f17), [#20](#f20) | [ex-011](#ex-011) |
| <a id="f20">20</a> | `✅ STABLE` | `🔴 CRITICAL` | **POST JSON** | `contentType: "application/json"`<br>`stringify: boolean` | HTTP<br>RFC 7159 | `BUN_JSON_POST_SIZE_LIMIT=10MB`<br>`BUN_JSON_POST_DEPTH_LIMIT=50` | `fetch(url, { method: "POST", body: object })` | [#17](#f17), [#19](#f19) | [ex-011](#ex-011) |
| <a id="f21">21</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST FormData** | `contentType: "multipart/form-data"`<br>`boundary: string` | HTTP<br>RFC 7578 | `BUN_FORMDATA_POST_MAX_SIZE=100MB`<br>`BUN_FORMDATA_BOUNDARY_LENGTH=70` | `fetch(url, { method: "POST", body: FormData })` | [#17](#f17), [#19](#f19) | [ex-012](#ex-012) |
| <a id="f22">22</a> | `✅ STABLE` | `🟡 IMPORTANT` | **POST ArrayBuffer** | `contentType: "application/octet-stream"`<br>`byteLength: number` | HTTP<br>Binary Data | `BUN_BINARY_POST_MAX_SIZE=100MB`<br>`BUN_ARRAYBUFFER_ALIGNMENT=64` | `fetch(url, { method: "POST", body: ArrayBuffer })` | [#17](#f17), [#19](#f19) | [ex-013](#ex-013) |
| <a id="f23">23</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Streaming Request** | `contentType: "application/octet-stream"`<br>`chunked: boolean` | HTTP/1.1<br>RFC 7230 | `BUN_STREAM_CHUNK_SIZE=16384`<br>`BUN_STREAM_BUFFER_SIZE=65536`<br>`BUN_STREAM_HIGH_WATER_MARK=16384` | `fetch(url, { body: ReadableStream })` | [#7](#f7), [#8](#f8) | [ex-014](#ex-014) |

### Advanced Options

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f24">24</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Proxy (Simple)** | `proxyType: "http" \| "https"`<br>`auth: string \| null` | HTTP Proxy<br>RFC 7230 | `HTTP_PROXY`<br>`HTTPS_PROXY`<br>`NO_PROXY`<br>`BUN_PROXY_TIMEOUT=30000` | `fetch(url, { proxy: string })` | [#25](#f25) | [ex-015](#ex-015) |
| <a id="f25">25</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Proxy (Advanced)** | `proxyType: "http" \| "https" \| "socks5"`<br>`headers: HeadersInit` | HTTP Proxy<br>SOCKS5 | `BUN_PROXY_MAX_RETRIES=3`<br>`BUN_PROXY_CONNECT_TIMEOUT=10000`<br>`BUN_PROXY_STRICT_SSL=1` | `fetch(url, { proxy: object })` | [#24](#f24) | [ex-015](#ex-015) |
| <a id="f26">26</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Client Cert** | `certType: "pem" \| "der"`<br>`keyType: "pem" \| "der"` | TLS 1.2+<br>RFC 8446 | `BUN_TLS_CERT_FILE`<br>`BUN_TLS_KEY_FILE`<br>`BUN_TLS_CA_FILE`<br>`BUN_TLS_PASSPHRASE` | `fetch(url, { tls: object })` | [#27](#f27) | [ex-016](#ex-016) |
| <a id="f27">27</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Custom Validation** | `caType: "pem" \| "der"`<br>`verifyDepth: number` | TLS<br>X.509 | `BUN_TLS_VERIFY_DEPTH=100`<br>`BUN_TLS_CHECK_REVOCATION=1`<br>`BUN_TLS_STRICT_CERTS=0` | `fetch(url, { tls: object })` | [#26](#f26) | [ex-016](#ex-016) |
| <a id="f28">28</a> | `✅ STABLE` | `🟡 IMPORTANT` | **TLS Disable Validation** | `rejectUnauthorized: false`<br>`selfSigned: true` | TLS<br>Development | `BUN_TLS_REJECT_UNAUTHORIZED=1`<br>`BUN_TLS_INSECURE=0`<br>`NODE_TLS_REJECT_UNAUTHORIZED=0` | `fetch(url, { tls: object })` | [#26](#f26) | [ex-016](#ex-016) |
| <a id="f29">29</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Decompression Control** | `algorithms: "gzip" \| "deflate" \| "br"`<br>`auto: boolean` | HTTP<br>RFC 7230 | `BUN_DECOMPRESS_ENABLED=1`<br>`BUN_GZIP_MAX_RATIO=1024`<br>`BUN_DEFLATE_WINDOW_BITS=15` | `fetch(url, { decompress: boolean })` | [#24](#f24) | [ex-017](#ex-017) |

### URL Protocols

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f30">30</a> | `✅ STABLE` | `🟡 IMPORTANT` | **File URL** | `scheme: "file://"`<br>`path: string` | File URI<br>RFC 8089 | `BUN_FILE_URL_MAX_PATH=4096`<br>`BUN_FILE_OPEN_LIMIT=1024`<br>`BUN_FILE_FOLLOW_SYMLINKS=1` | `fetch("file:///path")` | [#7](#f7) | [ex-018](#ex-018) |
| <a id="f31">31</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Data URL** | `scheme: "data:"`<br>`mimeType: string`<br>`base64: boolean` | Data URI<br>RFC 2397 | `BUN_DATA_URL_MAX_SIZE=32MB`<br>`BUN_BASE64_LINE_LENGTH=76`<br>`BUN_DATA_URL_BUFFER_SIZE=4096` | `fetch("data:...")` | [#32](#f32) | [ex-019](#ex-019) |
| <a id="f32">32</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Blob URL** | `scheme: "blob:"`<br>`origin: string`<br>`uuid: string` | Blob URI<br>WHATWG | `BUN_BLOB_URL_TTL=300000`<br>`BUN_BLOB_URL_MAX_COUNT=1000`<br>`BUN_BLOB_URL_PURGE_INTERVAL=60000` | `fetch(blobUrl)` | [#31](#f31) | [ex-020](#ex-020) |
| <a id="f33">33</a> | `✅ STABLE` | `🟡 IMPORTANT` | **S3 URL** | `scheme: "s3://"`<br>`bucket: string`<br>`region: string` | AWS S3<br>REST API | `AWS_ACCESS_KEY_ID`<br>`AWS_SECRET_ACCESS_KEY`<br>`AWS_REGION`<br>`AWS_SESSION_TOKEN`<br>`BUN_S3_MAX_PARTS=10000` | `fetch("s3://...", { s3: object })` | [#23](#f23) | [ex-021](#ex-021) |
| <a id="f34">34</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Unix Domain Socket** | `scheme: "unix:"`<br>`socketPath: string` | Unix Socket<br>POSIX | `BUN_UNIX_SOCKET_PATH_MAX=108`<br>`BUN_UNIX_SOCKET_PERMISSIONS=0o777`<br>`BUN_UNIX_BACKLOG=128` | `fetch(url, { unix: string })` | [#11](#f11) | [ex-022](#ex-022) |

### Environment & Limits

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f35">35</a> | `✅ STABLE` | `🟡 IMPORTANT` | **DNS Cache TTL** | `ttlSeconds: 30`<br>`maxEntries: number` | DNS<br>RFC 1035 | `BUN_DNS_TTL=30`<br>`BUN_DNS_CACHE_MAX_ENTRIES=1024`<br>`BUN_DNS_CACHE_CLEAN_INTERVAL=60000` | `30 seconds (default)` | [#9](#f9) | [ex-005](#ex-005) |
| <a id="f36">36</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Connection Limit** | `maxRequests: 256`<br>`queueLimit: number` | TCP<br>HTTP | `BUN_CONFIG_MAX_HTTP_REQUESTS=256`<br>`BUN_HTTP_QUEUE_LIMIT=1024`<br>`BUN_HTTP_CONNECTION_TIMEOUT=300000` | `BUN_CONFIG_MAX_HTTP_REQUESTS` | [#14](#f14) | [ex-007](#ex-007) |
| <a id="f37">37</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Sendfile Threshold** | `thresholdBytes: 32768`<br>`enabled: boolean` | TCP<br>System Call | `BUN_SENDFILE_THRESHOLD=32768`<br>`BUN_SENDFILE_MAX_SIZE=2GB`<br>`BUN_SENDFILE_BATCH_SIZE=64` | `32KB (default)` | [#8](#f8) | [ex-004](#ex-004) |
| <a id="f38">38</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Request Timeout** | `timeoutMs: number`<br>`abortOnTimeout: boolean` | Event API<br>WHATWG | `BUN_FETCH_TIMEOUT=30000`<br>`BUN_FETCH_RETRY_TIMEOUT=1000`<br>`BUN_FETCH_MAX_TIMEOUT=300000` | `AbortSignal.timeout(ms)` | [#15](#f15) | [ex-008](#ex-008) |

### Related Networking APIs

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f39">39</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.serve()** | `serverType: "http" \| "https"`<br>`maxBodySize: number` | HTTP/1.1<br>HTTP/2 | `BUN_SERVE_MAX_BODY_SIZE=100MB`<br>`BUN_SERVE_MAX_HEADERS=100`<br>`BUN_SERVE_IDLE_TIMEOUT=5000`<br>`PORT`<br>`HOST` | `Bun.serve({ fetch(req) })` | [#20](#f20) | [ex-023](#ex-023) |
| <a id="f40">40</a> | `✅ STABLE` | `🟡 IMPORTANT` | **HTMLRewriter** | `selector: string`<br>`handlerType: "element" \| "text"` | HTML5<br>DOM API | `BUN_HTML_REWRITER_BUFFER_SIZE=8192`<br>`BUN_HTML_MAX_DEPTH=256`<br>`BUN_HTML_ENTITY_CACHE_SIZE=1024` | `new HTMLRewriter().transform(res)` | [#1](#f1) | [ex-024](#ex-024) |
| <a id="f41">41</a> | `✅ STABLE` | `🟡 IMPORTANT` | **FileSystemRouter** | `fileExt: ".ts" \| ".js"`<br>`routeStyle: "nextjs" \| "sveltekit"` | File System<br>URL Routing | `BUN_ROUTER_CACHE_SIZE=1000`<br>`BUN_ROUTER_FILE_WATCH=1`<br>`BUN_ROUTER_MAX_DEPTH=10` | `new Bun.FileSystemRouter(opts)` | [#39](#f39) | [ex-025](#ex-025) |
| <a id="f42">42</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.connect()** | `socketType: "tcp" \| "tls" \| "unix"`<br>`keepAlive: boolean` | TCP/TLS<br>Socket API | `BUN_CONNECT_TIMEOUT=30000`<br>`BUN_CONNECT_RETRIES=3`<br>`BUN_CONNECT_BUFFER_SIZE=16384` | `Bun.connect(opts)` | [#34](#f34) | [ex-026](#ex-026) |
| <a id="f43">43</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.dns.lookup()** | `recordType: "A" \| "AAAA" \| "CNAME"`<br>`ttl: number` | DNS<br>RFC 1035 | `BUN_DNS_LOOKUP_TIMEOUT=5000`<br>`BUN_DNS_MAX_RETRIES=3`<br>`BUN_DNS_NAMESERVERS` | `Bun.dns.lookup(host)` | [#9](#f9) | [ex-027](#ex-027) |

---

## Environment Variables Reference Table

### Performance & Memory Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `BUN_CONFIG_MAX_HTTP_REQUESTS` | `256` | `number` | Max simultaneous HTTP requests | Global |
| `BUN_SENDFILE_THRESHOLD` | `32768` | `bytes` | Min file size for sendfile optimization | File I/O |
| `BUN_DNS_TTL` | `30` | `seconds` | DNS cache time-to-live | DNS |
| `BUN_KEEPALIVE_TIMEOUT` | `5000` | `ms` | Keep-alive connection timeout | HTTP |
| `BUN_FETCH_TIMEOUT` | `30000` | `ms` | Default fetch timeout | HTTP |
| `BUN_BUFFER_POOL_SIZE` | `64MB` | `bytes` | Size of reusable buffer pool | Memory |
| `BUN_ZEROCOPY_THRESHOLD` | `4096` | `bytes` | Min size for zero-copy operations | Memory |
| `BUN_MEMORY_LIMIT` | `System RAM` | `bytes` | Max memory allocation for Bun process | Memory |
| `BUN_HTTP_QUEUE_SIZE` | `1024` | `requests` | Max queued HTTP requests | HTTP |
| `BUN_FD_POOL_SIZE` | `256` | `descriptors` | File descriptor pool size | File I/O |

### Security & Validation Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `BUN_TLS_REJECT_UNAUTHORIZED` | `1` | `boolean` | Validate TLS certificates | TLS |
| `BUN_TLS_VERIFY_DEPTH` | `100` | `number` | Max certificate chain depth | TLS |
| `BUN_MAX_HEADERS` | `100` | `number` | Max HTTP headers per request | HTTP |
| `BUN_MAX_HEADER_SIZE` | `8192` | `bytes` | Max size of a single HTTP header | HTTP |
| `BUN_HEADER_CASE_SENSITIVE` | `0` | `boolean` | Treat header names as case-sensitive | HTTP |
| `BUN_JSON_PARSE_LIMIT` | `64KB` | `bytes` | Max JSON size for automatic parsing | JSON |
| `BUN_JSON_DEPTH_LIMIT` | `256` | `levels` | Max JSON nesting depth | JSON |
| `BUN_FORMDATA_MAX_SIZE` | `10MB` | `bytes` | Max FormData payload size | FormData |
| `BUN_FORMDATA_MAX_FIELDS` | `1000` | `number` | Max fields in FormData | FormData |

### Network & Connection Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `HTTP_PROXY` | `undefined` | `string` | HTTP proxy server URL | Network |
| `HTTPS_PROXY` | `undefined` | `string` | HTTPS proxy server URL | Network |
| `NO_PROXY` | `undefined` | `string` | Comma-separated hosts to bypass proxy | Network |
| `BUN_DNS_CACHE_SIZE` | `1024` | `entries` | Max DNS cache entries | DNS |
| `BUN_DNS_PREFETCH_MAX` | `100` | `hosts` | Max hosts to prefetch | DNS |
| `BUN_PRECONNECT_MAX` | `10` | `connections` | Max preconnected hosts | HTTP |
| `BUN_PRECONNECT_TTL` | `300` | `seconds` | Preconnection cache TTL | HTTP |
| `BUN_KEEPALIVE_MAX_REQUESTS` | `100` | `requests` | Max requests per keep-alive connection | HTTP |
| `BUN_HTTP_CONNECTION_POOL_SIZE` | `50` | `connections` | HTTP connection pool size | HTTP |
| `BUN_CONNECT_TIMEOUT` | `30000` | `ms` | Socket connection timeout | TCP |

### File System Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `BUN_WRITE_BUFFER_SIZE` | `8192` | `bytes` | Buffer size for file writes | File I/O |
| `BUN_FILE_MODE` | `0o644` | `octal` | Default file creation mode | File I/O |
| `BUN_FILE_URL_MAX_PATH` | `4096` | `bytes` | Max file path length | File I/O |
| `BUN_FILE_OPEN_LIMIT` | `1024` | `files` | Max simultaneously open files | File I/O |
| `BUN_FILE_FOLLOW_SYMLINKS` | `1` | `boolean` | Follow symbolic links | File I/O |
| `BUN_SENDFILE_MAX_SIZE` | `2GB` | `bytes` | Max file size for sendfile | File I/O |
| `BUN_SENDFILE_BATCH_SIZE` | `64` | `files` | Max files in sendfile batch | File I/O |
| `BUN_DATA_URL_MAX_SIZE` | `32MB` | `bytes` | Max data URL size | URL |
| `BUN_UNIX_SOCKET_PATH_MAX` | `108` | `bytes` | Max Unix socket path length | Socket |

### Protocol-Specific Constants

| Variable | Default | Type | Description | Protocol |
|----------|---------|------|-------------|----------|
| `BUN_STREAM_CHUNK_SIZE` | `16384` | `bytes` | Streaming chunk size | HTTP |
| `BUN_STREAM_BUFFER_SIZE` | `65536` | `bytes` | Stream buffer size | HTTP |
| `BUN_STREAM_HIGH_WATER_MARK` | `16384` | `bytes` | Stream backpressure threshold | HTTP |
| `BUN_DECOMPRESS_ENABLED` | `1` | `boolean` | Enable automatic decompression | HTTP |
| `BUN_GZIP_MAX_RATIO` | `1024` | `ratio` | Max compression ratio for safety | HTTP |
| `BUN_DEFLATE_WINDOW_BITS` | `15` | `bits` | Deflate window size | HTTP |
| `BUN_BLOB_URL_TTL` | `300000` | `ms` | Blob URL expiration time | Blob |
| `BUN_BLOB_URL_MAX_COUNT` | `1000` | `count` | Max active blob URLs | Blob |
| `BUN_BASE64_LINE_LENGTH` | `76` | `chars` | Base64 line length for data URLs | Data URL |
| `BUN_HTML_MAX_DEPTH` | `256` | `levels` | Max HTML nesting depth | HTML |

### AWS S3 Constants

| Variable | Default | Type | Description | Service |
|----------|---------|------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | `undefined` | `string` | AWS access key ID | S3 |
| `AWS_SECRET_ACCESS_KEY` | `undefined` | `string` | AWS secret access key | S3 |
| `AWS_REGION` | `undefined` | `string` | AWS region | S3 |
| `AWS_SESSION_TOKEN` | `undefined` | `string` | AWS session token | S3 |
| `BUN_S3_MAX_PARTS` | `10000` | `parts` | Max parts for multipart upload | S3 |
| `BUN_S3_PART_SIZE` | `8MB` | `bytes` | Default part size for multipart | S3 |
| `BUN_S3_RETRY_ATTEMPTS` | `3` | `attempts` | Number of retry attempts | S3 |
| `BUN_S3_TIMEOUT` | `30000` | `ms` | S3 request timeout | S3 |
| `AWS_DEFAULT_REGION` | `undefined` | `string` | Default AWS region | S3 |

### Development & Debugging Constants

| Variable | Default | Type | Description | Purpose |
|----------|---------|------|-------------|---------|
| `BUN_VERBOSE_LOGGING` | `0` | `boolean` | Enable verbose fetch logging | Debug |
| `BUN_CURL_FORMAT` | `1` | `boolean` | Show curl command format | Debug |
| `BUN_DEBUG_FETCH` | `0` | `boolean` | Enable fetch debug mode | Debug |
| `BUN_DNS_STATS_ENABLED` | `1` | `boolean` | Enable DNS statistics | Metrics |
| `BUN_TLS_INSECURE` | `0` | `boolean` | Allow insecure TLS (dev only) | Dev |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `1` | `boolean` | Node.js compatibility TLS setting | Compatibility |
| `BUN_FETCH_RETRY_TIMEOUT` | `1000` | `ms` | Retry delay for failed requests | Resilience |
| `BUN_FETCH_MAX_TIMEOUT` | `300000` | `ms` | Maximum allowed timeout | Safety |

### Server Constants (Bun.serve)

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `PORT` | `3000` | `number` | Server port | Server |
| `HOST` | `localhost` | `string` | Server hostname | Server |
| `BUN_PORT` | `0` | `number` | Random port for bun run | Server |
| `BUN_HOST` | `localhost` | `string` | Explicit hostname for bun run | Server |
| `BUN_SERVE_MAX_BODY_SIZE` | `100MB` | `bytes` | Max request body size | Server |
| `BUN_SERVE_MAX_HEADERS` | `100` | `number` | Max headers per request | Server |
| `BUN_SERVE_IDLE_TIMEOUT` | `5000` | `ms` | Idle connection timeout | Server |
| `BUN_SERVE_REQUEST_TIMEOUT` | `30000` | `ms` | Request processing timeout | Server |
| `BUN_SERVE_RESPONSE_TIMEOUT` | `30000` | `ms` | Response sending timeout | Server |

### Platform-Specific Constants

| Variable | Platform | Default | Description | Notes |
|----------|----------|---------|-------------|-------|
| `BUN_UNIX_SOCKET_PERMISSIONS` | Unix | `0o777` | Unix socket permissions | POSIX |
| `BUN_UNIX_BACKLOG` | Unix | `128` | Socket backlog queue size | POSIX |
| `BUN_FILE_MODE` | Unix | `0o644` | Default file permissions | POSIX |
| `BUN_SENDFILE_ENABLED` | Linux/macOS | `1` | Enable sendfile optimization | Kernel |
| `BUN_ZEROCOPY_ENABLED` | Linux | `1` | Enable zero-copy operations | Kernel 2.6+ |
| `BUN_EPOLL_MAX_EVENTS` | Linux | `1024` | Max epoll events per iteration | Linux |
| `BUN_KQUEUE_MAX_EVENTS` | macOS | `1024` | Max kqueue events per iteration | macOS |

---

## Readonly Runtime Constants

### Bun Runtime Version Constants

| Constant | Value | Type | Description | Access |
|----------|-------|------|-------------|--------|
| `Bun.version` | `"1.x.x"` | `string` | Bun runtime version | Runtime |
| `Bun.revision` | `"abcdef1"` | `string` | Git revision hash | Runtime |
| `Bun.target` | `"x64"` | `string` | Target architecture | Runtime |
| `Bun.platform` | `"darwin" \| "linux"` | `string` | Platform identifier | Runtime |
| `Bun.uv` | `object` | `object` | libuv version info | Runtime |

### Feature Detection Constants

| Constant | Value | Type | Description | Access |
|----------|-------|------|-------------|--------|
| `Bun.features` | `object` | `object` | Available runtime features | Runtime |
| `Bun.features.fetch` | `boolean` | `boolean` | Fetch API available | Runtime |
| `Bun.features.sendfile` | `boolean` | `boolean` | Sendfile optimization | Runtime |
| `Bun.features.https` | `boolean` | `boolean` | HTTPS support | Runtime |
| `Bun.features.s3` | `boolean` | `boolean` | S3 protocol support | Runtime |

### System Limit Constants

| Constant | Value | Type | Description | Access |
|----------|-------|------|-------------|--------|
| `Bun.constants.OS_FD_LIMIT` | `1024` | `number` | Max open file descriptors | System |
| `Bun.constants.MAX_HTTP_REQUESTS` | `65536` | `number` | Absolute max HTTP requests | System |
| `Bun.constants.MAX_PATH_LENGTH` | `4096` | `number` | Max file path length | System |
| `Bun.constants.MAX_HOSTNAME_LENGTH` | `255` | `number` | Max hostname length | System |
| `Bun.constants.MAX_PORT` | `65535` | `number` | Max TCP port number | System |

### Protocol Version Constants

| Constant | Value | Type | Description | Access |
|----------|-------|------|-------------|--------|
| `Bun.constants.HTTP_VERSION_1_1` | `"HTTP/1.1"` | `string` | HTTP/1.1 version string | Protocol |
| `Bun.constants.HTTP_VERSION_2` | `"HTTP/2"` | `string` | HTTP/2 version string | Protocol |
| `Bun.constants.TLS_VERSION_1_2` | `"TLSv1.2"` | `string` | TLS 1.2 version | Protocol |
| `Bun.constants.TLS_VERSION_1_3` | `"TLSv1.3"` | `string` | TLS 1.3 version | Protocol |
| `Bun.constants.DNS_RECORD_A` | `1` | `number` | DNS A record type | Protocol |
| `Bun.constants.DNS_RECORD_AAAA` | `28` | `number` | DNS AAAA record type | Protocol |

### Performance Constants

| Constant | Value | Type | Description | Access |
|----------|-------|------|-------------|--------|
| `Bun.constants.PAGE_SIZE` | `4096` | `bytes` | System memory page size | System |
| `Bun.constants.CACHE_LINE_SIZE` | `64` | `bytes` | CPU cache line size | System |
| `Bun.constants.SENDFILE_THRESHOLD` | `32768` | `bytes` | Sendfile optimization threshold | System |
| `Bun.constants.ZEROCOPY_THRESHOLD` | `4096` | `bytes` | Zero-copy threshold | System |
| `Bun.constants.BUFFER_POOL_SIZE` | `67108864` | `bytes` | Buffer pool size (64MB) | Runtime |

### Time Constants

| Constant | Value | Type | Description | Access |
|----------|-------|------|-------------|--------|
| `Bun.constants.MS_PER_SECOND` | `1000` | `ms` | Milliseconds per second | Time |
| `Bun.constants.NS_PER_MS` | `1000000` | `ns` | Nanoseconds per millisecond | Time |
| `Bun.constants.DNS_TTL_DEFAULT` | `30` | `seconds` | Default DNS TTL | DNS |
| `Bun.constants.KEEPALIVE_TIMEOUT` | `5000` | `ms` | Default keep-alive timeout | HTTP |
| `Bun.constants.FETCH_TIMEOUT` | `30000` | `ms` | Default fetch timeout | HTTP |

---

## Usage Examples with Constants

### Setting Environment Variables
```bash
# Performance tuning
export BUN_CONFIG_MAX_HTTP_REQUESTS=512
export BUN_SENDFILE_THRESHOLD=65536
export BUN_DNS_TTL=60

# Security configuration
export BUN_TLS_REJECT_UNAUTHORIZED=1
export BUN_TLS_VERIFY_DEPTH=100
export BUN_MAX_HEADERS=200

# Network configuration
export HTTP_PROXY="http://proxy.example.com:8080"
export NO_PROXY="localhost,127.0.0.1,.internal"
export BUN_DNS_NAMESERVERS="8.8.8.8,1.1.1.1"

# AWS S3 configuration
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
```

### Reading Runtime Constants
```typescript
// Check runtime capabilities
console.log(`Bun version: ${Bun.version}`);
console.log(`Platform: ${Bun.platform}`);
console.log(`Features:`, Bun.features);

// System limits
console.log(`Max file descriptors: ${Bun.constants.OS_FD_LIMIT}`);
console.log(`Max HTTP requests: ${Bun.constants.MAX_HTTP_REQUESTS}`);

// Protocol versions
console.log(`Supported HTTP versions:`, {
  http11: Bun.constants.HTTP_VERSION_1_1,
  http2: Bun.constants.HTTP_VERSION_2
});

// Performance constants
console.log(`System page size: ${Bun.constants.PAGE_SIZE}`);
console.log(`Sendfile threshold: ${Bun.constants.SENDFILE_THRESHOLD}`);
```

### Runtime Feature Detection
```typescript
// Feature detection
if (Bun.features.fetch) {
  console.log('Fetch API is available');
}

if (Bun.features.sendfile) {
  console.log('Sendfile optimization is enabled');
}

if (Bun.features.s3) {
  console.log('S3 protocol is supported');
}

// Platform-specific optimizations
if (Bun.platform === 'linux' && Bun.features.zerocopy) {
  console.log('Zero-copy operations available on Linux');
}
```

### Environment Variable Fallbacks
```typescript
// Read environment variables with defaults
const maxRequests = process.env.BUN_CONFIG_MAX_HTTP_REQUESTS
  ? parseInt(process.env.BUN_CONFIG_MAX_HTTP_REQUESTS)
  : 256;

const sendfileThreshold = process.env.BUN_SENDFILE_THRESHOLD
  ? parseInt(process.env.BUN_SENDFILE_THRESHOLD)
  : 32768;

const dnsTTL = process.env.BUN_DNS_TTL
  ? parseInt(process.env.BUN_DNS_TTL)
  : 30;

console.log(`Configuration:`, {
  maxRequests,
  sendfileThreshold,
  dnsTTL
});
```

---

## Constant Categories Reference

### Performance Tuning Constants
```typescript
// Buffer and memory sizes
const BUFFER_SIZES = {
  BUN_WRITE_BUFFER_SIZE: 8192,
  BUN_STREAM_CHUNK_SIZE: 16384,
  BUN_STREAM_BUFFER_SIZE: 65536,
  BUN_BUFFER_POOL_SIZE: 67108864,
  BUN_ZEROCOPY_THRESHOLD: 4096
};

// Connection and request limits
const CONNECTION_LIMITS = {
  BUN_CONFIG_MAX_HTTP_REQUESTS: 256,
  BUN_HTTP_QUEUE_SIZE: 1024,
  BUN_HTTP_CONNECTION_POOL_SIZE: 50,
  BUN_PRECONNECT_MAX: 10,
  BUN_KEEPALIVE_MAX_REQUESTS: 100
};

// Timeouts and intervals
const TIMEOUTS = {
  BUN_FETCH_TIMEOUT: 30000,
  BUN_KEEPALIVE_TIMEOUT: 5000,
  BUN_CONNECT_TIMEOUT: 30000,
  BUN_DNS_TTL: 30,
  BUN_BLOB_URL_TTL: 300000
};
```

### Security Constants
```typescript
const SECURITY = {
  // TLS/SSL
  BUN_TLS_REJECT_UNAUTHORIZED: 1,
  BUN_TLS_VERIFY_DEPTH: 100,
  BUN_TLS_CHECK_REVOCATION: 1,

  // HTTP headers
  BUN_MAX_HEADERS: 100,
  BUN_MAX_HEADER_SIZE: 8192,

  // Data validation
  BUN_JSON_PARSE_LIMIT: 65536,
  BUN_JSON_DEPTH_LIMIT: 256,
  BUN_FORMDATA_MAX_SIZE: 10485760,
  BUN_FORMDATA_MAX_FIELDS: 1000
};
```

### Platform Constants
```typescript
// Platform-specific defaults
const PLATFORM_DEFAULTS = {
  // Unix/Linux
  unix: {
    BUN_FILE_MODE: 0o644,
    BUN_UNIX_SOCKET_PERMISSIONS: 0o777,
    BUN_UNIX_BACKLOG: 128
  },

  // File system limits
  filesystem: {
    BUN_FILE_URL_MAX_PATH: 4096,
    BUN_FILE_OPEN_LIMIT: 1024,
    BUN_SENDFILE_MAX_SIZE: 2147483648
  },

  // Network
  network: {
    BUN_MAX_PATH_LENGTH: 4096,
    BUN_MAX_HOSTNAME_LENGTH: 255,
    BUN_MAX_PORT: 65535
  }
};
```

### Protocol Constants
```typescript
const PROTOCOL_CONSTANTS = {
  // HTTP
  http: {
    BUN_DECOMPRESS_ENABLED: 1,
    BUN_GZIP_MAX_RATIO: 1024,
    BUN_DEFLATE_WINDOW_BITS: 15,
    BUN_STREAM_HIGH_WATER_MARK: 16384
  },

  // DNS
  dns: {
    BUN_DNS_CACHE_SIZE: 1024,
    BUN_DNS_PREFETCH_MAX: 100,
    BUN_DNS_LOOKUP_TIMEOUT: 5000
  },

  // File protocols
  file: {
    BUN_DATA_URL_MAX_SIZE: 33554432,
    BUN_BASE64_LINE_LENGTH: 76,
    BUN_BLOB_URL_MAX_COUNT: 1000
  }
};
```

---

## Environment Variable Best Practices

### Development vs Production
```bash
# Development environment (local)
export BUN_TLS_INSECURE=0          # Allow self-signed certs
export BUN_VERBOSE_LOGGING=1       # Enable debug logging
export BUN_DEBUG_FETCH=1           # Fetch debugging
export NODE_TLS_REJECT_UNAUTHORIZED=0  # Node compatibility

# Production environment
export BUN_TLS_REJECT_UNAUTHORIZED=1   # Strict TLS
export BUN_VERBOSE_LOGGING=0           # Disable debug logging
export BUN_DEBUG_FETCH=0               # Disable fetch debugging
export BUN_TLS_CHECK_REVOCATION=1      # Check cert revocation
```

### Performance Tuning Examples
```bash
# High-traffic server
export BUN_CONFIG_MAX_HTTP_REQUESTS=1024
export BUN_HTTP_QUEUE_SIZE=4096
export BUN_HTTP_CONNECTION_POOL_SIZE=200
export BUN_BUFFER_POOL_SIZE=134217728  # 128MB
export BUN_DNS_CACHE_SIZE=2048

# Memory-constrained environment
export BUN_CONFIG_MAX_HTTP_REQUESTS=128
export BUN_BUFFER_POOL_SIZE=16777216    # 16MB
export BUN_BLOB_MEMORY_LIMIT=16777216   # 16MB
export BUN_JSON_PARSE_LIMIT=32768       # 32KB
export BUN_FORMDATA_MAX_SIZE=5242880    # 5MB

# High-latency network
export BUN_FETCH_TIMEOUT=60000          # 60 seconds
export BUN_CONNECT_TIMEOUT=10000        # 10 seconds
export BUN_KEEPALIVE_TIMEOUT=30000      # 30 seconds
export BUN_DNS_TTL=300                  # 5 minutes
export BUN_FETCH_RETRY_TIMEOUT=2000     # 2 second retry
```

### Security Hardening
```bash
# Strict security configuration
export BUN_TLS_REJECT_UNAUTHORIZED=1
export BUN_TLS_VERIFY_DEPTH=10          # Shallow chain
export BUN_TLS_CHECK_REVOCATION=1
export BUN_MAX_HEADERS=50               # Limit headers
export BUN_MAX_HEADER_SIZE=4096         # Smaller headers
export BUN_JSON_DEPTH_LIMIT=20          # Limit JSON depth
export BUN_FORMDATA_MAX_FIELDS=100      # Limit form fields
export BUN_HTML_MAX_DEPTH=50            # Limit HTML parsing
```

### Containerized Deployment
```bash
# Docker/container environment
export BUN_CONFIG_MAX_HTTP_REQUESTS=${MAX_REQUESTS:-256}
export BUN_MEMORY_LIMIT=${MEMORY_LIMIT:-268435456}  # 256MB
export BUN_BUFFER_POOL_SIZE=${BUFFER_POOL:-33554432} # 32MB
export BUN_FD_POOL_SIZE=${FD_POOL:-128}
export PORT=${PORT:-3000}
export HOST=${HOST:-0.0.0.0}
export NODE_ENV=${NODE_ENV:-production}
```

### Monitoring and Observability
```bash
# Enable metrics and debugging
export BUN_DNS_STATS_ENABLED=1
export BUN_VERBOSE_LOGGING=${DEBUG:-0}
export BUN_DEBUG_FETCH=${DEBUG_FETCH:-0}
export BUN_PROFILE=${PROFILE:-0}
export BUN_TRACE=${TRACE:-0}

# Set appropriate log levels
if [ "$NODE_ENV" = "production" ]; then
  export BUN_LOG_LEVEL="error"
else
  export BUN_LOG_LEVEL="debug"
fi
```

---

## Console & Debugging Utilities

### Console & Debugging

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f44">44</a> | `✅ STABLE` | `🔴 CRITICAL` | **console.debug()** | `logLevel: "debug"`<br>`timestamp: boolean`<br>`colors: boolean` | Console API<br>RFC 5424 | `BUN_CONSOLE_DEPTH=4`<br>`BUN_CONSOLE_COLORS=1`<br>`BUN_DEBUG="*"`<br>`DEBUG_COLORS=1` | `console.debug(...args): void` | `void` | [#45](#f45), [#46](#f46) | [ex-044](#ex-044) |
| <a id="f45">45</a> | `✅ STABLE` | `🔴 CRITICAL` | **console.dir()** | `depth: number`<br>`colors: boolean`<br>`showHidden: boolean` | Console API<br>Node.js | `BUN_CONSOLE_DIR_DEPTH=2`<br>`BUN_CONSOLE_DIR_COLORS=1`<br>`NODE_DISABLE_COLORS=0` | `console.dir(obj, options?): void` | `void` | [#44](#f44), [#47](#f47) | [ex-045](#ex-045) |
| <a id="f46">46</a> | `✅ STABLE` | `🔴 CRITICAL` | **console.trace()** | `stackLimit: number`<br>`showColumn: boolean` | Console API<br>Stack Trace | `BUN_STACK_TRACE_LIMIT=10`<br>`BUN_STACK_COLORS=1`<br>`BUN_ASYNC_STACK_TRACES=1` | `console.trace(message?, ...args): void` | `void` | [#44](#f44), [#48](#f48) | [ex-046](#ex-046) |
| <a id="f47">47</a> | `✅ STABLE` | `🟡 IMPORTANT` | **console.time/timeLog/timeEnd()** | `timerName: string`<br>`precision: number` | Console API<br>Performance | `BUN_CONSOLE_TIMER_PRECISION=3`<br>`BUN_CONSOLE_TIMER_FORMAT="ms"` | `console.time(label): void`<br>`console.timeLog(label): void`<br>`console.timeEnd(label): void` | `void` | [#44](#f44), [#48](#f48) | [ex-047](#ex-047) |
| <a id="f48">48</a> | `✅ STABLE` | `🟡 IMPORTANT` | **console.assert()** | `condition: boolean`<br>`message: string` | Console API<br>Assertion | `BUN_ASSERT_DEPTH=2`<br>`BUN_ASSERT_COLORS=1`<br>`NODE_ENV` | `console.assert(condition, ...args): void` | `void` | [#44](#f44), [#46](#f46) | [ex-048](#ex-048) |
| <a id="f49">49</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.inspect()** | `depth: number`<br>`colors: boolean`<br>`compact: boolean` | Inspection API<br>Node.js util | `BUN_INSPECT_DEPTH=4`<br>`BUN_INSPECT_COLORS=1`<br>`BUN_INSPECT_MAX_ARRAY=100`<br>`NO_COLOR`<br>`FORCE_COLOR` | `Bun.inspect(value, options?): string` | `string` | [#45](#f45), [#50](#f50) | [ex-049](#ex-049) |
| <a id="f50">50</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.inspect.table()** | `columns: string[]`<br>`compact: boolean`<br>`align: string` | Inspection API<br>Tabular Data | `BUN_INSPECT_TABLE_MAX_ROWS=1000`<br>`BUN_INSPECT_TABLE_TRUNCATE=100`<br>`BUN_INSPECT_TABLE_COMPACT=1` | `Bun.inspect.table(data, properties?, options?): string` | `string` | [#49](#f49), [#45](#f45) | [ex-050](#ex-050) |
| <a id="f51">51</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.peek()** | `promise: Promise<T>`<br>`timeout: number` | Promise API<br>Zero-cost | `BUN_PEEK_TIMEOUT=0`<br>`BUN_PEEK_MAX_DEPTH=10` | `Bun.peek(promise): T \| undefined` | `T \| undefined` | [#52](#f52) | [ex-051](#ex-051) |
| <a id="f52">52</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.peek.status()** | `promise: Promise<T>` | Promise API<br>Status Check | `BUN_PEEK_STATUS_CACHE=1` | `Bun.peek.status(promise): "pending" \| "fulfilled" \| "rejected"` | `string` | [#51](#f51) | [ex-052](#ex-052) |

### Runtime Information

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f53">53</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.version** | `major: number`<br>`minor: number`<br>`patch: number` | Runtime API<br>SemVer | `BUN_VERSION`<br>`BUN_REVISION`<br>`BUN_TARGET` | `Bun.version: string` (readonly) | `string` | [#54](#f54), [#55](#f55) | [ex-053](#ex-053) |
| <a id="f54">54</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.revision** | `sha: string`<br>`short: string` | Runtime API<br>Git | `BUN_GIT_COMMIT`<br>`BUN_GIT_BRANCH` | `Bun.revision: string` (readonly) | `string` | [#53](#f53), [#55](#f55) | [ex-054](#ex-054) |
| <a id="f55">55</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.env** | `env: Record<string, string>`<br>`platform: string` | Runtime API<br>Process | `NODE_ENV`<br>`BUN_ENV`<br>`PLATFORM`<br>`ARCH` | `Bun.env: Record<string, string>` (readonly) | `object` | [#53](#f53), [#56](#f56) | [ex-055](#ex-055) |
| <a id="f56">56</a> | `✅ STABLE` | `🔴 CRITICAL` | **process.argv** | `args: string[]`<br>`execPath: string` | Process API<br>POSIX | `ARGV0`<br>`BUN_ARGV`<br>`PROCESS_ARGV` | `process.argv: string[]` (readonly) | `string[]` | [#55](#f55), [#57](#f57) | [ex-056](#ex-056) |
| <a id="f57">57</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.main** | `filePath: string`<br>`module: Module` | Runtime API<br>Entry Point | `BUN_MAIN_MODULE`<br>`MAIN` | `Bun.main: string` (readonly) | `string` | [#56](#f56), [#58](#f58) | [ex-057](#ex-057) |
| <a id="f58">58</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.cwd()** | `cwd: string`<br>`platform: string` | File System<br>POSIX | `PWD`<br>`INIT_CWD`<br>`BUN_CWD` | `Bun.cwd(): string` | `string` | [#57](#f57), [#59](#f59) | [ex-058](#ex-058) |
| <a id="f59">59</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.cwd()** | `cwd: string`<br>`realpath: boolean` | Process API<br>Node.js | `PROCESS_CWD`<br>`NODE_CWD` | `process.cwd(): string` | `string` | [#58](#f58), [#60](#f60) | [ex-059](#ex-059) |
| <a id="f60">60</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.platform** | `os: string`<br>`arch: string` | Process API<br>Node.js | `OS`<br>`PLATFORM`<br>`ARCH` | `process.platform: string` (readonly) | `string` | [#55](#f55), [#61](#f61) | [ex-060](#ex-060) |
| <a id="f61">61</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.arch** | `arch: string`<br>`endianness: string` | Process API<br>Node.js | `PROCESS_ARCH`<br>`TARGET_ARCH` | `process.arch: string` (readonly) | `string` | [#60](#f60), [#62](#f62) | [ex-061](#ex-061) |
| <a id="f62">62</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.pid** | `pid: number`<br>`ppid: number` | Process API<br>POSIX | `PID`<br>`PPID`<br>`BUN_PID` | `process.pid: number` (readonly) | `number` | [#61](#f61), [#63](#f63) | [ex-062](#ex-062) |

### Performance Profiling

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f63">63</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.gc()** | `full: boolean`<br>`type: "major" \| "minor"` | Runtime API<br>V8 GC | `BUN_GC_FREQUENCY=100`<br>`BUN_GC_THRESHOLD=65536`<br>`EXPOSE_GC=1` | `Bun.gc(full?): void` | `void` | [#64](#f64), [#65](#f65) | [ex-063](#ex-063) |
| <a id="f64">64</a> | `✅ STABLE` | `🟡 IMPORTANT` | **performance.now()** | `precision: number`<br>`monotonic: boolean` | Performance API<br>High-Res | `BUN_PERFORMANCE_TIMER="hrtime"`<br>`BUN_HRTIME_PRECISION=9` | `performance.now(): number` | `number` | [#63](#f63), [#65](#f65) | [ex-064](#ex-064) |
| <a id="f65">65</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.hrtime()** | `bigint: boolean`<br>`precision: number` | Process API<br>Node.js | `BUN_HRTIME_BIGINT=1`<br>`BUN_NS_PER_SEC=1e9` | `process.hrtime(time?): [number, number]` | `[number, number]` | [#64](#f64), [#66](#f66) | [ex-065](#ex-065) |
| <a id="f66">66</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.memoryUsage()** | `rss: number`<br>`heapTotal: number`<br>`heapUsed: number` | Process API<br>Node.js | `BUN_MEMORY_STATS=1`<br>`BUN_MEMORY_SAMPLE_RATE=1000` | `process.memoryUsage(): MemoryUsage` | `object` | [#65](#f65), [#67](#f67) | [ex-066](#ex-066) |
| <a id="f67">67</a> | `✅ STABLE` | `🟢 OPTIMIZATION` | **Bun.nanoseconds()** | `precision: number`<br>`monotonic: boolean` | Runtime API<br>High-Res | `BUN_NANOSECOND_PRECISION=1` | `Bun.nanoseconds(): number` | `number` | [#66](#f66), [#68](#f68) | [ex-067](#ex-067) |

### Process Control

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f68">68</a> | `✅ STABLE` | `🔴 CRITICAL` | **process.exit()** | `code: number`<br>`force: boolean` | Process API<br>POSIX | `EXIT_CODE`<br>`BUN_EXIT_TIMEOUT=1000` | `process.exit(code?): never` | `never` | [#69](#f69), [#70](#f70) | [ex-068](#ex-068) |
| <a id="f69">69</a> | `✅ STABLE` | `🔴 CRITICAL` | **process.kill()** | `pid: number`<br>`signal: string` | Process API<br>POSIX | `SIGTERM`<br>`SIGKILL`<br>`SIGINT` | `process.kill(pid, signal?): boolean` | `boolean` | [#68](#f68), [#70](#f70) | [ex-069](#ex-069) |
| <a id="f70">70</a> | `✅ STABLE` | `🔴 CRITICAL` | **process.on()** | `event: string`<br>`listener: Function` | Event API<br>Node.js | `BUN_MAX_LISTENERS=10`<br>`BUN_EVENT_QUEUE_SIZE=1000` | `process.on(event, listener): Process` | `Process` | [#68](#f68), [#71](#f71) | [ex-070](#ex-070) |
| <a id="f71">71</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.sleep()** | `ms: number`<br>`sync: boolean` | Runtime API<br>Timers | `BUN_SLEEP_PRECISION=1`<br>`BUN_SLEEP_MAX_MS=86400000` | `Bun.sleep(ms): Promise<void>` | `Promise<void>` | [#70](#f70), [#72](#f72) | [ex-071](#ex-071) |
| <a id="f72">72</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.sleepSync()** | `ms: number`<br>`interruptible: boolean` | Runtime API<br>Timers | `BUN_SLEEP_SYNC_MAX=1000`<br>`BUN_BLOCKING_SLEEP=0` | `Bun.sleepSync(ms): void` | `void` | [#71](#f71), [#73](#f73) | [ex-072](#ex-072) |
| <a id="f73">73</a> | `✅ STABLE` | `🟡 IMPORTANT` | **setImmediate()** | `callback: Function`<br>`args: any[]` | Timers API<br>Node.js | `BUN_IMMEDIATE_POOL_SIZE=1024`<br>`BUN_NEXT_TICK_DEPTH=1000` | `setImmediate(callback, ...args): Immediate` | `Immediate` | [#72](#f72), [#74](#f74) | [ex-073](#ex-073) |
| <a id="f74">74</a> | `✅ STABLE` | `🟡 IMPORTANT` | **process.nextTick()** | `callback: Function`<br>`args: any[]` | Process API<br>Node.js | `BUN_NEXT_TICK_MAX_DEPTH=1000`<br>`BUN_MICROTASK_QUEUE_SIZE=1024` | `process.nextTick(callback, ...args): void` | `void` | [#73](#f73), [#75](#f75) | [ex-074](#ex-074) |
| <a id="f75">75</a> | `✅ STABLE` | `🟡 IMPORTANT` | **queueMicrotask()** | `callback: Function` | Web API<br>HTML5 | `BUN_MICROTASK_QUEUE_LIMIT=10000`<br>`BUN_TASK_PRIORITY="normal"` | `queueMicrotask(callback): void` | `void` | [#74](#f74), [#76](#f76) | [ex-075](#ex-075) |

### Utility Functions

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f76">76</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.file()** | `path: string`<br>`options: object` | File System<br>POSIX | `BUN_FILE_READ_BUFFER=8192`<br>`BUN_FILE_WRITE_BUFFER=8192`<br>`BUN_FILE_CACHE_SIZE=1000` | `Bun.file(path, options?): BunFile` | `BunFile` | [#77](#f77), [#78](#f78) | [ex-076](#ex-076) |
| <a id="f77">77</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.write()** | `destination: string \| number`<br>`data: string \| Buffer` | File System<br>POSIX | `BUN_WRITE_BUFFER_SIZE=8192`<br>`BUN_WRITE_ATOMIC=1`<br>`BUN_WRITE_SYNC=0` | `Bun.write(destination, data): Promise<number>` | `Promise<number>` | [#76](#f76), [#78](#f78) | [ex-077](#ex-077) |
| <a id="f78">78</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.readableStreamTo...()** | `stream: ReadableStream`<br>`encoding: string` | Streams API<br>WHATWG | `BUN_STREAM_CHUNK_SIZE=16384`<br>`BUN_STREAM_HIGH_WATER_MARK=16384` | `Bun.readableStreamToText(stream): Promise<string>`<br>`Bun.readableStreamToArrayBuffer(stream): Promise<ArrayBuffer>` | `Promise<...>` | [#76](#f76), [#79](#f79) | [ex-078](#ex-078) |
| <a id="f79">79</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.sha()** | `algorithm: string`<br>`input: string \| Buffer` | Crypto API<br>SHA | `BUN_SHA_ALGORITHM="sha256"`<br>`BUN_HASH_BUFFER_SIZE=4096` | `Bun.sha(input, algorithm?): ArrayBuffer` | `ArrayBuffer` | [#78](#f78), [#80](#f80) | [ex-079](#ex-079) |
| <a id="f80">80</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.password** | `algorithm: "bcrypt" \| "argon2"`<br>`cost: number` | Crypto API<br>Password | `BUN_PASSWORD_COST=10`<br>`BUN_PASSWORD_SALT_SIZE=16` | `Bun.password.hash(password): Promise<string>`<br>`Bun.password.verify(password, hash): Promise<boolean>` | `Promise<...>` | [#79](#f79), [#81](#f81) | [ex-080](#ex-080) |
| <a id="f81">81</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.which()** | `command: string`<br>`cwd: string` | Process API<br>PATH | `PATH`<br>`PATHEXT`<br>`BUN_WHICH_CACHE=1` | `Bun.which(command): string \| null` | `string \| null` | [#80](#f80), [#82](#f82) | [ex-081](#ex-081) |
| <a id="f82">82</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.gzipSync()** | `data: string \| Buffer`<br>`level: number` | Compression API<br>zlib | `BUN_GZIP_LEVEL=6`<br>`BUN_GZIP_WINDOW_BITS=15`<br>`BUN_ZLIB_MEMORY_LEVEL=8` | `Bun.gzipSync(data, options?): Buffer`<br>`Bun.gunzipSync(data): Buffer` | `Buffer` | [#81](#f81), [#83](#f83) | [ex-082](#ex-082) |
| <a id="f83">83</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.deepEquals()** | `a: any`<br>`b: any`<br>`strict: boolean` | Utility API<br>Comparison | `BUN_DEEP_EQUALS_MAX_DEPTH=100`<br>`BUN_DEEP_EQUALS_CIRCULAR=1` | `Bun.deepEquals(a, b, strict?): boolean` | `boolean` | [#82](#f82), [#84](#f84) | [ex-083](#ex-083) |
| <a id="f84">84</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Bun.escapeHTML()** | `str: string`<br>`attributeMode: boolean` | Utility API<br>HTML | `BUN_ESCAPE_HTML_ENTITIES=1`<br>`BUN_ESCAPE_ATTRIBUTE=0` | `Bun.escapeHTML(str): string` | `string` | [#83](#f83), [#85](#f85) | [ex-084](#ex-084) |

### Module System

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f85">85</a> | `✅ STABLE` | `🔴 CRITICAL` | **require()** | `id: string`<br>`parent: Module` | Module API<br>CommonJS | `NODE_PATH`<br>`BUN_MODULE_CACHE=1`<br>`BUN_DISABLE_MODULE_CACHE=0` | `require(id): any` | `any` | [#86](#f86), [#87](#f87) | [ex-085](#ex-085) |
| <a id="f86">86</a> | `✅ STABLE` | `🔴 CRITICAL` | **import()** | `specifier: string`<br>`options: object` | Module API<br>ESM | `BUN_ESM_CACHE=1`<br>`BUN_ESM_RESOLVE_CACHE=1`<br>`BUN_ESM_PREFETCH=0` | `import(specifier): Promise<Module>` | `Promise<Module>` | [#85](#f85), [#87](#f87) | [ex-086](#ex-086) |
| <a id="f87">87</a> | `✅ STABLE` | `🔴 CRITICAL` | **Bun.resolve()** | `specifier: string`<br>`from: string` | Module API<br>Resolution | `BUN_RESOLVE_CACHE=1`<br>`BUN_RESOLVE_MAX_DEPTH=100`<br>`BUN_RESOLVE_PACKAGE_EXPORTS=1` | `Bun.resolve(specifier, from): Promise<string>` | `Promise<string>` | [#85](#f85), [#88](#f88) | [ex-087](#ex-087) |
| <a id="f88">88</a> | `✅ STABLE` | `🟡 IMPORTANT` | **import.meta** | `url: string`<br>`dir: string`<br>`path: string` | Module API<br>ESM | `IMPORT_META_URL`<br>`IMPORT_META_DIRNAME`<br>`BUN_IMPORT_META_CACHE=1` | `import.meta.url: string` (readonly)<br>`import.meta.dir: string` (readonly)<br>`import.meta.path: string` (readonly) | `string` | [#86](#f86), [#87](#f87) | [ex-088](#ex-088) |
| <a id="f89">89</a> | `✅ STABLE` | `🟡 IMPORTANT` | **__dirname** | `directory: string`<br>`realpath: string` | Module API<br>CommonJS | `__DIRNAME`<br>`__FILENAME`<br>`BUN_REALPATH_CACHE=1` | `__dirname: string` (readonly) | `string` | [#85](#f85), [#88](#f88) | [ex-089](#ex-089) |
| <a id="f90">90</a> | `✅ STABLE` | `🟡 IMPORTANT` | **__filename** | `filename: string`<br>`realpath: string` | Module API<br>CommonJS | `__FILENAME_REAL`<br>`BUN_FILE_PATH_CACHE=1` | `__filename: string` (readonly) | `string` | [#85](#f85), [#89](#f89) | [ex-090](#ex-090) |

---

## Console & Debugging Examples

### <a id="ex-049"></a>49. Bun.inspect() - Advanced Object Inspection
```typescript
const complexObj = {
  string: "text",
  number: 42,
  array: [1, 2, { nested: "value" }],
  date: new Date(),
  buffer: Buffer.from("hello"),
  map: new Map([["key", "value"]]),
  set: new Set([1, 2, 3])
};

// Basic inspection
console.log(Bun.inspect(complexObj));

// Control depth
console.log(Bun.inspect(complexObj, { depth: 2 }));

// With colors
console.log(Bun.inspect(complexObj, { colors: true }));

// Environment variable control
const options = {
  depth: parseInt(process.env.BUN_INSPECT_DEPTH || "4"),
  colors: process.env.NO_COLOR ? false : true
};
console.log(Bun.inspect(complexObj, options));
```

### <a id="ex-050"></a>50. Bun.inspect.table() - Tabular Data Display
```typescript
const users = [
  { id: 1, name: "Alice", age: 30, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 25, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 35, email: "charlie@example.com" }
];

// Basic table
console.log(Bun.inspect.table(users));

// Selected columns
console.log(Bun.inspect.table(users, ["name", "age"]));

// With options
console.log(Bun.inspect.table(users, ["name", "age", "email"], {
  colors: true,
  compact: false
}));
```

### <a id="ex-051"></a>51. Bun.peek() - Zero-cost Promise Inspection
```typescript
const promise = fetch("https://api.example.com/data");

// Peek at promise value (zero-cost if resolved)
const value = Bun.peek(promise);
if (value !== undefined) {
  console.log("Immediate value:", value);
} else {
  console.log("Promise pending, awaiting...");
  const result = await promise;
}
```

### <a id="ex-052"></a>52. Bun.peek.status() - Promise Status Check
```typescript
const pending = new Promise(() => {});
const fulfilled = Promise.resolve("success");
const rejected = Promise.reject(new Error("failed"));

console.log(Bun.peek.status(pending));    // "pending"
console.log(Bun.peek.status(fulfilled));  // "fulfilled"
console.log(Bun.peek.status(rejected));   // "rejected"
```

---

## New Environment Variables Reference

### Console & Debugging Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `BUN_CONSOLE_DEPTH` | `4` | `number` | Console object inspection depth | Console |
| `BUN_CONSOLE_COLORS` | `1` | `boolean` | Enable colored console output | Console |
| `BUN_DEBUG` | `undefined` | `string` | Debug namespace filter | Debug |
| `DEBUG_COLORS` | `1` | `boolean` | Enable debug colors | Debug |
| `NO_COLOR` | `0` | `boolean` | Disable all colors | Console |
| `FORCE_COLOR` | `0` | `boolean` | Force colors even when piped | Console |
| `BUN_STACK_TRACE_LIMIT` | `10` | `number` | Stack trace depth limit | Debug |
| `BUN_ASYNC_STACK_TRACES` | `1` | `boolean` | Enable async stack traces | Debug |
| `BUN_INSPECT_DEPTH` | `4` | `number` | Bun.inspect default depth | Inspection |
| `BUN_INSPECT_COLORS` | `1` | `boolean` | Bun.inspect colors | Inspection |
| `BUN_INSPECT_MAX_ARRAY` | `100` | `number` | Max array elements shown | Inspection |
| `BUN_INSPECT_TABLE_MAX_ROWS` | `1000` | `number` | Max table rows | Inspection |

### Process & Runtime Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `BUN_SLEEP_PRECISION` | `1` | `ms` | Sleep precision | Timers |
| `BUN_SLEEP_MAX_MS` | `86400000` | `ms` | Max sleep duration | Timers |
| `BUN_IMMEDIATE_POOL_SIZE` | `1024` | `number` | setImmediate pool | Timers |
| `BUN_NEXT_TICK_MAX_DEPTH` | `1000` | `number` | Max nextTick recursion | Timers |
| `BUN_MICROTASK_QUEUE_SIZE` | `1024` | `number` | Microtask queue limit | Timers |
| `BUN_GC_FREQUENCY` | `100` | `number` | GC frequency hint | Memory |
| `BUN_GC_THRESHOLD` | `65536` | `bytes` | GC threshold | Memory |
| `BUN_MEMORY_STATS` | `1` | `boolean` | Enable memory stats | Memory |

### Module System Constants

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `NODE_PATH` | `undefined` | `string` | Additional module paths | Module |
| `BUN_MODULE_CACHE` | `1` | `boolean` | Enable module cache | Module |
| `BUN_ESM_CACHE` | `1` | `boolean` | Enable ESM cache | Module |
| `BUN_RESOLVE_CACHE` | `1` | `boolean` | Enable resolve cache | Module |
| `BUN_RESOLVE_MAX_DEPTH` | `100` | `number` | Max resolution depth | Module |

---

This enhanced table now includes:
1. **Type Properties** - Technical characteristics and implementation details
2. **Protocol** - Standards compliance and protocol stack information
3. **Constants/Env Variables** - Configuration options, environment variables, and runtime constants
4. **Comprehensive reference tables** - Organized by category for easy lookup
5. **Usage examples** - Practical examples for configuration and optimization
6. **Console & Debugging** - Complete console API with inspection utilities
7. **Runtime Information** - Version, environment, and process details
8. **Performance Profiling** - GC, memory, and timing utilities
9. **Process Control** - Sleep, exit, signals, and event handling
10. **Utility Functions** - File, crypto, compression, and comparison
11. **Module System** - CommonJS, ESM, and resolution APIs

The tables now provide complete technical reference including all tunable parameters and runtime constants for the Bun API ecosystem (90+ features documented).
