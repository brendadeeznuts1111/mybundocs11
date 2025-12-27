# Bun Install Configuration & Strategies Guide

> **Official Documentation**: [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install)

## Complete Installation Strategy Reference

### Table of Contents
- [Installation Strategies](#installation-strategies)
- [Minimum Release Age Security](#minimum-release-age-security)
- [Configuration Methods](#configuration-methods)
- [Advanced Cache Management](#advanced-cache-management)
- [Enterprise Security](#enterprise-security)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

## Installation Strategies

### Strategy Comparison Matrix

| Strategy | Command | node_modules Structure | Benefits | Drawbacks | Best For |
|----------|---------|----------------------|----------|-----------|----------|
| **Hoisted** | `bun install --linker hoisted` | Flattened, traditional | Fast, compatible, smaller disk usage | Phantom dependencies, version conflicts | Existing projects, compatibility |
| **Isolated** | `bun install --linker isolated` | Central store + symlinks | No phantom deps, strict isolation, reproducible | Slightly slower, larger disk usage | Monorepos, new projects, CI/CD |
| **Auto** | `bun install` | Based on configVersion | Smart defaults, backward compatible | Less control | Most users |

### Detailed Examples

#### Hoisted Installation (Traditional)
```bash
# Explicit hoisted install
bun install --linker hoisted

# Check installation structure
ls -la node_modules/
# Structure:
# node_modules/
# ├── react/           # Direct dependency
# ├── react-dom/       # Direct dependency
# ├── lodash/          # Transitive dependency (hoisted)
# └── .bin/            # Binary symlinks
```

#### Isolated Installation (pnpm-style)
```bash
# Explicit isolated install
bun install --linker isolated

# Check installation structure
ls -la node_modules/
# Structure:
# node_modules/
# ├── react -> .bun/react/18.2.0/     # Symlink to store
# ├── react-dom -> .bun/react-dom/18.2.0/
# ├── .bun/                           # Central package store
# │   ├── react/18.2.0/
# │   ├── react-dom/18.2.0/
# │   └── lodash/4.17.21/             # Not hoisted
# └── .bin/                           # Binary symlinks
```

### Migration Between Strategies

```bash
# Convert from hoisted to isolated
rm -rf node_modules bun.lockb
bun install --linker isolated

# Convert from isolated to hoisted
rm -rf node_modules bun.lockb
bun install --linker hoisted

# Check current strategy
cat bun.lockb | head -20 | grep -a "configVersion"
# configVersion = 1 for isolated, 0 for hoisted

# Force update strategy for existing project
bun install --linker isolated --force
```

### Strategy Configuration Examples

```toml bunfig.toml
# Global configuration for all projects
[install]
# Installation strategy
linker = "isolated"  # "hoisted" or "isolated"

# Workspace-specific strategy
[workspace]
linker = "isolated"  # Default for workspaces

# Per-scope strategy (advanced)
[install.scopes]
"@mycompany" = {
  url = "https://registry.mycompany.com/",
  linker = "hoisted"  # Override for specific scope
}

# Environment-based strategy
[install]
linker = {
  development = "hoisted",
  production = "isolated",
  test = "isolated"
}[process.env.NODE_ENV] || "isolated"
```

## Minimum Release Age Security

### Comprehensive Security Configuration

```toml bunfig.toml
[install]

# Global minimum release age (3 days = 259200 seconds)
minimumReleaseAge = 259200

# Exclude trusted packages from age gate
minimumReleaseAgeExcludes = [
  "@types/node",
  "typescript",
  "@types/bun",
  "bun-types",
  # Company internal packages
  "@mycompany/*",
  "@team/*"
]

# Advanced filtering rules
[install.security]
minimumReleaseAge = 172800  # 2 days

# Package-specific rules
[install.security.rules]
"react" = { minAge = 604800 }  # 7 days for React
"next" = { minAge = 864000 }   # 10 days for Next.js
"*" = { minAge = 259200 }      # Default: 3 days

# Allow-list for critical updates
[install.security.allowlist]
# Packages that can bypass age gate for security patches
critical = ["node", "openssl", "zlib", "bun"]
# Auto-approve patches with CVE fixes
autoApproveCVEs = true
```

### Command Line Usage Examples

```bash
# Install with 3-day age gate
bun add react --minimum-release-age 259200

# Install with 1-week age gate
bun add @types/node --minimum-release-age 604800

# Add package with no age restriction
bun add lodash --minimum-release-age 0

# Update all packages respecting age gate
bun update --minimum-release-age 86400  # 1 day

# Check package ages
bun audit --check-ages

# Show age gate statistics
bun install --verbose --minimum-release-age 259200
```

### Age Gate Safety Features

```typescript
// age-gate-safety.js
import { spawn } from 'bun';

class AgeGateSafety {
  static async checkPackage(name, version) {
    // Query npm registry for package metadata
    const response = await fetch(`https://registry.npmjs.org/${name}`);
    const data = await response.json();

    const versionData = data.versions[version];
    const publishTime = new Date(versionData.time[version]);
    const age = Date.now() - publishTime.getTime();
    const ageDays = age / (1000 * 60 * 60 * 24);

    // Stability check: look for rapid releases
    const versions = Object.keys(data.time)
      .map(v => ({ version: v, time: new Date(data.time[v]) }))
      .sort((a, b) => b.time - a.time);

    const recentVersions = versions.slice(0, 10);
    const rapidReleases = this.detectRapidReleases(recentVersions);

    return {
      name,
      version,
      ageDays: ageDays.toFixed(1),
      publishDate: publishTime.toISOString(),
      rapidReleases,
      recommended: ageDays >= 3 && !rapidReleases
    };
  }

  static detectRapidReleases(versions) {
    // Check if multiple versions released within 48 hours
    for (let i = 1; i < versions.length; i++) {
      const timeDiff = versions[i-1].time - versions[i].time;
      if (timeDiff < 48 * 60 * 60 * 1000) {
        return true;
      }
    }
    return false;
  }
}

// Usage
const info = await AgeGateSafety.checkPackage('react', '18.2.0');
console.table([info]);
```

## Configuration Methods

### Complete bunfig.toml Reference

```toml bunfig.toml
# Bun Configuration File
# Search order: ./bunfig.toml > $HOME/.bunfig.toml > $XDG_CONFIG_HOME/.bunfig.toml

[install]

# Basic settings
optional = true           # Install optionalDependencies
dev = true               # Install devDependencies
peer = true              # Install peerDependencies
production = false       # Production mode (skip dev deps)
saveExact = false        # Use exact versions (no ^ or ~)
savePrefix = "^"         # Default: "^", can be "" or "~"
lockfile = true          # Generate bun.lockb
frozenLockfile = false   # Don't update lockfile
dryRun = false          # Simulate installation
concurrentScripts = 16   # Post-install script concurrency

# Installation strategy
linker = "isolated"     # "hoisted" or "isolated"
configVersion = 1       # Lockfile format version

# Security
minimumReleaseAge = 259200  # 3 days in seconds
minimumReleaseAgeExcludes = ["@types/node", "typescript"]

# Registry configuration
registry = "https://registry.npmjs.org/"
alwaysAuth = false

# Scoped registries
[install.scopes]
"@mycompany" = {
  url = "https://registry.mycompany.com/",
  token = "$NPM_TOKEN",
  linker = "isolated"
}

# Workspace configuration
[workspace]
name = "my-monorepo"
version = "1.0.0"
packages = ["packages/*"]
linker = "isolated"

# Script configuration
[scripts]
preinstall = ["echo 'Starting installation...'"]
postinstall = ["bun run build", "echo 'Done!'"]

# Environment-specific overrides
[install.development]
dev = true
optional = true

[install.production]
dev = false
optional = false
production = true

[install.test]
dev = true
frozenLockfile = true
```

### Environment Variables Reference

| Variable | Type | Default | Overrides | Description |
|----------|------|---------|-----------|-------------|
| `BUN_CONFIG_REGISTRY` | string | npmjs.org | bunfig.toml | Global npm registry |
| `BUN_CONFIG_TOKEN` | string | none | bunfig.toml | Global auth token |
| `BUN_CONFIG_YARN_LOCKFILE` | boolean | false | bunfig.toml | Generate yarn.lock |
| `BUN_CONFIG_LINK_NATIVE_BINS` | boolean | true | bunfig.toml | Platform-specific binaries |
| `BUN_CONFIG_SKIP_SAVE_LOCKFILE` | boolean | false | bunfig.toml | Don't save lockfile |
| `BUN_CONFIG_SKIP_LOAD_LOCKFILE` | boolean | false | bunfig.toml | Don't load lockfile |
| `BUN_CONFIG_SKIP_INSTALL_PACKAGES` | boolean | false | bunfig.toml | Skip package installation |
| `BUN_LINKER` | string | auto | bunfig.toml | Installation strategy |
| `BUN_MINIMUM_RELEASE_AGE` | number | 0 | bunfig.toml | Package age gate |
| `NODE_ENV` | string | development | - | Environment mode |

### Environment Configuration Examples

```bash
#!/bin/bash
# setup-environment.sh

# Registry configuration
export BUN_CONFIG_REGISTRY="https://registry.npmjs.org/"
export BUN_CONFIG_TOKEN="$NPM_TOKEN"

# Installation strategy
export BUN_LINKER="isolated"  # Force isolated installs

# Security
export BUN_MINIMUM_RELEASE_AGE=259200  # 3 days
export BUN_SECURITY_SCAN=true

# Performance
export BUN_CONCURRENT_SCRIPTS=8
export BUN_CACHE_DIR="$HOME/.bun/install/cache"

# Debugging
export BUN_DEBUG=1
export BUN_LOG_LEVEL="info"

# Workspace
export NODE_ENV="${NODE_ENV:-development}"
export CI="${CI:-false}"

# Load project-specific environment
if [ -f .env.local ]; then
  export $(cat .env.local | xargs)
fi

echo "Environment configured for $NODE_ENV"
```

## Advanced Cache Management

### Cache Configuration

```toml bunfig.toml
# Cache configuration
[cache]

# Cache directory (default: ~/.bun/install/cache)
dir = "$HOME/.bun/install/cache"

# Maximum cache size (default: 2GB)
maxSize = "2GB"

# Cache pruning strategy
prune = {
  frequency = "weekly",    # "daily", "weekly", "monthly"
  keepVersions = 3,       # Keep last 3 versions of each package
  keepDays = 30,          # Keep packages for 30 days
  aggressive = false      # Don't delete packages in use
}

# CDN configuration for faster downloads
[cdn]
enabled = true
url = "https://registry.npmjs.org/"
fallback = ["https://registry.yarnpkg.com/", "https://registry.npmjs.org/"]

# Mirror configuration for geographic distribution
[mirrors]
asia = "https://asia-registry.npmjs.org/"
europe = "https://europe-registry.npmjs.org/"
america = "https://registry.npmjs.org/"
```

### Cache Management Commands

```bash
# View cache statistics
bun cache stats
# Output:
# Cache dir: /home/user/.bun/install/cache
# Total size: 1.2 GB
# Packages: 1,243
# Oldest: 30 days
# Newest: 1 hour

# Clear cache
bun cache clean

# Clear cache for specific package
bun cache clean react

# Prune cache (remove old versions)
bun cache prune

# List cached packages
bun cache ls

# Show cache location
bun cache dir

# Export cache for offline use
bun cache export ./bun-cache.tar.gz

# Import cache
bun cache import ./bun-cache.tar.gz

# Verify cache integrity
bun cache verify
```

### Custom Cache Backends

```typescript
// custom-cache.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class CustomCache {
  private cacheDir: string;

  constructor(dir = join(process.env.HOME || '', '.bun-custom-cache')) {
    this.cacheDir = dir;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  async get(packageName: string, version: string): Promise<Buffer | null> {
    const key = this.getKey(packageName, version);
    const filePath = join(this.cacheDir, key);

    if (existsSync(filePath)) {
      return readFileSync(filePath);
    }
    return null;
  }

  async set(packageName: string, version: string, data: Buffer): Promise<void> {
    const key = this.getKey(packageName, version);
    const filePath = join(this.cacheDir, key);
    writeFileSync(filePath, data);
  }

  private getKey(packageName: string, version: string): string {
    // Replace special characters for filesystem safety
    return `${packageName.replace(/[\/@]/g, '_')}_${version.replace(/[\/@]/g, '_')}.tgz`;
  }
}

// Usage in custom installer
const cache = new CustomCache();
const cached = await cache.get('react', '18.2.0');
if (!cached) {
  // Download and cache
  const response = await fetch('https://registry.npmjs.org/react/-/react-18.2.0.tgz');
  const data = await response.arrayBuffer();
  await cache.set('react', '18.2.0', Buffer.from(data));
}
```

## Enterprise Security Configuration

### Complete Security Setup

```toml bunfig.toml
# Enterprise Security Configuration

[install]

# Installation security
linker = "isolated"          # Prevent phantom dependencies
saveExact = true             # Exact versions only
lockfile = true              # Required lockfile
frozenLockfile = true        # No automatic updates
dryRun = false              # Don't simulate
concurrentScripts = 4        # Limited concurrency for stability

# Security scanning
[install.security]

# Age-based security
minimumReleaseAge = 604800   # 7 days minimum
minimumReleaseAgeExcludes = [
  "@types/node",
  "typescript",
  "@mycompany/*"            # Trust internal packages
]

# Vulnerability scanning
audit = true
auditLevel = "moderate"     # "low", "moderate", "high", "critical"
failOnAudit = true          # Fail installation on vulnerabilities
auditExcludes = ["devDependencies"]

# Package filtering
[install.security.filter]
# Block specific packages
blocklist = [
  "left-pad",
  "event-stream",
  "*malware*"
]

# Allow only specific packages
allowlist = [
  "@mycompany/*",
  "react",
  "react-dom",
  "typescript",
  "@types/*"
]

# License restrictions
allowedLicenses = ["MIT", "Apache-2.0", "BSD-3-Clause"]
blockedLicenses = ["GPL-3.0", "AGPL-3.0"]

# Integrity verification
[install.security.integrity]
verifySignatures = true
requireSignatures = false    # Warning only, not required
trustedKeys = [
  "SHA256:abc123...",        # Company signing key
]
```

---

## Additional Resources

| Resource | URL | Description |
|----------|-----|-------------|
| bun install | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) | Package installation |
| Lockfile | [bun.sh/docs/install/lockfile](https://bun.sh/docs/install/lockfile) | Lock file format |
| Workspaces | [bun.sh/docs/install/workspaces](https://bun.sh/docs/install/workspaces) | Monorepo support |
| Registries | [bun.sh/docs/install/registries](https://bun.sh/docs/install/registries) | Private registries |
| bunfig.toml | [bun.sh/docs/runtime/bunfig](https://bun.sh/docs/runtime/bunfig) | Configuration |
| Cache | [bun.sh/docs/install/cache](https://bun.sh/docs/install/cache) | Global cache |

### Related Commands

| Command | Documentation |
|---------|---------------|
| `bun install` | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) |
| `bun add` | [bun.sh/docs/cli/add](https://bun.sh/docs/cli/add) |
| `bun remove` | [bun.sh/docs/cli/remove](https://bun.sh/docs/cli/remove) |
| `bun update` | [bun.sh/docs/cli/update](https://bun.sh/docs/cli/update) |
| `bun pm` | [bun.sh/docs/cli/pm](https://bun.sh/docs/cli/pm) |

---

*Last Updated: 2025-12-26*
*Bun Version: 1.3.6*
