// dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

// app object
const app = {};

// configuration
app.config = {
  port: 4000,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  const port = app?.config?.port;
  server.listen(port, () => {
    console.log(`server runnig at http://localhost:${port}`);
  });
};

// handle request and response
app.handleReqRes = (req, res) => {
  // requesting url handling
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true); // parse url receives two parameters. one of them is requested url and other one is thoe boolean statement. if its "true" its gonna take everything from url like qurey and if its "false" its gonna take only the url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  const decoder = new StringDecoder('utf-8');
  let realData = '';

  // payload or body in the request
  // receivng buffer
  req.on('data', (buffer) => {
    // converting buffer to data
    realData += decoder.write(buffer);
  });

  // triggering stop receiving buffer
  req.on('end', () => {
    realData += decoder.end();
    console.log(realData);
    // response handle
    res.end('Hello World!!');
  });
};

// starting the server
app?.createServer();
