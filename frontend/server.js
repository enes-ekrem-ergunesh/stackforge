const http = require('http');

const port = process.env.PORT || 4200;

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stackforge Frontend</title>
  </head>
  <body>
    <h1>Stackforge Frontend</h1>
    <p>Frontend stub is running behind NGINX.</p>
  </body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(port, () => {
  console.log(`Frontend listening on ${port}`);
});
