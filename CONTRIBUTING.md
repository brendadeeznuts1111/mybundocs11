# Contributing to My Bun Docs 11

Welcome! This repository serves as a comprehensive learning resource for [Bun](https://bun.com), a fast JavaScript runtime. While primarily maintained for personal documentation and learning purposes, we welcome constructive contributions that enhance the educational value and quality of the examples.

## 📋 Table of Contents

- [Repository Overview](#repository-overview)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)
- [License & Attribution](#license--attribution)

## 📚 Repository Overview

This repository contains:
- **9 Bun projects** ranging from beginner to expert level
- **40+ production-ready examples** demonstrating Bun features
- **Comprehensive documentation** with cross-references and guides
- **Learning-focused structure** with progressive complexity

### 🎯 Primary Goals
- Provide high-quality Bun learning materials
- Demonstrate production-ready patterns
- Maintain up-to-date examples with latest Bun features
- Foster a welcoming learning community

## 🤝 Ways to Contribute

### For Learners & Developers
- **⭐ Star the repository** to show your support
- **🔄 Fork and adapt** examples for your own projects
- **📢 Share** your Bun projects and learning experiences
- **💡 Suggest improvements** through issues or discussions

### For Contributors
- **🐛 Report bugs** in examples or documentation
- **✨ Add new examples** that demonstrate Bun features
- **📖 Improve documentation** and code comments
- **🧪 Add or improve tests** for existing examples
- **🔧 Update dependencies** and Bun versions
- **🎨 Enhance documentation** formatting and clarity

## 🛠️ Development Setup

### Prerequisites
- **[Bun](https://bun.com)** runtime (version 1.0+ recommended)
- **Git** for version control
- **Node.js 16+** (optional, for some development tools)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mybundocs11.git
cd mybundocs11

# Install dependencies for all projects
bun install

# Test a specific project
cd test-project
bun run dev

# Run tests
bun test
```

### Project Structure
```
mybundocs11/
├── bun-docs-repo/          # Official Bun documentation
├── test-project/           # Advanced server implementations
├── comprehensive-api-test/ # REST API fundamentals
├── enhanced-api-test/      # WebSockets & file uploads
├── full-api-project/       # Production enterprise patterns
├── enhanced-project/       # Development tooling
├── test-port-project/      # Port management utilities
├── your-project-name/      # Basic starter template
└── final-test-project/     # Consolidated examples
```

## 📏 Code Standards

### TypeScript/JavaScript
- Use **modern ES modules** (`import`/`export`)
- Prefer **`const`** over `let` when possible
- Use **descriptive variable names**
- Add **JSDoc comments** for complex functions
- Follow **Bun best practices** and patterns

### Example Structure
```typescript
/**
 * Fetches user data from the API
 * @param userId - The user's unique identifier
 * @returns Promise resolving to user data
 */
export async function getUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

### Documentation Standards
- Use **Markdown** for documentation files
- Include **code examples** with syntax highlighting
- Add **cross-references** to related sections
- Maintain **table of contents** in long documents
- Use **consistent emoji usage** for visual organization

## 🧪 Testing Guidelines

### Running Tests
```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test server.test.ts
```

### Writing Tests
- Use **Bun's native test runner** (`bun:test`)
- Write **descriptive test names** that explain the behavior
- Include **both positive and negative test cases**
- Test **error conditions** and edge cases
- Add **performance benchmarks** where appropriate

### Test Example
```typescript
import { expect, test, describe } from "bun:test";

describe("API Server", () => {
  test("should return welcome message", async () => {
    const response = await fetch("http://localhost:3000/");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("Welcome");
  });

  test("should handle 404 for unknown routes", async () => {
    const response = await fetch("http://localhost:3000/unknown");

    expect(response.status).toBe(404);
  });
});
```

## 📤 Submitting Changes

### Pull Request Process
1. **Fork** the repository
2. **Create a feature branch** from `main`
3. **Make your changes** following the code standards
4. **Test thoroughly** - run existing tests and add new ones
5. **Update documentation** if needed
6. **Commit** with clear, descriptive messages
7. **Push** to your fork
8. **Create a Pull Request** with detailed description

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat: add WebSocket chat example to enhanced-api-test
fix: correct TypeScript types in test-project
docs: update README.md with new project descriptions
test: add performance benchmarks for fetch operations
```

### Pull Request Template
Please include:
- **Clear title** describing the change
- **Description** of what was changed and why
- **Testing instructions** if applicable
- **Screenshots** for UI changes (if any)
- **Related issues** with `#issue-number`

## 🐛 Issue Reporting

### Bug Reports
When reporting bugs, please include:
- **Bun version**: `bun --version`
- **Operating system** and version
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Error messages** or stack traces
- **Code snippets** that demonstrate the problem

### Feature Requests
For new features or improvements:
- **Clear description** of the proposed feature
- **Use case** and why it would be valuable
- **Implementation ideas** if you have them
- **Related examples** from other projects

### Documentation Issues
- **Specific file and section** with the problem
- **Suggested improvement** or correction
- **Additional context** or examples needed

## 🌟 Community Guidelines

### Code of Conduct
- **Be respectful** and constructive in all interactions
- **Welcome beginners** and provide helpful guidance
- **Focus on learning** and knowledge sharing
- **Give credit** where credit is due
- **Maintain professionalism** in technical discussions

### Recognition
Contributors will be:
- **Acknowledged** in commit messages and PR descriptions
- **Listed** in future release notes
- **Credited** for significant contributions
- **Invited** to become maintainers for major contributions

### Communication
- Use **GitHub Issues** for bugs and feature requests
- Use **GitHub Discussions** for general questions and learning
- Be **patient** and provide **detailed information**
- **Search existing issues** before creating new ones

## 📄 License & Attribution

### License Information
This repository contains a collection of Bun-related examples and documentation under **MIT License**. Individual projects may have their own licenses as specified in their respective directories.

### Official Bun Attribution
- **Bun Runtime**: Copyright © 2023-present Oven, Inc.
- **Documentation**: Based on official Bun documentation and examples
- **Icons & Assets**: Official Bun branding materials

### Usage Rights
- **Personal Use**: All examples are free to use, modify, and distribute
- **Commercial Use**: Permitted under respective project licenses
- **Educational Use**: Encouraged for learning and teaching purposes
- **Attribution**: Appreciated but not required

### Third-Party Content
Some examples may include or reference third-party libraries, APIs, or services. Please review individual project licenses and terms of service.

---

## 🙏 Acknowledgments

Thank you to the **Bun community** and **Oven, Inc.** for creating and maintaining this amazing runtime. Special thanks to all contributors who help improve this learning resource.

**Built with ❤️ for the Bun community** | **Happy coding! 🚀**

---

*This contributing guide is inspired by open-source community best practices and the Bun project's own contribution guidelines.*