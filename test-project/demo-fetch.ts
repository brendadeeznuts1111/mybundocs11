// ====================================================================
// Bun Fetch API - Complete Performance & Features Demo
// Based on: https://bun.com/docs/runtime/networking/fetch#performance
// ESLint disabled for demo code with intentionally unused variables
// eslint-disable @typescript-eslint/no-unused-vars
// ====================================================================

// Demo: Fetch from LOCAL server (port 3000)
console.log("=== Fetching from LOCAL server (example.com:3000) ===");
const localResponse = await fetch("http://example.com:3000/test", {
  verbose: true,
});
const localData = await localResponse.json();
console.log("Response:", localData);

console.log("\n");

// Demo: Fetch from REAL example.com (port 80)
console.log("=== Fetching from REAL example.com (port 80) ===");
const realResponse = await fetch("http://example.com", {
  verbose: true,
});
const realData = await realResponse.text();
console.log("Response (truncated):", realData.substring(0, 100) + "...");

console.log("\n");

// ====================================================================
// SECTION 1: Response Body Reading Methods (Performance Optimized)
// Bun provides optimized methods for reading response bodies
// https://bun.com/docs/runtime/networking/fetch#response-buffering
// ====================================================================

console.log("=== SECTION 1: Response Body Reading Methods ===");

// 1. response.text() - Returns Promise<string>
const textResponse = await fetch("http://example.com");
const textData: string = await textResponse.text();
console.log("text():", textData.substring(0, 50) + "...");

// 2. response.json() - Returns Promise<any>
// Note: Requires endpoint returning valid JSON
try {
  const jsonResponse = await fetch("http://example.com");
  if (jsonResponse.headers.get("content-type")?.includes("application/json")) {
    const jsonData: any = await jsonResponse.json();
    console.log("json():", jsonData);
  } else {
    console.log("json(): Not a JSON endpoint (content-type is not application/json)");
  }
} catch (e) {
  console.log("json(): Error -", (e as Error).message);
}

// 3. response.formData() - Returns Promise<FormData>
try {
  const formDataResponse = await fetch("http://example.com");
  if (formDataResponse.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
    const formData: FormData = await formDataResponse.formData();
    console.log("formData():", formData);
  } else {
    console.log("formData(): Not a form endpoint");
  }
} catch (e) {
  console.log("formData(): Error -", (e as Error).message);
}

// 4. response.bytes() - Returns Promise<Uint8Array> (fastest for binary)
try {
  const bytesResponse = await fetch("http://example.com");
  // Type assertion for Bun-specific Response methods
  const bytesData: Uint8Array = await (bytesResponse as any).bytes();
  console.log("bytes():", bytesData.length, "bytes (fastest binary reading)");
} catch (e) {
  console.log("bytes(): Error -", (e as Error).message);
}

// 5. response.arrayBuffer() - Returns Promise<ArrayBuffer>
try {
  const arrayBufferResponse = await fetch("http://example.com");
  const arrayBufferData: ArrayBuffer = await arrayBufferResponse.arrayBuffer();
  console.log("arrayBuffer():", arrayBufferData.byteLength, "bytes");
} catch (e) {
  console.log("arrayBuffer(): Error -", (e as Error).message);
}

// 6. response.blob() - Returns Promise<Blob>
try {
  const blobResponse = await fetch("http://example.com");
  const blobData: Blob = await blobResponse.blob();
  console.log("blob():", blobData.size, "bytes, type:", blobData.type);
} catch (e) {
  console.log("blob(): Error -", (e as Error).message);
}

// ====================================================================
// SECTION 2: Bun.write - Write Response Body Directly to File
// https://bun.com/docs/runtime/networking/fetch#response-buffering
// ====================================================================

console.log("\n=== SECTION 2: Writing Response Body to File with Bun.write ===");
import { write } from "bun";

const fileResponse = await fetch("http://example.com");
await write("output.txt", fileResponse);
console.log("Response body written to output.txt using Bun.write()");

// ====================================================================
// SECTION 3: Streaming Response Bodies
// https://bun.com/docs/runtime/networking/fetch#streaming-response-bodies
// ====================================================================

console.log("\n=== SECTION 3: Streaming Response Bodies ===");

const streamResponse = await fetch("http://example.com");
console.log("Streaming response body chunks:");
let chunkCount = 0;
let totalBytes = 0; // Declare totalBytes
// Use reader approach instead of for-await for better compatibility
const reader = streamResponse.body!.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  chunkCount++;
  totalBytes += value.length;
}
console.log(`  Total chunks received: ${chunkCount}, Total bytes: ${totalBytes}`);

// Direct stream access
const stream2 = streamResponse.body;
const reader2 = stream2!.getReader(); // Rename to reader2 to avoid redeclaration
const { value, done: _done } = await reader.read(); // _done indicates intentionally unused
console.log("Direct ReadableStream access - First chunk:", value?.length, "bytes");

// ====================================================================
// SECTION 4: DNS Prefetching & Caching
// https://bun.com/docs/runtime/networking/fetch#dns-prefetching
// ====================================================================

console.log("\n=== SECTION 4: DNS Prefetching & Caching ===");

import { dns } from "bun";

// Prefetch DNS for a host we'll need soon
dns.prefetch("example.com");
console.log("DNS prefetched for example.com");

// Check DNS cache stats
const cacheStats = dns.getCacheStats();
console.log("DNS cache stats:", cacheStats);

// ====================================================================
// SECTION 5: Preconnect to Host
// https://bun.com/docs/runtime/networking/fetch#preconnect-to-a-host
// ====================================================================

console.log("\n=== SECTION 5: Preconnect to Host ===");

// Preconnect to a host (starts DNS + TCP + TLS early)
try {
  // Preconnect with HTTPS options
  (fetch as any).preconnect("https://example.com");
  console.log("Preconnected to https://example.com (DNS + TCP + TLS started)");
} catch (e) {
  console.log("Preconnect:", (e as Error).message);
}

// Note: Preconnecting only helps if you call fetch after a short delay
// It's useful when you know you'll need the connection soon

// ====================================================================
// SECTION 6: Connection Pooling & Keep-Alive
// https://bun.com/docs/runtime/networking/fetch#connection-pooling--http-keep-alive
// ====================================================================

console.log("\n=== SECTION 6: Connection Pooling & Keep-Alive ===");

// Connection pooling is automatic in Bun - same-host requests reuse connections
// You can disable keep-alive per-request:
const keepAliveDisabled = await fetch("http://example.com", {
  keepalive: false, // Disable connection reuse for this request
}); // Variable intentionally unused for demo - focus is on option usage
console.log("Keep-alive disabled request completed");

// Or use "Connection: close" header to disable keep-alive
const connectionClose = await fetch("http://example.com", {
  headers: { "Connection": "close" },
}); // Variable intentionally unused for demo - focus is on header usage
console.log("Connection: close header request completed");

// ====================================================================
// SECTION 7: Timeout with AbortSignal
// https://bun.com/docs/runtime/networking/fetch#fetching-a-url-with-a-timeout
// ====================================================================

console.log("\n=== SECTION 7: Timeout with AbortSignal ===");

// Fetch with 10 second timeout
try {
  const timeoutResponse = await fetch("http://example.com", {
    signal: AbortSignal.timeout(10000), // 10 seconds
  });
  console.log("Timeout fetch completed:", timeoutResponse.status);
} catch (e) {
  if ((e as Error).name === "AbortError") {
    console.log("Fetch timed out (took longer than 10 seconds)");
  } else {
    console.log("Fetch error:", (e as Error).message);
  }
}

// ====================================================================
// SECTION 8: Request Cancellation with AbortController
// https://bun.com/docs/runtime/networking/fetch#canceling-a-request
// ====================================================================

console.log("\n=== SECTION 8: Request Cancellation with AbortController ===");

const controller = new AbortController();

// Cancel request after 100ms (too fast to complete)
setTimeout(() => controller.abort(), 100);

try {
  const cancelResponse = await fetch("http://example.com", {
    signal: controller.signal,
  }); // Variable intentionally unused for demo - testing cancellation
  console.log("Request completed before cancellation");
} catch (e) {
  if ((e as Error).name === "AbortError") {
    console.log("Request was cancelled successfully");
  } else {
    console.log("Error:", (e as Error).message);
  }
}

// ====================================================================
// SECTION 9: Custom Headers
// https://bun.com/docs/runtime/networking/fetch#custom-headers
// ====================================================================

console.log("\n=== SECTION 9: Custom Headers ===");

const customHeadersResponse = await fetch("http://example.com", {
  headers: {
    "X-Custom-Header": "custom-value",
    "Accept": "application/json",
    "User-Agent": "Bun-Fetch-Demo/1.0",
  },
});
console.log("Custom headers request completed:", customHeadersResponse.status);

// Using Headers object
const headers = new Headers();
headers.append("X-Custom-Header", "value-from-headers-object");
headers.append("Authorization", "Bearer my-token");

const headersObjectResponse = await fetch("http://example.com", { headers });
console.log("Headers object request completed:", headersObjectResponse.status);

// ====================================================================
// SECTION 10: POST Request with Body
// https://bun.com/docs/runtime/networking/fetch#sending-a-post-request
// ====================================================================

console.log("\n=== SECTION 10: POST Request with Body ===");

// POST with string body
const postStringResponse = await fetch("http://httpbin.org/post", {
  method: "POST",
  body: "Hello, world!",
});
console.log("POST string body:", postStringResponse.status);

// POST with JSON body
const postJsonResponse = await fetch("http://httpbin.org/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Bun", version: "1.0" }),
});
const postJsonResult = await postJsonResponse.json();
console.log("POST JSON body - json:", postJsonResult.json);

// POST with FormData
const formData = new FormData();
formData.append("name", "Bun");
formData.append("version", "1.0");

const postFormDataResponse = await fetch("http://httpbin.org/post", {
  method: "POST",
  body: formData,
});
const postFormDataResult = await postFormDataResponse.json();
console.log("POST FormData - fields:", Object.keys(postFormDataResult.form));

// POST with ArrayBuffer
const arrayBuffer = new ArrayBuffer(8);
const view = new DataView(arrayBuffer);
view.setFloat64(0, Math.PI, true);
const postArrayBufferResponse = await fetch("http://httpbin.org/post", {
  method: "POST",
  body: arrayBuffer,
  headers: { "Content-Type": "application/octet-stream" },
});
console.log("POST ArrayBuffer:", postArrayBufferResponse.status);

// ====================================================================
// SECTION 11: Proxy Support
// https://bun.com/docs/runtime/networking/fetch#proxying-requests
// ====================================================================

console.log("\n=== SECTION 11: Proxy Support ===");

// Simple proxy (requires running proxy server)
try {
  const proxyResponse = await fetch("http://example.com", {
    proxy: "http://proxy.example.com:8080",
  } as any); // Bun-specific extension
  console.log("Proxy request:", proxyResponse.status);
} catch (e) {
  console.log("Proxy request: Failed (no proxy server running - expected)");
}

// Proxy with custom headers
try {
  const proxyWithHeaders = await fetch("http://example.com", {
    proxy: {
      url: "http://proxy.example.com:8080",
      headers: {
        "Proxy-Authorization": "Bearer my-proxy-token",
        "X-Custom-Proxy-Header": "value",
      },
    },
  } as any); // Bun-specific extension
  console.log("Proxy with headers:", proxyWithHeaders.status);
} catch (e) {
  console.log("Proxy with headers: Failed (no proxy server running - expected)");
}

// ====================================================================
// SECTION 12: TLS/SSL Options
// https://bun.com/docs/runtime/networking/fetch#tls
// ====================================================================

console.log("\n=== SECTION 12: TLS/SSL Options ===");

// With client certificate
// const certResponse = await fetch("https://example.com", {
//   tls: {
//     key: Bun.file("/path/to/key.pem"),
//     cert: Bun.file("/path/to/cert.pem"),
//     ca: [Bun.file("/path/to/ca.pem")],
//   },
// });

// Custom TLS validation
// const customTlsResponse = await fetch("https://example.com", {
//   tls: {
//     checkServerIdentity: (hostname, peerCertificate) => {
//       if (hostname !== "expected-hostname") {
//         return new Error("Certificate hostname mismatch");
//       }
//     },
//   },
// });

// Disable TLS validation (for self-signed certs only!)
const insecureResponse = await fetch("https://example.com", {
  tls: {
    rejectUnauthorized: false, // WARNING: disables SSL validation
  },
});
console.log("Insecure TLS request (rejectUnauthorized=false):", insecureResponse.status);

// ====================================================================
// SECTION 13: Unix Domain Sockets
// https://bun.com/docs/runtime/networking/fetch#unix-domain-sockets
// ====================================================================

console.log("\n=== SECTION 13: Unix Domain Sockets ===");

// Fetch via Unix socket
// const unixResponse = await fetch("https://hostname/a/path", {
//   unix: "/var/run/path/to/unix.sock",
//   method: "POST",
//   body: JSON.stringify({ message: "Hello from Bun!" }),
//   headers: { "Content-Type": "application/json" },
// });
console.log("Unix socket support available (requires valid socket path)");

// ====================================================================
// SECTION 14: Special URL Protocols
// https://bun.com/docs/runtime/networking/fetch#protocol-support
// ====================================================================

console.log("\n=== SECTION 14: Special URL Protocols ===");

// File URLs - fetch local files
const fileUrlResponse = await fetch("file:///etc/hosts");
const fileContent = await fileUrlResponse.text();
console.log("file:// URL - content length:", fileContent.length, "bytes");

// Data URLs
const dataUrlResponse = await fetch("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==");
const dataContent = await dataUrlResponse.text();
console.log("data: URL decoded:", dataContent);

// Blob URLs
const blob = new Blob(["Hello from Blob!"], { type: "text/plain" });
const blobUrl = URL.createObjectURL(blob);
const blobUrlResponse = await fetch(blobUrl);
const blobContent = await blobUrlResponse.text();
console.log("blob: URL content:", blobContent);
URL.revokeObjectURL(blobUrl); // Clean up

// ====================================================================
// SECTION 15: Streaming Request Bodies
// https://bun.com/docs/runtime/networking/fetch#streaming-request-bodies
// ====================================================================

console.log("\n=== SECTION 15: Streaming Request Bodies ===");

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("Hello");
    controller.enqueue(" ");
    controller.enqueue("World");
    controller.close();
  },
});

const streamPostResponse = await fetch("http://httpbin.org/post", {
  method: "POST",
  body: stream,
});
const streamPostResult = await streamPostResponse.json();
console.log("Stream POST - data:", streamPostResult.data);

// ====================================================================
// SECTION 16: S3 URL Support
// https://bun.com/docs/runtime/networking/fetch#s3-urls---s3
// ====================================================================

console.log("\n=== SECTION 16: S3 URL Support ===");

// Fetch from S3 with environment credentials
// const s3Response = await fetch("s3://my-bucket/path/to/object");

// Fetch from S3 with explicit credentials
// const s3WithCreds = await fetch("s3://my-bucket/path/to/object", {
//   s3: {
//     accessKeyId: "YOUR_ACCESS_KEY",
//     secretAccessKey: "YOUR_SECRET_KEY",
//     region: "us-east-1",
//   },
// });
console.log("S3 URL support available (requires valid credentials)");

// ====================================================================
// SECTION 17: Request Options - Decompression & Verbose Logging
// https://bun.com/docs/runtime/networking/fetch#request-options
// ====================================================================

console.log("\n=== SECTION 17: Request Options ===");

// Disable automatic decompression
const noDecompressResponse = await fetch("http://example.com", {
  decompress: false, // Get raw compressed response
} as any); // Variable intentionally unused for demo - testing decompress option
console.log("Request with decompress:false completed");

// Debug logging
console.log("\n=== Debug Logging Demo ===");
const verboseResponse = await fetch("http://example.com", {
  verbose: true, // Print request/response headers
} as any); // Bun-specific extension
console.log("Verbose fetch completed:", verboseResponse.status);

// Even more detailed logging
const curlVerboseResponse = await fetch("http://example.com", {
  verbose: "curl", // More detailed cURL-style output
} as any); // Bun-specific extension
console.log("cURL verbose fetch completed:", curlVerboseResponse.status);

console.log("\n=== All Fetch API Features Demo Complete ===");
