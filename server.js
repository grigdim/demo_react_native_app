const http = require('http');
const https = require('https');
const options = {
  // hostname: "dev-bo-api-gr.azurewebsites.net",
  // port: 443,
  hostname: 'localhost',
  port: 7001,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Headers': 'Content-Type, Token', // Allow Content-Type header
  },
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.writeHead(204, options.headers);
    res.end();
  } else if (req.method === 'POST') {
    console.log('incoming POST request');
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      options.rejectUnauthorized = false;
      options.method = req.method;
      options.path = req.url;
      options.body = body;

      // console.log(options);

      const proxyReq = https.request(options, proxyRes => {
        let data = '';

        proxyRes.on('data', chunk => {
          data += chunk;
        });

        proxyRes.on('end', () => {
          // console.log(options.path);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With,content-type,Token',
          );
          if (options.path === '/bo/Invoices/FetchSalesDataServerSide') {
            options.headers['Token'] = req.headers.token;
            // console.log(options.headers);
          }
          res.setHeader('Access-Control-Allow-Credentials', true);
          res.writeHead(proxyRes.statusCode);
          res.write(data);
          res.end();
          // console.log(data);
        });
      });

      proxyReq.on('error', e => {
        console.error(`problem with request: ${e.message}`);
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else if (req.method === 'GET') {
    console.log(req);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    options.rejectUnauthorized = false;
    options.method = req.method;
    options.path = req.url;
    // console.log(options.headers);
    options.headers['Token'] = req.headers.token;
    // console.log(options);

    const proxyReq = https.request(options, proxyRes => {
      let data = '';

      proxyRes.on('data', chunk => {
        data += chunk;
      });

      proxyRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader(
          'Access-Control-Allow-Headers',

          'X-Requested-With,content-type,Token',
        );

        res.setHeader('Access-Control-Allow-Credentials', true);
        res.writeHead(proxyRes.statusCode);
        res.write(data);
        res.end();
      });
    });

    proxyReq.on('error', e => {
      console.error(`problem with request: ${e.message}`);
    });

    proxyReq.end();
  } else {
    res.end();
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
