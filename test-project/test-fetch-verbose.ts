export {}; // Make this a module for top-level await

// Test fetch with verbose logging to local server
const response = await fetch("http://localhost:3000/test", {
  verbose: true,
} as any);

const data = await response.json();
console.log("Response:", JSON.stringify(data, null, 2));
