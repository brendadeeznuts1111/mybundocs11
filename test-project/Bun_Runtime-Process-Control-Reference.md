Bun Runtime & Process Control Reference

> **Official Documentation**: [bun.sh/docs](https://bun.sh/docs)

## Quick Reference Table

### Table of Contents
- [Runtime Control](#runtime-control)
- [Development Workflow](#development-workflow)
- [Debugging](#debugging)
- [Dependency & Module Resolution](#dependency--module-resolution)
- [Transpilation & Language Features](#transpilation--language-features)
- [Networking & Security](#networking--security)
- [Global Configuration & Context](#global-configuration--context)
- [Additional Resources](#additional-resources)

### Documentation Cross-References

| Category | Official Docs | Description |
|----------|---------------|-------------|
| Runtime | [bun.sh/docs/cli/run](https://bun.sh/docs/cli/run) | `bun run` command and runtime flags |
| Watch/Hot | [bun.sh/docs/runtime/hot](https://bun.sh/docs/runtime/hot) | File watching and hot reload |
| Debugger | [bun.sh/docs/runtime/debugger](https://bun.sh/docs/runtime/debugger) | Chrome DevTools debugging |
| Install | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) | Package installation |
| TypeScript | [bun.sh/docs/runtime/typescript](https://bun.sh/docs/runtime/typescript) | TypeScript support |
| JSX | [bun.sh/docs/runtime/jsx](https://bun.sh/docs/runtime/jsx) | JSX configuration |
| Loaders | [bun.sh/docs/runtime/loaders](https://bun.sh/docs/runtime/loaders) | File loaders and plugins |
| Modules | [bun.sh/docs/runtime/modules](https://bun.sh/docs/runtime/modules) | Module resolution |
| HTTP Server | [bun.sh/docs/api/http](https://bun.sh/docs/api/http) | `Bun.serve()` API |
| Fetch | [bun.sh/docs/api/fetch](https://bun.sh/docs/api/fetch) | Fetch API |
| TLS/SSL | [bun.sh/docs/api/tls](https://bun.sh/docs/api/tls) | TLS/SSL configuration |
| bunfig.toml | [bun.sh/docs/runtime/bunfig](https://bun.sh/docs/runtime/bunfig) | Configuration file |
| Env Files | [bun.sh/docs/runtime/env](https://bun.sh/docs/runtime/env) | Environment variables |

### Runtime Control
📚 Docs: [bun.sh/docs/cli/run](https://bun.sh/docs/cli/run)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f114">114</a> | `--bun`, `-b` | `boolean` | `false` | `BUN_FORCE_RUNTIME=1` | Force script to use Bun's runtime instead of Node.js | Runtime |
| <a id="f115">115</a> | `--shell` | `string` | `"system"` | `BUN_SHELL="bun"` | Control shell for package.json scripts (`bun` or `system`) | Runtime |
| <a id="f116">116</a> | `--smol` | `boolean` | `false` | `BUN_SMOL_MODE=1` | Use less memory, run GC more often | Memory |
| <a id="f117">117</a> | `--expose-gc` | `boolean` | `false` | `EXPOSE_GC=1` | Expose `gc()` on global object (doesn't affect `Bun.gc()`) | Memory |
| <a id="f118">118</a> | `--no-deprecation` | `boolean` | `false` | `NO_DEPRECATION=1` | Suppress all deprecation warnings | Errors |
| <a id="f119">119</a> | `--throw-deprecation` | `boolean` | `false` | `THROW_DEPRECATION=1` | Make deprecation warnings throw errors | Errors |
| <a id="f120">120</a> | `--title` | `string` | Process name | `PROCESS_TITLE` | Set process title (visible in `ps`, `top`) | Process |
| <a id="f121">121</a> | `--zero-fill-buffers` | `boolean` | `false` | `ZERO_FILL_BUFFERS=1` | Force `Buffer.allocUnsafe()` to be zero-filled | Memory |
| <a id="f122">122</a> | `--no-addons` | `boolean` | `false` | `NODE_NO_ADDONS=1` | Disable native addons (throws on `process.dlopen`) | Modules |
| <a id="f123">123</a> | `--unhandled-rejections` | `string` | `"warn"` | `NODE_UNHANDLED_REJECTION` | Control unhandled rejections (`strict`, `throw`, `warn`, `none`, `warn-with-error-code`) | Errors |
| <a id="f124">124</a> | `--console-depth` | `number` | `2` | `BUN_CONSOLE_DEPTH` | Default depth for `console.log` object inspection | Debugging |

### Development Workflow
📚 Docs: [bun.sh/docs/runtime/hot](https://bun.sh/docs/runtime/hot)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f125">125</a> | `--watch` | `boolean` | `false` | `BUN_WATCH=1` | Auto-restart process on file changes | Development |
| <a id="f126">126</a> | `--hot` | `boolean` | `false` | `BUN_HOT=1` | Enable hot reload (Bun runtime, test runner, bundler) | Development |
| <a id="f127">127</a> | `--no-clear-screen` | `boolean` | `false` | `BUN_NO_CLEAR_SCREEN=1` | Disable clearing terminal on reload (with `--watch`/`--hot`) | Development |

### Debugging
📚 Docs: [bun.sh/docs/runtime/debugger](https://bun.sh/docs/runtime/debugger)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f128">128</a> | `--inspect` | `string` | `9229` | `NODE_OPTIONS="--inspect"` | Activate Bun's debugger (port/host) | Debugging |
| <a id="f129">129</a> | `--inspect-wait` | `string` | `9229` | `NODE_OPTIONS="--inspect-wait"` | Activate debugger, wait for connection before executing | Debugging |
| <a id="f130">130</a> | `--inspect-brk` | `string` | `9229` | `NODE_OPTIONS="--inspect-brk"` | Activate debugger, break on first line, wait | Debugging |

### Dependency & Module Resolution
📚 Docs: [bun.sh/docs/runtime/modules](https://bun.sh/docs/runtime/modules) | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f131">131</a> | `--preload`, `-r`, `--require`, `--import` | `string` | `none` | `NODE_OPTIONS="-r module"` | Import module before others load | Modules |
| <a id="f132">132</a> | `--no-install` | `boolean` | `false` | `BUN_NO_INSTALL=1` | Disable auto-install in runtime | Dependencies |
| <a id="f133">133</a> | `--install` | `string` | `"auto"` | `BUN_INSTALL_MODE="auto"` | Auto-install behavior (`auto`, `fallback`, `force`) | Dependencies |
| <a id="f134">134</a> | `-i` | `boolean` | `false` | `BUN_AUTO_INSTALL=1` | Auto-install missing packages (`--install=fallback`) | Dependencies |
| <a id="f135">135</a> | `--prefer-offline` | `boolean` | `false` | `BUN_PREFER_OFFLINE=1` | Skip staleness checks, resolve from disk | Dependencies |
| <a id="f136">136</a> | `--prefer-latest` | `boolean` | `false` | `BUN_PREFER_LATEST=1` | Use latest versions, always check npm | Dependencies |
| <a id="f137">137</a> | `--conditions` | `string` | `none` | `NODE_CONDITIONS` | Pass custom conditions to resolve | Modules |
| <a id="f138">138</a> | `--main-fields` | `string` | Target-dependent | `BUN_MAIN_FIELDS` | Main fields lookup in package.json | Modules |
| <a id="f139">139</a> | `--preserve-symlinks` | `boolean` | `false` | `NODE_PRESERVE_SYMLINKS=1` | Preserve symlinks when resolving files | Modules |
| <a id="f140">140</a> | `--preserve-symlinks-main` | `boolean` | `false` | `NODE_PRESERVE_SYMLINKS_MAIN=1` | Preserve symlinks when resolving main entry | Modules |
| <a id="f141">141</a> | `--extension-order` | `string` | `.tsx,.ts,.jsx,.js,.json` | `BUN_EXTENSION_ORDER` | File extension resolution order | Modules |

### Transpilation & Language Features
📚 Docs: [bun.sh/docs/runtime/typescript](https://bun.sh/docs/runtime/typescript) | [bun.sh/docs/runtime/jsx](https://bun.sh/docs/runtime/jsx) | [bun.sh/docs/runtime/loaders](https://bun.sh/docs/runtime/loaders)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f142">142</a> | `--tsconfig-override` | `string` | `tsconfig.json` | `BUN_TSCONFIG` | Custom tsconfig.json path | TypeScript |
| <a id="f143">143</a> | `--define`, `-d` | `string` | `none` | `BUN_DEFINE` | Substitute K:V while parsing (JSON values) | Build |
| <a id="f144">144</a> | `--drop` | `string` | `none` | `BUN_DROP` | Remove function calls (e.g., `--drop=console`) | Build |
| <a id="f145">145</a> | `--loader`, `-l` | `string` | `none` | `BUN_LOADER` | Parse files with `.ext:loader` | Modules |
| <a id="f146">146</a> | `--no-macros` | `boolean` | `false` | `BUN_NO_MACROS=1` | Disable macros in bundler/transpiler/runtime | Macros |
| <a id="f147">147</a> | `--jsx-factory` | `string` | `React.createElement` | `BUN_JSX_FACTORY` | Function for classic JSX runtime | JSX |
| <a id="f148">148</a> | `--jsx-fragment` | `string` | `React.Fragment` | `BUN_JSX_FRAGMENT` | Function for JSX fragments | JSX |
| <a id="f149">149</a> | `--jsx-import-source` | `string` | `"react"` | `BUN_JSX_IMPORT_SOURCE` | Module specifier for JSX factory functions | JSX |
| <a id="f150">150</a> | `--jsx-runtime` | `string` | `"automatic"` | `BUN_JSX_RUNTIME` | JSX runtime (`automatic` or `classic`) | JSX |
| <a id="f151">151</a> | `--jsx-side-effects` | `boolean` | `false` | `BUN_JSX_SIDE_EFFECTS=1` | Treat JSX elements as having side effects | JSX |
| <a id="f152">152</a> | `--ignore-dce-annotations` | `boolean` | `false` | `BUN_IGNORE_DCE=1` | Ignore tree-shaking annotations like `@PURE` | Build |

### Networking & Security
📚 Docs: [bun.sh/docs/api/http](https://bun.sh/docs/api/http) | [bun.sh/docs/api/fetch](https://bun.sh/docs/api/fetch) | [bun.sh/docs/api/tls](https://bun.sh/docs/api/tls)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f153">153</a> | `--port` | `number` | `3000` | `PORT`, `BUN_PORT` | Default port for `Bun.serve()` | Network |
| <a id="f154">154</a> | `--fetch-preconnect` | `string` | `none` | `BUN_FETCH_PRECONNECT` | Preconnect to URL while code loads | Network |
| <a id="f155">155</a> | `--max-http-header-size` | `number` | `16384` | `BUN_MAX_HTTP_HEADER_SIZE` | Max HTTP header size in bytes | Network |
| <a id="f156">156</a> | `--dns-result-order` | `string` | `"verbatim"` | `BUN_DNS_RESULT_ORDER` | DNS lookup order (`verbatim`, `ipv4first`, `ipv6first`) | Network |
| <a id="f157">157</a> | `--use-system-ca` | `boolean` | `false` | `NODE_EXTRA_CA_CERTS` | Use system's trusted certificate authorities | Security |
| <a id="f158">158</a> | `--use-openssl-ca` | `boolean` | `false` | `SSL_CERT_FILE` | Use OpenSSL's default CA store | Security |
| <a id="f159">159</a> | `--use-bundled-ca` | `boolean` | `true` | `BUN_USE_BUNDLED_CA=1` | Use Bun's bundled CA store | Security |
| <a id="f160">160</a> | `--redis-preconnect` | `boolean` | `false` | `BUN_REDIS_PRECONNECT=1` | Preconnect to `$REDIS_URL` at startup | Network |
| <a id="f161">161</a> | `--sql-preconnect` | `boolean` | `false` | `BUN_SQL_PRECONNECT=1` | Preconnect to PostgreSQL at startup | Network |
| <a id="f162">162</a> | `--user-agent` | `string` | Bun default | `BUN_USER_AGENT` | Default User-Agent for HTTP requests | Network |

### Global Configuration & Context
📚 Docs: [bun.sh/docs/runtime/bunfig](https://bun.sh/docs/runtime/bunfig) | [bun.sh/docs/runtime/env](https://bun.sh/docs/runtime/env)

| # | Flag | Type | Default | Environment Variable | Description | Category |
|---|---|---|---|---|---|---|
| <a id="f163">163</a> | `--env-file` | `string` | `.env` | `BUN_ENV_FILE` | Load env vars from specified file(s) | Configuration |
| <a id="f164">164</a> | `--cwd` | `string` | Current dir | `BUN_CWD` | Absolute path to resolve files from | Configuration |
| <a id="f165">165</a> | `--config`, `-c` | `string` | `bunfig.toml` | `BUN_CONFIG` | Path to Bun config file | Configuration |

---

## Detailed Reference Tables

### Loader Reference
📚 Docs: [bun.sh/docs/runtime/loaders](https://bun.sh/docs/runtime/loaders)

| Extension | Loader | Description | MIME Type |
|-----------|--------|-------------|-----------|
| `.js` | `js` | JavaScript | `application/javascript` |
| `.jsx` | `jsx` | JSX (JavaScript) | `application/javascript` |
| `.ts` | `ts` | TypeScript | `application/typescript` |
| `.tsx` | `tsx` | TSX (TypeScript) | `application/typescript` |
| `.json` | `json` | JSON | `application/json` |
| `.toml` | `toml` | TOML | `application/toml` |
| `.txt` | `text` | Plain text | `text/plain` |
| `.text` | `text` | Plain text | `text/plain` |
| `.wasm` | `wasm` | WebAssembly | `application/wasm` |
| `.node` | `napi` | Native addon | `application/node` |
| `.css` | `file` | CSS file | `text/css` |
| `.html` | `file` | HTML file | `text/html` |
| `.svg` | `file` | SVG image | `image/svg+xml` |

### Unhandled Rejections Modes
| Mode | Behavior | Exit Code |
|------|----------|-----------|
| `strict` | Raise as uncaught exception | 1 |
| `throw` | Throw immediately (same as `strict`) | 1 |
| `warn` | Warning to stderr (default) | 0 |
| `none` | Silence | 0 |
| `warn-with-error-code` | Warning + exit code 1 | 1 |

### Install Modes
| Mode | Behavior | Use Case |
|------|----------|----------|
| `auto` | Auto-install when no node_modules | Fresh projects |
| `fallback` | Install missing packages only | Existing projects |
| `force` | Always install/update | CI/CD, Docker |

### JSX Runtime Comparison
📚 Docs: [bun.sh/docs/runtime/jsx](https://bun.sh/docs/runtime/jsx)

| Runtime | Import Required | Transpiled Output | Use Case |
|---------|----------------|-------------------|----------|
| `automatic` | No explicit import | `jsx()`/`jsxs()` calls | React 17+, modern |
| `classic` | `import React` | `React.createElement()` | Legacy React |

### DNS Result Order
| Order | IPv4 | IPv6 | Use Case |
|-------|------|------|----------|
| `verbatim` | As returned | As returned | Default, OS order |
| `ipv4first` | First | After IPv4 | IPv4 preference |
| `ipv6first` | After IPv6 | First | IPv6 preference |

---

## Configuration Examples

### Runtime Configuration Examples
```bash
# Force Bun runtime for Node.js scripts
bun --bun server.js
# or
BUN_FORCE_RUNTIME=1 bun server.js

# Use Bun's shell for scripts (faster)
bun --shell=bun run dev
# or
BUN_SHELL=bun bun run dev

# Memory-constrained environment
bun --smol --expose-gc memory-sensitive-app.js
# or
BUN_SMOL_MODE=1 EXPOSE_GC=1 bun memory-sensitive-app.js

# Production error handling
bun --no-deprecation --throw-deprecation --unhandled-rejections=strict app.js
# or
NO_DEPRECATION=1 THROW_DEPRECATION=1 NODE_UNHANDLED_REJECTION=strict bun app.js

# Custom process title
bun --title="My API Server" server.js
# or
PROCESS_TITLE="My API Server" bun server.js
```

### Development Workflow Examples
```bash
# Auto-restart on changes
bun --watch server.js
# or
BUN_WATCH=1 bun server.js

# Hot reload (for web apps)
bun --hot dev.js
# or
BUN_HOT=1 bun dev.js

# Development with hot reload but keep terminal output
bun --hot --no-clear-screen dev.js
# or
BUN_HOT=1 BUN_NO_CLEAR_SCREEN=1 bun dev.js

# Watch mode with custom conditions
bun --watch --conditions=development app.js
```

### Debugging Examples
```bash
# Start debugger on default port (9229)
bun --inspect server.js
# or
NODE_OPTIONS="--inspect" bun server.js

# Debug with custom port
bun --inspect=0.0.0.0:9230 app.js

# Wait for debugger connection
bun --inspect-wait debug-app.js
# Debugger will wait at: ws://127.0.0.1:9229/...

# Break on first line
bun --inspect-brk app.js
# or
NODE_OPTIONS="--inspect-brk" bun app.js

# Connect with Chrome DevTools
# chrome://inspect → Configure → Add localhost:9229
```

### Module & Dependency Examples
```bash
# Preload modules (like Node's -r)
bun --preload=dotenv/config app.js
bun -r dotenv/config app.js
bun --require=dotenv/config app.js
# or
NODE_OPTIONS="-r dotenv/config" bun app.js

# Auto-install behavior
bun --install=auto app.js           # Install if no node_modules
bun --install=fallback app.js       # Install missing packages only
bun -i app.js                       # Same as --install=fallback
bun --install=force app.js          # Always reinstall
# or
BUN_INSTALL_MODE=fallback bun app.js

# Skip network checks
bun --prefer-offline app.js         # Use cached packages
# or
BUN_PREFER_OFFLINE=1 bun app.js

# Always get latest
bun --prefer-latest app.js          # Check npm for updates
# or
BUN_PREFER_LATEST=1 bun app.js

# Custom module resolution
bun --conditions=development,browser app.js
bun --main-fields=module,main app.js
bun --preserve-symlinks app.js      # Don't resolve symlinks
bun --extension-order=".js,.jsx,.ts,.tsx" app.js
```

### Transpilation Examples
```bash
# Custom TypeScript config
bun --tsconfig-override=tsconfig.prod.json build.ts
# or
BUN_TSCONFIG=tsconfig.prod.json bun build.ts

# Define constants
bun --define process.env.NODE_ENV:\"production\" app.js
bun --define VERSION:\"1.0.0\" app.js
bun -d DEBUG=false app.js
# or
BUN_DEFINE='process.env.NODE_ENV:"production"' bun app.js

# Remove console.log in production
bun --drop=console app.js
# or
BUN_DROP=console bun app.js

# Custom file loaders
bun --loader .css:text app.js       # Load .css as text
bun --loader .custom:json app.js    # Load .custom as JSON
bun -l .md:text app.js              # Load .md as text
# or
BUN_LOADER=".css:text,.md:text" bun app.js

# JSX configuration
bun --jsx-factory=h --jsx-fragment=Fragment app.jsx
bun --jsx-import-source=preact app.jsx
bun --jsx-runtime=classic app.jsx   # For React <17
bun --jsx-side-effects app.jsx      # Disable pure annotations
```

### Networking Examples
```bash
# Custom port for Bun.serve()
bun --port=8080 server.js
# or
PORT=8080 bun server.js
# or
BUN_PORT=8080 bun server.js

# Preconnect to APIs
bun --fetch-preconnect=https://api.example.com app.js
# or
BUN_FETCH_PRECONNECT=https://api.example.com bun app.js

# Larger HTTP headers
bun --max-http-header-size=32768 server.js
# or
BUN_MAX_HTTP_HEADER_SIZE=32768 bun server.js

# IPv4 preference
bun --dns-result-order=ipv4first app.js
# or
BUN_DNS_RESULT_ORDER=ipv4first bun app.js

# SSL/TLS configuration
bun --use-system-ca app.js          # Use system CA store
bun --use-openssl-ca app.js         # Use OpenSSL CA store
bun --use-bundled-ca app.js         # Use Bun's CA store (default)
# or
NODE_EXTRA_CA_CERTS=/path/to/cert.pem bun app.js

# Database preconnections
bun --redis-preconnect app.js       # Preconnect to REDIS_URL
bun --sql-preconnect app.js         # Preconnect to PostgreSQL
# or
BUN_REDIS_PRECONNECT=1 bun app.js

# Custom User-Agent
bun --user-agent="MyApp/1.0" app.js
# or
BUN_USER_AGENT="MyApp/1.0" bun app.js
```

### Configuration Examples
```bash
# Custom environment files
bun --env-file=.env.production app.js
bun --env-file=.env.local,.env app.js
# or
BUN_ENV_FILE=".env.production" bun app.js

# Change working directory
bun --cwd=/path/to/project app.js
# or
BUN_CWD=/path/to/project bun app.js

# Custom config file
bun --config=bunfig.prod.toml app.js
bun -c bunfig.local.toml app.js
# or
BUN_CONFIG=bunfig.prod.toml bun app.js
```

---

## Environment Variable Reference

### Performance & Memory
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `BUN_SMOL_MODE` | `boolean` | `0` | Reduce memory usage, increase GC frequency |
| `EXPOSE_GC` | `boolean` | `0` | Expose `global.gc()` (Node.js compatibility) |
| `ZERO_FILL_BUFFERS` | `boolean` | `0` | Zero-fill buffers allocated with `allocUnsafe()` |
| `BUN_CONSOLE_DEPTH` | `number` | `2` | Default inspection depth for `console.log()` |

### Error Handling
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NO_DEPRECATION` | `boolean` | `0` | Suppress deprecation warnings |
| `THROW_DEPRECATION` | `boolean` | `0` | Throw errors for deprecations |
| `NODE_UNHANDLED_REJECTION` | `string` | `warn` | Unhandled rejection mode |

### Development
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `BUN_WATCH` | `boolean` | `0` | Enable file watching and auto-restart |
| `BUN_HOT` | `boolean` | `0` | Enable hot reload |
| `BUN_NO_CLEAR_SCREEN` | `boolean` | `0` | Disable terminal clearing on reload |

### Debugging
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_OPTIONS` | `string` | `""` | Node.js compatibility options |
| `BUN_INSPECT` | `string` | `""` | Enable inspector (port/host) |
| `BUN_INSPECT_BRK` | `string` | `""` | Break on first line |

### Dependencies
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `BUN_NO_INSTALL` | `boolean` | `0` | Disable auto-install |
| `BUN_INSTALL_MODE` | `string` | `auto` | Install behavior: `auto`, `fallback`, `force` |
| `BUN_AUTO_INSTALL` | `boolean` | `0` | Auto-install missing packages |
| `BUN_PREFER_OFFLINE` | `boolean` | `0` | Use cached packages, skip network |
| `BUN_PREFER_LATEST` | `boolean` | `0` | Always check for latest versions |

### Module Resolution
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_CONDITIONS` | `string` | `""` | Custom resolution conditions |
| `BUN_MAIN_FIELDS` | `string` | `""` | Main fields for package.json lookup |
| `NODE_PRESERVE_SYMLINKS` | `boolean` | `0` | Preserve symlinks during resolution |
| `BUN_EXTENSION_ORDER` | `string` | `.tsx,.ts,.jsx,.js,.json` | File extension priority |

### TypeScript & JSX
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `BUN_TSCONFIG` | `string` | `tsconfig.json` | Custom TypeScript config path |
| `BUN_DEFINE` | `string` | `""` | Global constant definitions |
| `BUN_DROP` | `string` | `""` | Functions to remove at build time |
| `BUN_LOADER` | `string` | `""` | Custom file extension loaders |
| `BUN_NO_MACROS` | `boolean` | `0` | Disable macro execution |
| `BUN_JSX_FACTORY` | `string` | `React.createElement` | Classic JSX factory function |
| `BUN_JSX_FRAGMENT` | `string` | `React.Fragment` | JSX fragment component |
| `BUN_JSX_IMPORT_SOURCE` | `string` | `react` | JSX runtime import source |
| `BUN_JSX_RUNTIME` | `string` | `automatic` | JSX runtime mode |
| `BUN_JSX_SIDE_EFFECTS` | `boolean` | `0` | Treat JSX as having side effects |
| `BUN_IGNORE_DCE` | `boolean` | `0` | Ignore dead code elimination hints |

### Networking
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | `number` | `3000` | Server port (also used by `Bun.serve()`) |
| `BUN_PORT` | `number` | `3000` | Alternative port variable |
| `BUN_FETCH_PRECONNECT` | `string` | `""` | URLs to preconnect at startup |
| `BUN_MAX_HTTP_HEADER_SIZE` | `number` | `16384` | Max HTTP header size (bytes) |
| `BUN_DNS_RESULT_ORDER` | `string` | `verbatim` | DNS resolution order |
| `NODE_EXTRA_CA_CERTS` | `string` | `""` | Additional CA certificates |
| `SSL_CERT_FILE` | `string` | `""` | SSL certificate file path |
| `BUN_REDIS_PRECONNECT` | `boolean` | `0` | Preconnect to Redis at startup |
| `BUN_SQL_PRECONNECT` | `boolean` | `0` | Preconnect to PostgreSQL at startup |
| `BUN_USER_AGENT` | `string` | Bun default | HTTP User-Agent header |

### Configuration
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `BUN_ENV_FILE` | `string` | `.env` | Environment file(s) to load |
| `BUN_CWD` | `string` | Current dir | Working directory for resolution |
| `BUN_CONFIG` | `string` | `bunfig.toml` | Bun configuration file path |

---

## Practical Configuration Examples

### Production Configuration
```bash
#!/bin/bash
# production.sh

export NODE_ENV=production
export BUN_SMOL_MODE=1
export BUN_CONSOLE_DEPTH=1
export NO_DEPRECATION=1
export THROW_DEPRECATION=1
export NODE_UNHANDLED_REJECTION=strict
export BUN_INSTALL_MODE=auto
export BUN_PREFER_OFFLINE=1
export BUN_NO_MACROS=1
export BUN_DROP=console.debug,console.trace
export BUN_IGNORE_DCE=0
export PORT=8080
export BUN_MAX_HTTP_HEADER_SIZE=32768
export BUN_DNS_RESULT_ORDER=ipv4first
export BUN_USE_BUNDLED_CA=1
export BUN_ENV_FILE=".env.production"
export BUN_CONFIG="bunfig.production.toml"

bun --cwd=/app server.js
```

### Development Configuration
```bash
#!/bin/bash
# development.sh

export NODE_ENV=development
export BUN_WATCH=1
export BUN_HOT=1
export BUN_NO_CLEAR_SCREEN=0
export BUN_CONSOLE_DEPTH=4
export NODE_UNHANDLED_REJECTION=warn
export BUN_INSTALL_MODE=fallback
export BUN_AUTO_INSTALL=1
export BUN_PREFER_LATEST=0
export BUN_NO_MACROS=0
export BUN_JSX_RUNTIME=automatic
export BUN_JSX_SIDE_EFFECTS=1
export PORT=3000
export BUN_FETCH_PRECONNECT="http://localhost:3000,http://localhost:5432"
export BUN_ENV_FILE=".env.development,.env.local"
export BUN_CONFIG="bunfig.development.toml"

bun --inspect server.js
```

### Testing Configuration
```bash
#!/bin/bash
# test.sh

export NODE_ENV=test
export BUN_SMOL_MODE=0
export BUN_CONSOLE_DEPTH=2
export NO_DEPRECATION=0
export THROW_DEPRECATION=0
export NODE_UNHANDLED_REJECTION=throw
export BUN_NO_INSTALL=1  # Tests should have dependencies already
export BUN_NO_MACROS=0
export BUN_IGNORE_DCE=1  # Keep test helpers
export PORT=0  # Random port for tests
export BUN_USE_SYSTEM_CA=1
export BUN_ENV_FILE=".env.test"
export BUN_CONFIG="bunfig.test.toml"

bun test
```

### Docker Container Configuration
```dockerfile
# Dockerfile
FROM oven/bun:1-alpine

# Runtime configuration
ENV NODE_ENV=production
ENV BUN_SMOL_MODE=1
ENV BUN_CONSOLE_DEPTH=1
ENV BUN_INSTALL_MODE=auto
ENV BUN_PREFER_OFFLINE=1
ENV PORT=8080
ENV BUN_MAX_HTTP_HEADER_SIZE=32768
ENV BUN_USE_BUNDLED_CA=1

# Copy application
WORKDIR /app
COPY . .

# Install dependencies
RUN bun install --production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --cwd=/app run healthcheck || exit 1

# Run with optimized flags
CMD ["bun", "--smol", "--no-deprecation", "--title=app-server", "server.js"]
```

---

## Additional Resources

### Official Bun Documentation

| Resource | URL | Description |
|----------|-----|-------------|
| Main Docs | [bun.sh/docs](https://bun.sh/docs) | Complete Bun documentation |
| CLI Reference | [bun.sh/docs/cli](https://bun.sh/docs/cli) | All CLI commands |
| Runtime APIs | [bun.sh/docs/api](https://bun.sh/docs/api) | Bun-specific APIs |
| Runtime Reference | [bun.sh/docs/runtime](https://bun.sh/docs/runtime) | Runtime configuration |
| Bundler | [bun.sh/docs/bundler](https://bun.sh/docs/bundler) | Build and bundle |
| Test Runner | [bun.sh/docs/cli/test](https://bun.sh/docs/cli/test) | Testing with Bun |
| Package Manager | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) | Package installation |

### Quick Links by Topic

| Topic | Documentation |
|-------|---------------|
| `bun run` | [bun.sh/docs/cli/run](https://bun.sh/docs/cli/run) |
| `bun install` | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) |
| `bun build` | [bun.sh/docs/bundler](https://bun.sh/docs/bundler) |
| `bun test` | [bun.sh/docs/cli/test](https://bun.sh/docs/cli/test) |
| `Bun.serve()` | [bun.sh/docs/api/http](https://bun.sh/docs/api/http) |
| `Bun.file()` | [bun.sh/docs/api/file-io](https://bun.sh/docs/api/file-io) |
| `Bun.spawn()` | [bun.sh/docs/api/spawn](https://bun.sh/docs/api/spawn) |
| SQLite | [bun.sh/docs/api/sqlite](https://bun.sh/docs/api/sqlite) |
| WebSockets | [bun.sh/docs/api/websockets](https://bun.sh/docs/api/websockets) |
| Workers | [bun.sh/docs/api/workers](https://bun.sh/docs/api/workers) |

### Community Resources

| Resource | URL |
|----------|-----|
| GitHub | [github.com/oven-sh/bun](https://github.com/oven-sh/bun) |
| Discord | [bun.sh/discord](https://bun.sh/discord) |
| Blog | [bun.sh/blog](https://bun.sh/blog) |
| Releases | [github.com/oven-sh/bun/releases](https://github.com/oven-sh/bun/releases) |

---

*Last Updated: 2025-12-26*
*Bun Version: 1.3.6*
