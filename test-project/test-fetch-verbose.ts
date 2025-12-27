// Test fetch with verbose logging to local server
const response = await fetch("http://example.com:3000/test", {
  verbose: true,
});

const data = await response.json();
console.log("Response:", JSON.stringify(data, null, 2));
