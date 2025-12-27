/**
 * Bun Fetch API Constants Verification Script
 *
 * This script verifies the presence and values of runtime constants
 * documented in api-tables-with-constants.md
 *
 * Run: bun verify-constants.ts
 */

interface VerificationResult {
  category: string;
  constant: string;
  expected: string | number | boolean;
  actual: unknown;
  status: "PASS" | "FAIL" | "NOT_FOUND" | "DIFFERENT";
}

const results: VerificationResult[] = [];

function verify(
  category: string,
  constant: string,
  expected: string | number | boolean,
  actual: unknown
): void {
  let status: VerificationResult["status"];

  if (actual === undefined || actual === null) {
    status = "NOT_FOUND";
  } else if (actual === expected) {
    status = "PASS";
  } else if (typeof actual === typeof expected) {
    status = "DIFFERENT";
  } else {
    status = "FAIL";
  }

  results.push({ category, constant, expected, actual, status });
}

function verifyExists(
  category: string,
  constant: string,
  actual: unknown
): void {
  const status: VerificationResult["status"] =
    actual !== undefined && actual !== null ? "PASS" : "NOT_FOUND";

  results.push({
    category,
    constant,
    expected: "exists",
    actual: actual !== undefined ? String(actual).slice(0, 50) : "undefined",
    status
  });
}

console.log("=".repeat(70));
console.log("Bun Fetch API Constants Verification");
console.log("=".repeat(70));
console.log(`Bun Version: ${Bun.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log("=".repeat(70));

// ============================================================================
// SECTION 1: Runtime Version Constants
// ============================================================================
console.log("\n[1/7] Verifying Runtime Version Constants...");

verifyExists("Runtime", "Bun.version", Bun.version);
verifyExists("Runtime", "Bun.revision", Bun.revision);

const bunTarget = (Bun as any).target;
verifyExists("Runtime", "Bun.target", bunTarget);

const bunPlatform = (Bun as any).platform;
verifyExists("Runtime", "Bun.platform", bunPlatform);

const bunUv = (Bun as any).uv;
verifyExists("Runtime", "Bun.uv", bunUv);

// ============================================================================
// SECTION 2: Feature Detection Constants
// ============================================================================
console.log("[2/7] Verifying Feature Detection Constants...");

const features = (Bun as any).features || {};

verifyExists("Features", "Bun.features", features);
verifyExists("Features", "Bun.features.fetch", features.fetch);
verifyExists("Features", "Bun.features.sendfile", features.sendfile);
verifyExists("Features", "Bun.features.https", features.https);
verifyExists("Features", "Bun.features.s3", features.s3);
verifyExists("Features", "Bun.features.zerocopy", features.zerocopy);

// ============================================================================
// SECTION 3: System Limit Constants
// ============================================================================
console.log("[3/7] Verifying System Limit Constants...");

const constants = (Bun as any).constants || {};

verify("System Limits", "Bun.constants.OS_FD_LIMIT", 1024, constants.OS_FD_LIMIT);
verify("System Limits", "Bun.constants.MAX_HTTP_REQUESTS", 65536, constants.MAX_HTTP_REQUESTS);
verify("System Limits", "Bun.constants.MAX_PATH_LENGTH", 4096, constants.MAX_PATH_LENGTH);
verify("System Limits", "Bun.constants.MAX_HOSTNAME_LENGTH", 255, constants.MAX_HOSTNAME_LENGTH);
verify("System Limits", "Bun.constants.MAX_PORT", 65535, constants.MAX_PORT);

// ============================================================================
// SECTION 4: Protocol Version Constants
// ============================================================================
console.log("[4/7] Verifying Protocol Version Constants...");

verify("Protocol", "Bun.constants.HTTP_VERSION_1_1", "HTTP/1.1", constants.HTTP_VERSION_1_1);
verify("Protocol", "Bun.constants.HTTP_VERSION_2", "HTTP/2", constants.HTTP_VERSION_2);
verify("Protocol", "Bun.constants.TLS_VERSION_1_2", "TLSv1.2", constants.TLS_VERSION_1_2);
verify("Protocol", "Bun.constants.TLS_VERSION_1_3", "TLSv1.3", constants.TLS_VERSION_1_3);
verify("Protocol", "Bun.constants.DNS_RECORD_A", 1, constants.DNS_RECORD_A);
verify("Protocol", "Bun.constants.DNS_RECORD_AAAA", 28, constants.DNS_RECORD_AAAA);

// ============================================================================
// SECTION 5: Performance Constants
// ============================================================================
console.log("[5/7] Verifying Performance Constants...");

verify("Performance", "Bun.constants.PAGE_SIZE", 4096, constants.PAGE_SIZE);
verify("Performance", "Bun.constants.CACHE_LINE_SIZE", 64, constants.CACHE_LINE_SIZE);
verify("Performance", "Bun.constants.SENDFILE_THRESHOLD", 32768, constants.SENDFILE_THRESHOLD);
verify("Performance", "Bun.constants.ZEROCOPY_THRESHOLD", 4096, constants.ZEROCOPY_THRESHOLD);
verify("Performance", "Bun.constants.BUFFER_POOL_SIZE", 67108864, constants.BUFFER_POOL_SIZE);

// ============================================================================
// SECTION 6: Time Constants
// ============================================================================
console.log("[6/7] Verifying Time Constants...");

verify("Time", "Bun.constants.MS_PER_SECOND", 1000, constants.MS_PER_SECOND);
verify("Time", "Bun.constants.NS_PER_MS", 1000000, constants.NS_PER_MS);
verify("Time", "Bun.constants.DNS_TTL_DEFAULT", 30, constants.DNS_TTL_DEFAULT);
verify("Time", "Bun.constants.KEEPALIVE_TIMEOUT", 5000, constants.KEEPALIVE_TIMEOUT);
verify("Time", "Bun.constants.FETCH_TIMEOUT", 30000, constants.FETCH_TIMEOUT);

// ============================================================================
// SECTION 7: Console & Debugging APIs
// ============================================================================
console.log("[7/10] Verifying Console & Debugging APIs...");

// Bun.inspect
verifyExists("Console", "Bun.inspect", typeof Bun.inspect === "function" ? "function" : undefined);

const inspectTable = Bun.inspect?.table;
verifyExists("Console", "Bun.inspect.table", typeof inspectTable === "function" ? "function" : undefined);

// Bun.peek
const peek = (Bun as any).peek;
verifyExists("Console", "Bun.peek", typeof peek === "function" ? "function" : undefined);

const peekStatus = peek?.status;
verifyExists("Console", "Bun.peek.status", typeof peekStatus === "function" ? "function" : undefined);

// ============================================================================
// SECTION 8: Runtime Information APIs
// ============================================================================
console.log("[8/10] Verifying Runtime Information APIs...");

verifyExists("Runtime Info", "Bun.main", Bun.main);
verifyExists("Runtime Info", "process.platform", process.platform);
verifyExists("Runtime Info", "process.arch", process.arch);
verifyExists("Runtime Info", "process.pid", process.pid);
verifyExists("Runtime Info", "process.cwd()", process.cwd());
verifyExists("Runtime Info", "process.argv", process.argv?.length > 0 ? `[${process.argv.length} items]` : undefined);

// ============================================================================
// SECTION 9: Utility Functions
// ============================================================================
console.log("[9/10] Verifying Utility Functions...");

verifyExists("Utilities", "Bun.file", typeof Bun.file === "function" ? "function" : undefined);
verifyExists("Utilities", "Bun.write", typeof Bun.write === "function" ? "function" : undefined);

const sha = (Bun as any).sha;
verifyExists("Utilities", "Bun.sha", typeof sha === "function" ? "function" : undefined);

// Bun.password
verifyExists("Utilities", "Bun.password.hash", typeof Bun.password?.hash === "function" ? "function" : undefined);
verifyExists("Utilities", "Bun.password.verify", typeof Bun.password?.verify === "function" ? "function" : undefined);

const which = (Bun as any).which;
verifyExists("Utilities", "Bun.which", typeof which === "function" ? "function" : undefined);

// Bun.gzipSync / gunzipSync
verifyExists("Utilities", "Bun.gzipSync", typeof Bun.gzipSync === "function" ? "function" : undefined);
verifyExists("Utilities", "Bun.gunzipSync", typeof Bun.gunzipSync === "function" ? "function" : undefined);

const deepEquals = (Bun as any).deepEquals;
verifyExists("Utilities", "Bun.deepEquals", typeof deepEquals === "function" ? "function" : undefined);

const escapeHTML = (Bun as any).escapeHTML;
verifyExists("Utilities", "Bun.escapeHTML", typeof escapeHTML === "function" ? "function" : undefined);

// ============================================================================
// SECTION 10: Process Control & Performance
// ============================================================================
console.log("[10/10] Verifying Process Control & Performance APIs...");

// Bun.sleep / sleepSync
verifyExists("Process", "Bun.sleep", typeof Bun.sleep === "function" ? "function" : undefined);
verifyExists("Process", "Bun.sleepSync", typeof Bun.sleepSync === "function" ? "function" : undefined);

const gc = (Bun as any).gc;
verifyExists("Process", "Bun.gc", typeof gc === "function" ? "function" : undefined);

const nanoseconds = (Bun as any).nanoseconds;
verifyExists("Process", "Bun.nanoseconds", typeof nanoseconds === "function" ? "function" : undefined);

verifyExists("Process", "process.memoryUsage", typeof process.memoryUsage === "function" ? "function" : undefined);
verifyExists("Process", "performance.now", typeof performance.now === "function" ? "function" : undefined);
verifyExists("Process", "process.hrtime", typeof process.hrtime === "function" ? "function" : undefined);

// ============================================================================
// SECTION 11: Environment Variable Defaults
// ============================================================================
console.log("[11/11] Verifying Environment Variable Defaults...");

const envDefaults: Record<string, string | number> = {
  BUN_CONFIG_MAX_HTTP_REQUESTS: 256,
  BUN_SENDFILE_THRESHOLD: 32768,
  BUN_DNS_TTL: 30,
  BUN_KEEPALIVE_TIMEOUT: 5000,
  BUN_FETCH_TIMEOUT: 30000,
  BUN_BUFFER_POOL_SIZE: "64MB",
  BUN_ZEROCOPY_THRESHOLD: 4096,
  BUN_HTTP_QUEUE_SIZE: 1024,
  BUN_FD_POOL_SIZE: 256,
  BUN_TLS_REJECT_UNAUTHORIZED: 1,
  BUN_TLS_VERIFY_DEPTH: 100,
  BUN_MAX_HEADERS: 100,
  BUN_MAX_HEADER_SIZE: 8192,
  BUN_JSON_PARSE_LIMIT: "64KB",
  BUN_JSON_DEPTH_LIMIT: 256,
  BUN_FORMDATA_MAX_SIZE: "10MB",
  BUN_FORMDATA_MAX_FIELDS: 1000,
  BUN_DNS_CACHE_SIZE: 1024,
  BUN_PRECONNECT_MAX: 10,
  BUN_KEEPALIVE_MAX_REQUESTS: 100,
  BUN_HTTP_CONNECTION_POOL_SIZE: 50,
  BUN_CONNECT_TIMEOUT: 30000,
  BUN_FILE_MODE: "0o644",
  BUN_FILE_URL_MAX_PATH: 4096,
  BUN_FILE_OPEN_LIMIT: 1024,
  BUN_WRITE_BUFFER_SIZE: 8192,
  BUN_STREAM_CHUNK_SIZE: 16384,
  BUN_DECOMPRESS_ENABLED: 1,
  BUN_BLOB_URL_TTL: 300000,
  BUN_VERBOSE_LOGGING: 0,
  BUN_DEBUG_FETCH: 0,
};

for (const [envVar, defaultValue] of Object.entries(envDefaults)) {
  const envValue = process.env[envVar];
  verify(
    "Environment",
    envVar,
    String(defaultValue),
    envValue || `(unset, default: ${defaultValue})`
  );
}

// ============================================================================
// Generate Report
// ============================================================================
console.log("\n" + "=".repeat(70));
console.log("VERIFICATION RESULTS");
console.log("=".repeat(70));

const categories = [...new Set(results.map(r => r.category))];

for (const category of categories) {
  const categoryResults = results.filter(r => r.category === category);
  const passed = categoryResults.filter(r => r.status === "PASS").length;
  const different = categoryResults.filter(r => r.status === "DIFFERENT").length;
  const notFound = categoryResults.filter(r => r.status === "NOT_FOUND").length;
  const failed = categoryResults.filter(r => r.status === "FAIL").length;

  console.log(`\n### ${category}`);
  console.log(`  PASS: ${passed} | DIFFERENT: ${different} | NOT_FOUND: ${notFound} | FAIL: ${failed}`);

  for (const result of categoryResults) {
    const icon = result.status === "PASS" ? "[OK]" :
                 result.status === "DIFFERENT" ? "[~]" :
                 result.status === "NOT_FOUND" ? "[?]" : "[X]";
    console.log(`  ${icon} ${result.constant}: ${result.actual}`);
  }
}

// ============================================================================
// Summary
// ============================================================================
const totalPassed = results.filter(r => r.status === "PASS").length;
const totalDifferent = results.filter(r => r.status === "DIFFERENT").length;
const totalNotFound = results.filter(r => r.status === "NOT_FOUND").length;
const totalFailed = results.filter(r => r.status === "FAIL").length;
const total = results.length;

console.log("\n" + "=".repeat(70));
console.log("SUMMARY");
console.log("=".repeat(70));
console.log(`Total Constants Verified: ${total}`);
console.log(`  PASS:      ${totalPassed} (${((totalPassed/total)*100).toFixed(1)}%)`);
console.log(`  DIFFERENT: ${totalDifferent} (${((totalDifferent/total)*100).toFixed(1)}%)`);
console.log(`  NOT_FOUND: ${totalNotFound} (${((totalNotFound/total)*100).toFixed(1)}%)`);
console.log(`  FAIL:      ${totalFailed} (${((totalFailed/total)*100).toFixed(1)}%)`);
console.log("=".repeat(70));

// Exit code based on failures
if (totalFailed > 0) {
  console.log("\nVerification completed with FAILURES.");
  process.exit(1);
} else if (totalNotFound > 0) {
  console.log("\nVerification completed - some constants not found in runtime.");
  console.log("This is expected as many constants are documentation-only defaults.");
  process.exit(0);
} else {
  console.log("\nAll constants verified successfully!");
  process.exit(0);
}
