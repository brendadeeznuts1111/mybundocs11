#!/usr/bin/env bun

/**
 * Bun.inspect.table() Demonstration
 *
 * This script demonstrates the usage of Bun.inspect.table() utility function
 * which formats tabular data into a string for display.
 *
 * Documentation: https://bun.sh/docs/runtime/utils#bun-inspect-table-tabulardata-properties-options
 *
 * Usage: bun run test-inspect-table.ts
 */

console.log("=== Bun.inspect.table() Demonstration ===\n");

// Example 1: Basic table from array of objects
console.log("Example 1: Basic table from array of objects");
console.log("--------------------------------------------");

const basicData = [
  { id: 1, name: "Alice", age: 30, department: "Engineering" },
  { id: 2, name: "Bob", age: 25, department: "Marketing" },
  { id: 3, name: "Charlie", age: 35, department: "Sales" },
  { id: 4, name: "Diana", age: 28, department: "HR" },
];

const basicTable = Bun.inspect.table(basicData);
console.log(basicTable);

// Example 2: Filtered columns using properties parameter
console.log("\n\nExample 2: Filtered columns using properties parameter");
console.log("-------------------------------------------------------");

const filteredTable = Bun.inspect.table(basicData, ["name", "department"]);
console.log(filteredTable);

// Example 3: Table with options (colors enabled)
console.log("\n\nExample 3: Table with colors enabled");
console.log("--------------------------------------");

const coloredTable = Bun.inspect.table(basicData, { colors: true });
console.log(coloredTable);

// Example 4: Complex nested data
console.log("\n\nExample 4: Complex nested data");
console.log("--------------------------------");

const complexData = [
  {
    user: { id: 1, name: "Alice" },
    stats: { loginCount: 42, lastActive: "2023-10-01" },
    tags: ["admin", "developer"]
  },
  {
    user: { id: 2, name: "Bob" },
    stats: { loginCount: 18, lastActive: "2023-09-15" },
    tags: ["user", "tester"]
  },
  {
    user: { id: 3, name: "Charlie" },
    stats: { loginCount: 67, lastActive: "2023-10-05" },
    tags: ["admin", "manager"]
  },
];

const complexTable = Bun.inspect.table(complexData);
console.log(complexTable);

// Example 5: Array of arrays (tabular data)
console.log("\n\nExample 5: Array of arrays");
console.log("---------------------------");

const arrayData = [
  ["Product", "Price", "Stock"],
  ["Laptop", "$999", 15],
  ["Phone", "$699", 42],
  ["Tablet", "$399", 23],
  ["Headphones", "$199", 87],
];

const arrayTable = Bun.inspect.table(arrayData);
console.log(arrayTable);

// Example 6: Mixed data types
console.log("\n\nExample 6: Mixed data types");
console.log("---------------------------");

const mixedData = [
  { name: "Item A", price: 19.99, inStock: true, quantity: 100 },
  { name: "Item B", price: 29.99, inStock: false, quantity: 0 },
  { name: "Item C", price: 9.99, inStock: true, quantity: 250 },
  { name: "Item D", price: 49.99, inStock: true, quantity: 12 },
];

const mixedTable = Bun.inspect.table(mixedData);
console.log(mixedTable);

// Example 7: Using with console.table() comparison
console.log("\n\nExample 7: Comparison with console.table()");
console.log("------------------------------------------");

console.log("console.table() output:");
console.table(basicData.slice(0, 2));

console.log("\nBun.inspect.table() output (returns a string):");
const comparisonTable = Bun.inspect.table(basicData.slice(0, 2));
console.log(comparisonTable);

// Example 8: Error handling and edge cases
console.log("\n\nExample 8: Error handling and edge cases");
console.log("----------------------------------------");

try {
  // Empty array
  console.log("Empty array:");
  console.log(Bun.inspect.table([]));

  // Single object
  console.log("\nSingle object:");
  console.log(Bun.inspect.table([{ a: 1, b: 2 }]));

  // Object with undefined/null values
  console.log("\nObject with undefined/null values:");
  console.log(Bun.inspect.table([
    { a: 1, b: undefined, c: null },
    { a: 2, b: "defined", c: 0 }
  ]));
} catch (error) {
  console.error("Error:", error);
}

// Example 9: Practical use case - API response formatting
console.log("\n\nExample 9: Practical use case - API response formatting");
console.log("-------------------------------------------------------");

// Simulate API response data
const apiResponse = {
  users: [
    { id: 1, username: "alice123", email: "alice@example.com", active: true },
    { id: 2, username: "bob456", email: "bob@example.com", active: false },
    { id: 3, username: "charlie789", email: "charlie@example.com", active: true },
  ],
  metadata: {
    page: 1,
    totalPages: 5,
    totalItems: 23
  }
};

console.log("API Response Users Table:");
const apiTable = Bun.inspect.table(apiResponse.users, ["id", "username", "email", "active"]);
console.log(apiTable);

// Example 10: Custom formatting function
console.log("\n\nExample 10: Custom formatting with Bun.inspect.table()");
console.log("------------------------------------------------------");

function formatUserTable(users: any[]) {
  const tableStr = Bun.inspect.table(users, ["id", "name", "age"]);
  return `User Report:\n${tableStr}`;
}

const customFormatted = formatUserTable([
  { id: 1, name: "Alice", age: 30, extra: "data" },
  { id: 2, name: "Bob", age: 25, extra: "data" },
  { id: 3, name: "Charlie", age: 35, extra: "data" },
]);

console.log(customFormatted);

console.log("\n=== Demonstration Complete ===");
console.log("\nSummary:");
console.log("- Bun.inspect.table() formats tabular data into a string");
console.log("- Similar to console.table() but returns a string instead of printing");
console.log("- Supports filtering columns via properties parameter");
console.log("- Supports options like { colors: true } for ANSI colors");
console.log("- Works with arrays of objects and arrays of arrays");
console.log("- Useful for logging, debugging, and formatting output");
