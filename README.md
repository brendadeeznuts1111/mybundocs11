# My Bun Docs 11

[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

A comprehensive collection of Bun-related documentation, test projects, and examples. Bun is a fast JavaScript runtime, bundler, test runner, and package manager all in one.

## Table of Contents

- [Repository Contents](#repository-contents)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Repository Contents

This repository includes various Bun (JavaScript runtime) related materials organized in the following directories:

| Directory | Description |
|-----------|-------------|
| [bun-docs-repo/](bun-docs-repo/README.md) | The main Bun documentation and source repository, including guides, API docs, benchmarks, and build scripts. |
| [comprehensive-api-test/](comprehensive-api-test/README.md) | A comprehensive API testing project demonstrating Bun's server capabilities. |
| [enhanced-api-test/](enhanced-api-test/README.md) | Enhanced API testing with file upload functionality. |
| [test-project/](test-project/README.md) | Collection of test projects showcasing different Bun features like HTTP servers, fetch API, and bundling. |
| [your-project/](your-project/README.md) | A basic Bun project template. |
| [final-test-project/](final-test-project/README.md) | Final test implementation. |
| [full-api-project/](full-api-project/README.md) | Full-featured API project. |
| [test-port-project/](test-port-project/README.md) | Port testing utilities. |
| [enhanced-project/](enhanced-project/README.md) | Enhanced project setup. |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime installed (version 1.0+ recommended)
- Git for cloning repositories

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/brendadeeznuts1111/mybundocs11.git
   cd mybundocs11
   ```

2. Install Bun if not already installed:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

### Running Projects

Each subdirectory contains its own `package.json` and can be run independently:

```bash
cd <project-directory>
bun install
bun run dev  # or bun run test, etc.
```

## Why Bun?

Bun offers several advantages over traditional JavaScript runtimes:

- **Fast Startup**: Native binary performance
- **Built-in Tools**: Bundler, test runner, and package manager included
- **TypeScript Support**: Zero-config TypeScript compilation
- **ESM/Native Modules**: Modern module system with Node.js compatibility
- **Web APIs**: Familiar browser APIs in server environments

## Resources

- [Official Bun Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Discord Community](https://discord.gg/CXdq2t2G)

## Contributing

This is a personal documentation repository. Feel free to explore and learn from the examples.

## License

See individual project licenses within their respective directories.