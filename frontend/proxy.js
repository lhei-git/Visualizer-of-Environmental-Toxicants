const http = require('http');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Define your API endpoint
const apiEndpoint = 'https://ephtracking.cdc.gov';

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle preflight CORS requests
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    });
    res.end();
    return;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Create a proxy to the API endpoint
  const proxy = createProxyMiddleware({
    target: apiEndpoint,
    changeOrigin: true,
  });

  proxy(req, res);
});

const port = 3000; // You can choose any available port

server.listen(port, () => {
  console.log(`CORS proxy server is running on http://localhost:${port}`);
});
