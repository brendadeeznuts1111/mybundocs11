# Bun Fetch API Demo CLI

Interactive CLI tool to demonstrate Bun's Fetch API capabilities for your team.

## Quick Start

```bash
# Run with Bun
cd bun-fetch-demo
bun run bin/cli.ts

# Or build and run standalone
bun run --cwd bin/cli.ts all
```

## Usage

### Interactive Mode
```bash
bun run bin/cli.ts
```
Shows an interactive menu with numbered options.

### Command Line Mode
```bash
# Run specific feature
bun run bin/cli.ts 1
bun run bin/cli.ts 2
# ...
bun run bin/cli.ts 12

# Run all features
bun run bin/cli.ts all

# Show documentation
bun run bin/cli.ts docs

# Show help
bun run bin/cli.ts --help
```

## Features (12 Demo Modules)

| # | Feature | Description |
|---|---------|-------------|
| 1 | Response Body Methods | text(), json(), bytes(), arrayBuffer(), blob() |
| 2 | Bun.write() | Write response directly to file |
| 3 | Streaming Responses | Async iterator streaming |
| 4 | DNS Optimization | prefetch() and cache stats |
| 5 | Preconnect | Early connection setup |
| 6 | Connection Pooling | Keep-Alive behavior |
| 7 | Request Cancellation | AbortController and timeouts |
| 8 | Custom Headers | Authorization, custom headers |
| 9 | POST with Body | String, JSON, FormData |
| 10 | TLS/SSL Options | Client certs, validation |
| 11 | Special URL Protocols | file://, data:, blob:, s3:// |
| 12 | Verbose Debug Logging | Request/response headers |

## Distribution to Team

### Option 1: Share Source Code
```bash
# Zip and share the folder
zip -r bun-fetch-demo.zip bun-fetch-demo/

# Team members can run:
cd bun-fetch-demo
bun run bin/cli.ts
```

### Option 2: Build Standalone Binary
```bash
# Build executable
bun build --compile bin/cli.ts --outfile bun-fetch-demo

# Share the binary (works on same OS/arch)
./bun-fetch-demo 1
./bun-fetch-demo all
```

### Option 3: npm Package
```bash
# Publish to your private registry
npm publish --registry=https://your-registry.com

# Team installs and runs
npm install -g bun-fetch-demo
bun-fetch-demo 1
```

## Requirements

- [Bun](https://bun.sh) v1.0+ (for running)
- Network access (for live demos using httpbin.org)

## Project Structure

```
bun-fetch-demo/
├── package.json
├── README.md
└── bin/
    └── cli.ts          # Main CLI application
```

## See Also

- [FETCH_FEATURES.md](../FETCH_FEATURES.md) - Detailed feature reference table
- [demo-fetch.ts](../demo-fetch.ts) - Full demo with all features
