// dependencies
const http = require('http');
const environment = require('../helpers/environments');
const { handleReqRes } = require('../helpers/handleReqRes');

// server object
const server = {};

// configuration
server.config = {
  port: 4001,
};

// create server
server.createServer = () => {
  const serverVariable = http.createServer(server.handleReqRes);

  const port = environment.port || server?.config?.port;
  serverVariable.listen(port, () => {
    console.log(`server runnig at http://localhost:${port}`);
  });
};

// handle request and response
server.handleReqRes = handleReqRes;

// starting the server
server.init = () => {
  server?.createServer();
};

// exporting server
module.exports = server;
