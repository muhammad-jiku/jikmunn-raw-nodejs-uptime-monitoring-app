// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

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
app.handleReqRes = handleReqRes;

// starting the server
app?.createServer();
