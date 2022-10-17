// dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// app object
const app = {};

app.init = () => {
  // start the server
  server.init();

  // start the worker
  worker.init();
};

// calling the function
app.init();

// exporting app
module.exports = app;
