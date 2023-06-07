const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

// Proxy the socket.io connection to the remote server
app.use(
  '/socket.io',
  createProxyMiddleware({
    target: '1q',
    ws: true,
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
