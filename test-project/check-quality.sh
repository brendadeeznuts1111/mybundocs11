#!/usr/bin/env bash

# Bun Project Quality Check Script
# Run this before committing to ensure code quality

set -e

echo "🔍 Running Bun Project Quality Checks..."
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the project root."
    exit 1
fi

# Check if bun is available
if ! command -v bun &> /dev/null; then
    echo "❌ Error: Bun is not installed or not in PATH."
    exit 1
fi

echo "✅ Bun version: $(bun --version)"
echo

# Run type checking
echo "🔍 Running TypeScript type checking..."
bun run typecheck
echo "✅ TypeScript checks passed"
echo

# Run linting
echo "🔍 Running ESLint..."
bun run lint
echo "✅ ESLint checks passed"
echo

# Run formatting check
echo "🔍 Checking code formatting..."
bun run format:check
echo "✅ Code formatting is correct"
echo

# Run tests
echo "🔍 Running tests..."
bun run test
echo "✅ All tests passed"
echo

echo "🎉 All quality checks passed! Ready to commit."
echo
echo "💡 Quick commands:"
echo "  bun run quality:fix    # Auto-fix issues"
echo "  bun run cli            # Run the fetch demo CLI"
echo "  bun run dev            # Start development server"