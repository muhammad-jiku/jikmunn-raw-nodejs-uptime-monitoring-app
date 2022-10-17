// dependencies
const http = require('http');
const environment = require('../helpers/environments');
const { handleReqRes } = require('../helpers/handleReqRes');
const { sendSMS } = require('../helpers/notifications');
const data = require('./data');

// server object
const server = {};

//
// sendSMS(
//   '01766253827',
//   'Hello there! This is a top secret message! you should come to visit wwe at Brooklyn! always keep your data on! BYE',
//   (err) => {
//     console.log(`The error is ${err}`);
//   }
// );

// configuration
server.config = {
  port: 4000,
};

// testing file system
//  crud operation check starts
// create data
// data.create(
//   'test',
//   'details',
//   { name: 'Jiku', nationality: 'Bangladesh' },
//   (err) => {
//     console.log(`error was ${err}`);
//   }
// );

// read data
// data.read('test', 'personalInfo', (err, data) => {
//   console.log(err, data);
// });

// update data
// data.update(
//   'test',
//   'personalInfo',
//   {
//     name: 'Muhammad Azizul Hoque Jiku ',
//     nationality: 'Bangladeshi',
//     religion: 'Islam',
//     hometown: 'Feni',
//   },
//   (err) => {
//     console.log(`error was ${err}`);
//   }
// );

// delete data
// data.delete('test', 'details', (err) => {
//   console.log(err);
// });

// create server
server.createServer = () => {
  const serverVariable = http.createServer(server.handleReqRes);
  // const port = server?.config?.port;
  const port = environment.port;
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
