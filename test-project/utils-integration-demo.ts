#!/usr/bin/env bun

/**
 * Bun Utilities Integration Demo
 *
 * Demonstrates how Bun.inspect.table() integrates with other Bun utility functions
 * from the utils.mdx documentation.
 *
 * Documentation: https://bun.sh/docs/runtime/utils
 *
 * Usage: bun run utils-integration-demo.ts
 */

console.log("=== Bun Utilities Integration Demo ===\n");

// 1. Demonstrate Bun.inspect.table() with Bun.deepEquals()
console.log("1. Bun.inspect.table() with Bun.deepEquals()");
console.log("---------------------------------------------");

const data1 = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "moderator" }
];

const data2 = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "moderator" }
];

const data3 = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "administrator" } // Different role
];

console.log("Comparing data structures:");
console.log("Data 1 vs Data 2 (identical):", Bun.deepEquals(data1, data2));
console.log("Data 1 vs Data 3 (different):", Bun.deepEquals(data1, data3));

console.log("\nData 1 table:");
console.log(Bun.inspect.table(data1, ["id", "name", "role"]));

console.log("\nData 3 table:");
console.log(Bun.inspect.table(data3, ["id", "name", "role"]));

// 2. Demonstrate with Bun.stringWidth() for table width measurement
console.log("\n\n2. Bun.inspect.table() with Bun.stringWidth()");
console.log("------------------------------------------------");

const tableOutput = Bun.inspect.table(data1);
const tableWidth = Bun.stringWidth(tableOutput);

console.log("Table output width:", tableWidth, "columns");
console.log("Table preview (first line):", tableOutput.split('\n')[0]);

// Create a bordered version with measured width
const border = "─".repeat(tableWidth);
console.log(`\nTable with custom border:\n┌${border}┐\n${tableOutput}\n└${border}┘`);

// 3. Demonstrate with Bun.stripANSI() for clean logging
console.log("\n\n3. Bun.inspect.table() with Bun.stripANSI()");
console.log("--------------------------------------------");

const coloredTableOutput = Bun.inspect.table(data1, { colors: true });
const plainTableOutput = Bun.stripANSI(coloredTableOutput);

console.log("Colored table (with ANSI codes):");
console.log(coloredTableOutput.substring(0, 100) + "..."); // Show first 100 chars

console.log("\nStripped table (plain text):");
console.log(plainTableOutput.substring(0, 100) + "..."); // Show first 100 chars

console.log("\nComparison:");
console.log("Colored length:", coloredTableOutput.length);
console.log("Plain length:", plainTableOutput.length);
console.log("ANSI overhead:", coloredTableOutput.length - plainTableOutput.length, "characters");

// 4. Demonstrate with Bun.peek() for async data processing
console.log("\n\n4. Bun.inspect.table() with Bun.peek()");
console.log("---------------------------------------");

interface UserData {
  id: number;
  username: string;
  online: boolean;
  lastSeen: Date;
}

async function fetchUserData(): Promise<UserData[]> {
  // Simulate async data fetching
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, username: "alice", online: true, lastSeen: new Date() },
        { id: 2, username: "bob", online: false, lastSeen: new Date(Date.now() - 3600000) },
        { id: 3, username: "charlie", online: true, lastSeen: new Date() }
      ]);
    }, 100);
  });
}

const userDataPromise = fetchUserData();

// Check if promise is ready without await
const peekedData = Bun.peek(userDataPromise);
if (peekedData === userDataPromise) {
  console.log("Promise is still pending, waiting...");
  const userData = await userDataPromise;
  console.log("\nUser data table:");
  console.log(Bun.inspect.table(userData as object[]));
} else {
  console.log("Promise was already resolved!");
  console.log(Bun.inspect.table(peekedData as object[]));
}

// 5. Demonstrate with Bun.randomUUIDv7() for unique IDs
console.log("\n\n5. Bun.inspect.table() with Bun.randomUUIDv7()");
console.log("------------------------------------------------");

const products = [
  {
    id: Bun.randomUUIDv7(),
    name: "Laptop",
    price: 999.99,
    createdAt: new Date()
  },
  {
    id: Bun.randomUUIDv7(),
    name: "Phone",
    price: 699.99,
    createdAt: new Date()
  },
  {
    id: Bun.randomUUIDv7(),
    name: "Tablet",
    price: 399.99,
    createdAt: new Date()
  }
];

console.log("Products with UUIDv7 IDs:");
console.log(Bun.inspect.table(products, ["id", "name", "price"]));

// 6. Demonstrate with Bun.sleep() for timed updates
console.log("\n\n6. Bun.inspect.table() with Bun.sleep() for real-time updates");
console.log("--------------------------------------------------------------");

async function showRealTimeUpdates() {
  const stockData = [
    { symbol: "AAPL", price: 175.25, change: "+1.2%" },
    { symbol: "GOOGL", price: 142.80, change: "-0.5%" },
    { symbol: "TSLA", price: 245.60, change: "+3.7%" }
  ];

  console.log("Initial stock data:");
  console.log(Bun.inspect.table(stockData));

  // Simulate price updates
  for (let i = 1; i <= 3; i++) {
    await Bun.sleep(1000); // Wait 1 second

    // Update prices
    stockData.forEach(stock => {
      const randomChange = (Math.random() - 0.5) * 2; // -1% to +1%
      stock.price = parseFloat((stock.price * (1 + randomChange/100)).toFixed(2));
      stock.change = randomChange >= 0 ? `+${randomChange.toFixed(1)}%` : `${randomChange.toFixed(1)}%`;
    });

    console.log(`\nUpdate ${i} (after ${i} second${i > 1 ? 's' : ''}):`);
    console.log(Bun.inspect.table(stockData, { colors: true }));
  }
}

await showRealTimeUpdates();

// 7. Demonstrate with Bun.which() for system information
console.log("\n\n7. Bun.inspect.table() with Bun.which()");
console.log("----------------------------------------");

const executables = ["node", "bun", "python3", "git", "ls"];
const executablePaths = executables.map(cmd => ({
  command: cmd,
  path: Bun.which(cmd),
  exists: Bun.which(cmd) !== null
}));

console.log("System executables:");
console.log(Bun.inspect.table(executablePaths));

// 8. Demonstrate with Bun.inspect.custom for custom formatting
console.log("\n\n8. Bun.inspect.table() with Bun.inspect.custom");
console.log("------------------------------------------------");

class User {
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  [Bun.inspect.custom]() {
    return `${this.name} <${this.email}> (ID: ${this.id})`;
  }
}

const customUsers = [
  new User(1, "Alice", "alice@example.com"),
  new User(2, "Bob", "bob@example.com"),
  new User(3, "Charlie", "charlie@example.com")
];

console.log("Users with custom inspect formatting:");
// Note: Bun.inspect.table will use the custom formatting
console.log(Bun.inspect.table(customUsers));

// 9. Practical integration example
console.log("\n\n9. Practical Integration Example: System Monitor");
console.log("-------------------------------------------------");

async function systemMonitor() {
  // Get system information
  const systemInfo = {
    bunVersion: Bun.version,
    bunRevision: Bun.revision.substring(0, 8),
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    uptime: `${process.uptime().toFixed(2)}s`,
    memoryUsage: {
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
    }
  };

  // Format as array for table display
  const infoArray = Object.entries(systemInfo).map(([key, value]) => ({
    Metric: key,
    Value: typeof value === 'object' ? JSON.stringify(value) : String(value)
  }));

  console.log("System Information:");
  console.log(Bun.inspect.table(infoArray));

  // Add a separator with measured width
  const monitorWidth = 60;
  const separator = "─".repeat(monitorWidth);

  console.log(`\n┌${separator}┐`);
  console.log("│" + " ".repeat(monitorWidth) + "│");
  console.log(`│${"System Monitor".padStart((monitorWidth + 14) / 2).padEnd(monitorWidth)}│`);
  console.log("│" + " ".repeat(monitorWidth) + "│");
  console.log(`└${separator}┘`);
}

await systemMonitor();

console.log("\n=== Integration Demo Complete ===");
console.log("\nSummary:");
console.log("- Bun.inspect.table() works seamlessly with other Bun utilities");
console.log("- Can be combined with Bun.deepEquals() for data comparison");
console.log("- Works with Bun.stringWidth() for layout/formatting");
console.log("- Integrates with Bun.stripANSI() for clean logging");
console.log("- Compatible with async patterns using Bun.peek()");
console.log("- Useful with Bun.randomUUIDv7() for unique identifiers");
console.log("- Enhances real-time displays with Bun.sleep()");
console.log("- Complements system utilities like Bun.which()");
console.log("- Supports custom object formatting via Bun.inspect.custom");

// Export to make this file a module (fixes TypeScript errors)
export {};
