const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (req.url.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'backend', path: req.url, status: 'ok' }));
    return;
  }

  if (req.url.startsWith('/docs/')) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Swagger docs placeholder');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Backend service is running');
});

server.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
