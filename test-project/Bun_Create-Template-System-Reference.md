Bun Create Template System Reference

> **Official Documentation**: [bun.sh/docs/cli/bun-create](https://bun.sh/docs/cli/bun-create)

## Quick Reference Table

### Table of Contents
- [Template Directories](#template-directories)
- [Template Configuration](#template-configuration)
- [CLI Flags](#cli-flags)
- [Environment Variables](#environment-variables)
- [Template Detection](#template-detection)
- [Runtime Behavior](#runtime-behavior)

### Template Directories

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f93">93</a> | `✅ STABLE` | `🔴 CRITICAL` | **Global Templates** | `path: $HOME/.bun-create/<name>`<br>`scope: user` | File System<br>POSIX | `BUN_CREATE_DIR`<br>`HOME`<br>`USERPROFILE` | `$HOME/.bun-create/<name>/` (Directory) | [#94](#f94), [#95](#f95) | [ex-093](#ex-093) |
| <a id="f94">94</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Project Templates** | `path: <project>/.bun-create/<name>`<br>`scope: project` | File System<br>POSIX | `INIT_CWD`<br>`PROJECT_CWD`<br>`BUN_PROJECT_ROOT` | `<project>/.bun-create/<name>/` (Directory) | [#93](#f93), [#95](#f95) | [ex-094](#ex-094) |
| <a id="f95">95</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Custom Template Dir** | `path: custom`<br>`scope: custom` | File System<br>POSIX | `BUN_CREATE_DIR=/custom/path`<br>`BUN_TEMPLATE_PATH` | `$BUN_CREATE_DIR/<name>/` (Directory) | [#93](#f93), [#94](#f94) | [ex-095](#ex-095) |
| <a id="f96">96</a> | `✅ STABLE` | `🔴 CRITICAL` | **Template Validation** | `hasPackageJson: boolean`<br>`hasName: boolean` | File System<br>JSON Schema | `BUN_CREATE_VALIDATE=1`<br>`BUN_SKIP_VALIDATION=0` | `bun create <name>` (Auto) | [#97](#f97), [#98](#f98) | [ex-096](#ex-096) |

### Template Configuration

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f97">97</a> | `✅ STABLE` | `🔴 CRITICAL` | **package.json** | `name: string`<br>`version: string`<br>`main: string` | JSON<br>npm | `BUN_TEMPLATE_NAME`<br>`BUN_TEMPLATE_VERSION`<br>`BUN_TEMPLATE_MAIN` | `package.json` (File) | `object` | [#96](#f96), [#98](#f98) | [ex-097](#ex-097) |
| <a id="f98">98</a> | `✅ STABLE` | `🔴 CRITICAL` | **bun-create config** | `preinstall: string[]`<br>`postinstall: string[]`<br>`start: string` | JSON<br>Bun-specific | `BUN_CREATE_PREINSTALL`<br>`BUN_CREATE_POSTINSTALL`<br>`BUN_CREATE_START` | `"bun-create": {...}` (JSON) | `object` | [#97](#f97), [#99](#f99) | [ex-098](#ex-098) |
| <a id="f99">99</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Template Variables** | `{{name}}`<br>`{{version}}`<br>`{{destination}}` | Template<br>String Interpolation | `BUN_TEMPLATE_VARS`<br>`BUN_INTERPOLATE=1` | `{{variable}}` (Pattern) | `string` | [#98](#f98), [#100](#f100) | [ex-099](#ex-099) |
| <a id="f100">100</a> | `✅ STABLE` | `🟡 IMPORTANT` | **File Filtering** | `ignore: string[]`<br>`include: string[]`<br>`transform: boolean` | File System<br>Glob | `BUN_IGNORE_FILES`<br>`BUN_INCLUDE_PATTERNS`<br>`BUN_TRANSFORM_FILES=1` | `bun create` (Auto) | `void` | [#99](#f99), [#101](#f101) | [ex-100](#ex-100) |

### CLI Flags

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f101">101</a> | `✅ STABLE` | `🔴 CRITICAL` | **--force** | `overwrite: boolean`<br>`skipPrompt: boolean` | CLI<br>User Input | `BUN_FORCE=1`<br>`BUN_SKIP_PROMPTS=1` | `bun create --force <template> <dest>` | [#102](#f102), [#103](#f103) | [ex-101](#ex-101) |
| <a id="f102">102</a> | `✅ STABLE` | `🟡 IMPORTANT` | **--no-install** | `skipInstall: boolean`<br>`skipDeps: boolean` | CLI<br>npm/yarn/pnpm | `BUN_NO_INSTALL=1`<br>`SKIP_INSTALL=1` | `bun create --no-install <template> <dest>` | [#101](#f101), [#103](#f103) | [ex-102](#ex-102) |
| <a id="f103">103</a> | `✅ STABLE` | `🟡 IMPORTANT` | **--no-git** | `skipGit: boolean`<br>`noVCS: boolean` | CLI<br>Git | `BUN_NO_GIT=1`<br>`SKIP_GIT_INIT=1` | `bun create --no-git <template> <dest>` | [#101](#f101), [#102](#f102) | [ex-103](#ex-103) |
| <a id="f104">104</a> | `✅ STABLE` | `🟡 IMPORTANT` | **--open** | `openBrowser: boolean`<br>`startServer: boolean` | CLI<br>Browser | `BUN_OPEN=1`<br>`OPEN_BROWSER=1` | `bun create --open <template> <dest>` | [#101](#f101), [#105](#f105) | [ex-104](#ex-104) |

### Environment Variables

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f105">105</a> | `✅ STABLE` | `🟡 IMPORTANT` | **GITHUB_API_DOMAIN** | `domain: string`<br>`enterprise: boolean` | GitHub API<br>HTTP | `GITHUB_API_DOMAIN`<br>`GITHUB_API_URL`<br>`GITHUB_ENTERPRISE=1` | `export GITHUB_API_DOMAIN=...` | [#106](#f106), [#107](#f107) | [ex-105](#ex-105) |
| <a id="f106">106</a> | `✅ STABLE` | `🟡 IMPORTANT` | **GITHUB_TOKEN** | `token: string`<br>`scope: "repo"` | GitHub API<br>OAuth | `GITHUB_TOKEN`<br>`GITHUB_ACCESS_TOKEN`<br>`GH_TOKEN` | `export GITHUB_TOKEN=...` | [#105](#f105), [#107](#f107) | [ex-106](#ex-106) |
| <a id="f107">107</a> | `✅ STABLE` | `🟡 IMPORTANT` | **npm Registry** | `registry: string`<br>`scope: string` | npm API<br>HTTP | `NPM_REGISTRY`<br>`NPM_CONFIG_REGISTRY`<br>`REGISTRY` | `export NPM_REGISTRY=...` | [#105](#f105), [#106](#f106) | [ex-107](#ex-107) |

### Template Detection

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Returns | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|---|
| <a id="f108">108</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Next.js Detection** | `hasNextConfig: boolean`<br>`hasPages: boolean`<br>`framework: "next"` | File System<br>Heuristic | `BUN_DETECT_NEXT=1`<br>`BUN_FRAMEWORK_NEXT=1` | `bun create` (Auto) | `boolean` | [#109](#f109), [#110](#f110) | [ex-108](#ex-108) |
| <a id="f109">109</a> | `✅ STABLE` | `🟡 IMPORTANT` | **React App Detection** | `hasReact: boolean`<br>`hasPublicIndex: boolean`<br>`framework: "cra"` | File System<br>Heuristic | `BUN_DETECT_REACT=1`<br>`BUN_FRAMEWORK_REACT=1` | `bun create` (Auto) | `boolean` | [#108](#f108), [#110](#f110) | [ex-109](#ex-109) |
| <a id="f110">110</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Relay Detection** | `hasRelayConfig: boolean`<br>`hasGraphQL: boolean`<br>`framework: "relay"` | File System<br>Heuristic | `BUN_DETECT_RELAY=1`<br>`BUN_MACRO_RELAY=1` | `bun create` (Auto) | `boolean` | [#108](#f108), [#109](#f109) | [ex-110](#ex-110) |

### Runtime Behavior

| # | Status | Priority | Feature | Type Properties | Protocol | Constants/Env Variables | Bun API Signature | Cross-Ref | Example |
|---|---|---|---|---|---|---|---|---|---|
| <a id="f111">111</a> | `✅ STABLE` | `🔴 CRITICAL` | **File Copy Optimization** | `copyMethod: "fcopyfile" \| "copy_file_range"`<br>`skipNodeModules: boolean` | System Call<br>POSIX | `BUN_COPY_METHOD="fast"`<br>`BUN_SKIP_NODE_MODULES=1`<br>`BUN_COPY_BUFFER_SIZE=8192` | `bun create` (Auto) | [#112](#f112), [#113](#f113) | [ex-111](#ex-111) |
| <a id="f112">112</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Package Manager Detection** | `prefer: "pnpm" > "yarn" > "npm"`<br>`autoDetect: boolean` | CLI<br>Heuristic | `BUN_PREFER_PNPM=1`<br>`BUN_PACKAGE_MANAGER`<br>`NPM_CLIENT` | `bun create` (Auto) | [#111](#f111), [#113](#f113) | [ex-112](#ex-112) |
| <a id="f113">113</a> | `✅ STABLE` | `🟡 IMPORTANT` | **Git Integration** | `init: boolean`<br>`commit: boolean`<br>`renameGitignore: boolean` | Git<br>libgit2 | `BUN_GIT_INIT=1`<br>`BUN_GIT_COMMIT=1`<br>`BUN_RENAME_GITIGNORE=1` | `bun create` (Auto) | [#111](#f111), [#112](#f112) | [ex-113](#ex-113) |

---

## Template Configuration Reference

### package.json Template Structure
```json
{
  "name": "template-name",
  "version": "1.0.0",
  "description": "Template description",
  "main": "index.js",
  "scripts": {
    "start": "bun run src/index.js",
    "dev": "bun --watch src/index.js",
    "build": "bun build ./src/index.js --outdir ./dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.0.0"
  },
  "bun-create": {
    "preinstall": [
      "echo 'Starting installation...'",
      "cp .env.example .env"
    ],
    "postinstall": [
      "echo 'Installation complete!'",
      "bun run setup"
    ],
    "start": "bun run dev",
    "questions": [
      {
        "type": "input",
        "name": "projectName",
        "message": "Project name:",
        "default": "my-project"
      },
      {
        "type": "confirm",
        "name": "useTypescript",
        "message": "Use TypeScript?",
        "default": true
      }
    ]
  }
}
```

### Environment Variables Reference

| Variable | Default | Type | Description | Scope |
|----------|---------|------|-------------|-------|
| `BUN_CREATE_DIR` | `$HOME/.bun-create` | `string` | Custom directory for local templates | Global |
| `BUN_TEMPLATE_PATH` | `undefined` | `string` | Explicit template path (overrides search) | Session |
| `BUN_FORCE` | `0` | `boolean` | Force overwrite without prompt | Session |
| `BUN_NO_INSTALL` | `0` | `boolean` | Skip package installation | Session |
| `BUN_NO_GIT` | `0` | `boolean` | Skip git repository initialization | Session |
| `BUN_OPEN` | `0` | `boolean` | Open in browser after creation | Session |
| `GITHUB_API_DOMAIN` | `api.github.com` | `string` | Custom GitHub API domain | Session |
| `GITHUB_TOKEN` | `undefined` | `string` | GitHub access token for private repos | Session |
| `GITHUB_ACCESS_TOKEN` | `undefined` | `string` | Alternative GitHub token variable | Session |
| `BUN_PACKAGE_MANAGER` | `auto` | `string` | Force package manager (npm/yarn/pnpm) | Session |
| `BUN_SKIP_NODE_MODULES` | `1` | `boolean` | Skip copying node_modules from template | Session |
| `BUN_COPY_BUFFER_SIZE` | `8192` | `bytes` | Buffer size for file copying | Runtime |
| `BUN_INTERPOLATE` | `1` | `boolean` | Enable template variable interpolation | Runtime |
| `BUN_VALIDATE_TEMPLATE` | `1` | `boolean` | Validate template structure | Runtime |

### Template Variable Interpolation

| Variable | Source | Example | Description |
|----------|--------|---------|-------------|
| `{{name}}` | package.json name | `my-app` | Project name from package.json |
| `{{version}}` | package.json version | `1.0.0` | Template version |
| `{{description}}` | package.json description | `My app` | Project description |
| `{{destination}}` | Destination path | `/projects/my-app` | Full destination path |
| `{{destDir}}` | Destination directory | `my-app` | Destination directory name |
| `{{timestamp}}` | Current time | `20231231_235959` | Creation timestamp |
| `{{year}}` | Current year | `2023` | Current year |
| `{{month}}` | Current month | `12` | Current month |
| `{{day}}` | Current day | `31` | Current day |

---

## Examples

### <a id="ex-093"></a>93. Global Template Setup
```bash
# Create global template directory
mkdir -p ~/.bun-create/my-template

# Create minimal package.json
cat > ~/.bun-create/my-template/package.json << EOF
{
  "name": "my-template",
  "version": "1.0.0",
  "bun-create": {
    "postinstall": "echo 'Template installed!'"
  }
}
EOF

# Create template files
echo "console.log('Hello from {{name}}')" > ~/.bun-create/my-template/index.js

# Use the template
bun create my-template my-project
```

### <a id="ex-094"></a>94. Project-Specific Template
```bash
# Inside your project directory
mkdir -p ./.bun-create/component

# Create component template
cat > ./.bun-create/component/package.json << EOF
{
  "name": "component-template",
  "bun-create": {
    "preinstall": "echo 'Creating component...'"
  }
}
EOF

# Template files
mkdir -p ./.bun-create/component/src
cat > ./.bun-create/component/src/Component.tsx << EOF
import React from 'react';

interface {{name}}Props {
  // Props here
}

export const {{name}}: React.FC<{{name}}Props> = () => {
  return <div>{{name}} Component</div>;
};
EOF

# Use within project
bun create component src/components/Button
```

### <a id="ex-095"></a>95. Custom Template Directory
```bash
# Set custom template directory
export BUN_CREATE_DIR="$HOME/my-templates"

# Create custom template
mkdir -p "$BUN_CREATE_DIR/custom-app"
cat > "$BUN_CREATE_DIR/custom-app/package.json" << EOF
{
  "name": "custom-app",
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF

# Use custom template
bun create custom-app my-express-app
```

### <a id="ex-096"></a>96. Template Validation
```bash
# Valid template structure
~/.bun-create/valid-template/
├── package.json    # Required
├── src/
│   └── index.js
└── README.md

# Invalid template (will fail)
~/.bun-create/invalid-template/
└── src/index.js    # Missing package.json

# Force validation
export BUN_VALIDATE_TEMPLATE=1
bun create invalid-template test  # Will fail
```

### <a id="ex-097"></a>97. Template package.json
```json
{
  "name": "express-api",
  "version": "1.0.0",
  "description": "Express.js API template",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  },
  "keywords": ["express", "api", "template"],
  "author": "Your Name",
  "license": "MIT"
}
```

### <a id="ex-098"></a>98. bun-create Configuration
```json
{
  "name": "fullstack-template",
  "version": "1.0.0",
  "bun-create": {
    "preinstall": [
      "echo '🚀 Setting up fullstack project...'",
      "cp .env.example .env",
      "mkdir -p logs"
    ],
    "postinstall": [
      "echo '✅ Dependencies installed!'",
      "bun run db:migrate",
      "bun run seed"
    ],
    "start": "bun run dev",
    "questions": [
      {
        "type": "input",
        "name": "projectName",
        "message": "What's your project name?",
        "default": "my-fullstack-app"
      },
      {
        "type": "list",
        "name": "database",
        "message": "Choose a database:",
        "choices": ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
        "default": "PostgreSQL"
      },
      {
        "type": "confirm",
        "name": "addAuth",
        "message": "Add authentication?",
        "default": true
      }
    ]
  }
}
```

### <a id="ex-099"></a>99. Template Variables Usage
```javascript
// In template file: src/config.js
export const config = {
  appName: "{{name}}",
  version: "{{version}}",
  createdAt: "{{timestamp}}",
  year: "{{year}}",

  database: {
    // Variables can be used in strings
    url: process.env.DATABASE_URL || "postgresql://localhost/{{destDir}}"
  }
};

// In README.md
# {{name}}

Created on {{timestamp}}

## Project Structure
- Source: {{destination}}/src
- Build: {{destination}}/dist

## Getting Started
```bash
cd {{destDir}}
bun install
bun start
```
```

### <a id="ex-100"></a>100. File Filtering & Transformation
```json
{
  "name": "filtered-template",
  "bun-create": {
    // Only copy these files
    "include": [
      "src/**/*.{js,ts,jsx,tsx}",
      "public/**/*",
      "*.json",
      "*.md"
    ],

    // Exclude these patterns
    "exclude": [
      "node_modules",
      ".git",
      "*.log",
      "*.tmp",
      "dist",
      "build"
    ],

    // Transform specific files
    "transform": {
      "**/*.template": true,  // Process .template files
      "package.json": true,   // Always process package.json
      "README.md": true       // Process README
    },

    // File-specific transformations
    "transforms": {
      "docker-compose.yml": {
        "replace": {
          "project-name": "{{destDir}}"
        }
      },
      ".env.example": {
        "rename": ".env"
      }
    }
  }
}
```

### <a id="ex-101"></a>101. Force Overwrite
```bash
# Create initial project
bun create react-app my-app
cd my-app

# Make changes
echo "module.exports = {}" > webpack.config.js

# Try to create again (will fail without --force)
bun create react-app my-app
# Error: Destination directory already exists

# Force overwrite
bun create --force react-app my-app
# Warning: Overwriting existing files!

# Environment variable alternative
export BUN_FORCE=1
bun create react-app my-app
```

### <a id="ex-102"></a>102. Skip Installation
```bash
# Create without installing dependencies
bun create --no-install next-app my-blog

# Check created files
ls -la my-blog/
# package.json exists but node_modules is missing

# Install manually later
cd my-blog
bun install

# Environment variable
export BUN_NO_INSTALL=1
bun create vue-app my-vue-project
```

### <a id="ex-103"></a>103. Skip Git Initialization
```bash
# Create without git
bun create --no-git express-api backend

# Check git status
cd backend
git status
# fatal: not a git repository

# Initialize git manually if needed
git init
git add .
git commit -m "Initial commit"

# Environment variable
export BUN_NO_GIT=1
bun create svelte-app my-svelte-project
```

### <a id="ex-104"></a>104. Open in Browser
```bash
# Create and open
bun create --open next-app my-next-project
# Creates project, installs dependencies, starts dev server, opens browser

# With custom port
bun create --open react-app my-app
# Server starts on http://localhost:3000
# Browser opens to that URL

# Environment variable
export BUN_OPEN=1
bun create vue-app my-vue-app
```

### <a id="ex-105"></a>105. GitHub Enterprise
```bash
# Use GitHub Enterprise
export GITHUB_API_DOMAIN="github.mycompany.com/api/v3"

# Create from internal GitHub repo
bun create mycompany/react-template internal-app

# With full URL
export GITHUB_API_DOMAIN="https://github.mycompany.com/api/v3"
bun create orgname/template project

# Debug GitHub API calls
export DEBUG="bun:github"
bun create example/template test
```

### <a id="ex-106"></a>106. GitHub Authentication
```bash
# Set GitHub token for private repos
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Create from private repository
bun create myorg/private-template my-project

# Or use GITHUB_ACCESS_TOKEN
export GITHUB_ACCESS_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
bun create username/private-repo project

# For GitHub Actions
# Set in workflow:
# env:
#   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### <a id="ex-107"></a>107. Custom npm Registry
```bash
# Use private npm registry
export NPM_REGISTRY="https://registry.mycompany.com"

# Or use npm config
export NPM_CONFIG_REGISTRY="https://registry.mycompany.com"

# Create template from private registry
bun create @mycompany/react-template app

# With authentication
export NPM_TOKEN="npm_xxxxxxxx"
export NPM_CONFIG_REGISTRY="https://registry.mycompany.com"
bun create @scope/template project
```

### <a id="ex-108"></a>108. Next.js Auto-Detection
```json
// Template structure that triggers Next.js detection
{
  "name": "next-template",
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
// Plus one of:
// - next.config.js
// - pages/ directory
// - app/ directory (Next.js 13+)
```

### <a id="ex-109"></a>109. Create React App Detection
```json
// Template structure for Create React App detection
{
  "name": "cra-template",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
// Plus:
// - public/index.html
// - src/index.js or src/index.jsx
```

### <a id="ex-110"></a>110. Relay Detection
```json
// Template with Relay detection
{
  "name": "relay-template",
  "dependencies": {
    "react": "^18.2.0",
    "react-relay": "^15.0.0",
    "relay-runtime": "^15.0.0"
  },
  "devDependencies": {
    "relay-compiler": "^15.0.0"
  }
}
// Plus one of:
// - relay.config.js
// - .graphql files
// - __generated__ directory
```

### <a id="ex-111"></a>111. Optimized File Copying
```bash
# Bun uses optimized system calls for copying:
# - macOS: fcopyfile()
# - Linux: copy_file_range()
# - Skip node_modules traversal

# Monitor copy performance
time bun create large-template big-project

# Compare with traditional cp
time cp -R ~/.bun-create/large-template big-project-cp

# Disable optimization (not recommended)
export BUN_COPY_METHOD="standard"
bun create template test
```

### <a id="ex-112"></a>112. Package Manager Detection
```bash
# Bun detects package managers in this order:
# 1. pnpm (if pnpm-lock.yaml exists)
# 2. yarn v1 (if yarn.lock exists)
# 3. npm (default)

# Force specific package manager
export BUN_PACKAGE_MANAGER="pnpm"
bun create next-app my-app  # Uses pnpm install

# Or
export BUN_PACKAGE_MANAGER="yarn"
bun create react-app my-app  # Uses yarn install

# Check detected manager
bun create --verbose react-app test  # Logs: "Using npm client: pnpm"
```

### <a id="ex-113"></a>113. Git Integration
```bash
# By default, bun create:
# 1. Runs git init
# 2. Adds all files
# 3. Creates initial commit

# Custom commit message
export BUN_GIT_COMMIT_MSG="chore: initial commit from template"
bun create template project

# Skip specific git steps
export BUN_GIT_NO_COMMIT=1  # Skip commit
export BUN_GIT_NO_ADD=1     # Skip git add
bun create template project

# Rename gitignore (npm renames .gitignore to gitignore)
# Bun renames it back to .gitignore
```

---

## Complete Workflow Examples

### 1. Creating a Custom Template
```bash
# Step 1: Create template directory
mkdir -p ~/.bun-create/my-fullstack
cd ~/.bun-create/my-fullstack

# Step 2: Create package.json with bun-create config
cat > package.json << 'EOF'
{
  "name": "my-fullstack",
  "version": "1.0.0",
  "description": "Fullstack TypeScript template",
  "scripts": {
    "dev": "concurrently 'bun run server' 'bun run client'",
    "server": "bun run --watch src/server/index.ts",
    "client": "cd client && bun run dev",
    "build": "bun run build:server && bun run build:client",
    "typecheck": "bun x tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "concurrently": "^8.0.0"
  },
  "bun-create": {
    "preinstall": [
      "echo '🚀 Setting up fullstack project...'",
      "cp .env.example .env",
      "echo 'PORT=3000' >> .env",
      "echo 'DATABASE_URL=postgresql://localhost/{{destDir}}' >> .env"
    ],
    "postinstall": [
      "echo '✅ Installation complete!'",
      "bun run typecheck",
      "echo 'Run bun run dev to start development'"
    ],
    "questions": [
      {
        "type": "input",
        "name": "projectName",
        "message": "Project name:",
        "default": "{{destDir}}"
      },
      {
        "type": "confirm",
        "name": "usePrisma",
        "message": "Add Prisma ORM?",
        "default": true
      },
      {
        "type": "list",
        "name": "database",
        "message": "Database type:",
        "choices": ["PostgreSQL", "MySQL", "SQLite"],
        "default": "PostgreSQL"
      }
    ]
  }
}
EOF

# Step 3: Create template files
mkdir -p src/server
cat > src/server/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
EOF

# Step 4: Create client template
mkdir -p client
cat > client/package.json << 'EOF'
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
EOF

# Step 5: Use the template
cd /path/to/projects
bun create my-fullstack awesome-project
```

### 2. Template with Interactive Prompts
```json
{
  "name": "interactive-template",
  "bun-create": {
    "questions": [
      {
        "type": "input",
        "name": "projectName",
        "message": "What should we call your project?",
        "default": "my-app",
        "validate": (value) => value.length > 0 || "Project name is required"
      },
      {
        "type": "list",
        "name": "framework",
        "message": "Which framework would you like to use?",
        "choices": [
          { "name": "React", "value": "react" },
          { "name": "Vue", "value": "vue" },
          { "name": "Svelte", "value": "svelte" },
          { "name": "Solid", "value": "solid" }
        ],
        "default": "react"
      },
      {
        "type": "confirm",
        "name": "typescript",
        "message": "Add TypeScript?",
        "default": true
      },
      {
        "type": "checkbox",
        "name": "features",
        "message": "Select additional features:",
        "choices": [
          { "name": "Routing", "value": "router" },
          { "name": "State Management", "value": "state" },
          { "name": "Testing", "value": "testing" },
          { "name": "CSS Framework", "value": "css" }
        ],
        "default": ["router", "testing"]
      },
      {
        "type": "input",
        "name": "author",
        "message": "Author name:",
        "default": process.env.USER || ""
      },
      {
        "type": "input",
        "name": "license",
        "message": "License:",
        "default": "MIT"
      }
    ],
    "postinstall": [
      "echo 'Configuring project based on your choices...'",
      "{{#if typescript}}echo 'Setting up TypeScript...'{{/if}}",
      "{{#each features}}echo 'Adding {{this}}...'{{/each}}"
    ]
  }
}
```

### 3. Enterprise Template Setup
```bash
#!/bin/bash
# setup-enterprise-templates.sh

# Set enterprise GitHub
export GITHUB_API_DOMAIN="https://github.company.com/api/v3"
export GITHUB_TOKEN="$ENTERPRISE_GITHUB_TOKEN"

# Set custom template directory
export BUN_CREATE_DIR="$HOME/company-templates"

# Create directory structure
mkdir -p "$BUN_CREATE_DIR"

# Clone enterprise templates
git clone https://github.company.com/org/frontend-template "$BUN_CREATE_DIR/frontend"
git clone https://github.company.com/org/backend-template "$BUN_CREATE_DIR/backend"
git clone https://github.company.com/org/fullstack-template "$BUN_CREATE_DIR/fullstack"

# Set private npm registry
export NPM_CONFIG_REGISTRY="https://registry.company.com"
export NPM_TOKEN="$COMPANY_NPM_TOKEN"

# Create project using enterprise template
bun create frontend customer-portal --force --no-install

# Add company-specific setup
cd customer-portal
echo "COMPANY_NAME=MyCompany" >> .env
echo "API_BASE=https://api.company.com" >> .env

# Install with company registry
bun install
```

This comprehensive reference covers all aspects of Bun's template creation system, including local templates, configuration options, environment variables, and advanced usage patterns.

---

## Additional Resources

### Official Documentation

| Resource | URL | Description |
|----------|-----|-------------|
| bun create | [bun.sh/docs/cli/bun-create](https://bun.sh/docs/cli/bun-create) | Template creation command |
| bun init | [bun.sh/docs/cli/bun-init](https://bun.sh/docs/cli/bun-init) | Initialize new project |
| Package Manager | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) | Package installation |
| bunfig.toml | [bun.sh/docs/runtime/bunfig](https://bun.sh/docs/runtime/bunfig) | Configuration file |

### Related Commands

| Command | Documentation |
|---------|---------------|
| `bun create` | [bun.sh/docs/cli/bun-create](https://bun.sh/docs/cli/bun-create) |
| `bun init` | [bun.sh/docs/cli/bun-init](https://bun.sh/docs/cli/bun-init) |
| `bun install` | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) |
| `bun run` | [bun.sh/docs/cli/run](https://bun.sh/docs/cli/run) |

### Community Resources

| Resource | URL |
|----------|-----|
| GitHub | [github.com/oven-sh/bun](https://github.com/oven-sh/bun) |
| Discord | [bun.sh/discord](https://bun.sh/discord) |
| Templates | [github.com/topics/bun-template](https://github.com/topics/bun-template) |

---

*Last Updated: 2025-12-26*
*Bun Version: 1.3.6*
