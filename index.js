// dependencies
const http = require('http');
const environment = require('./helpers/environments');
const { handleReqRes } = require('./helpers/handleReqRes');
const { sendSMS } = require('./helpers/notifications');
const data = require('./lib/data');

// app object
const app = {};

//
sendSMS(
  '01766253827',
  'Hello there! This is a top secret message! you should come to visit wwe at Brooklyn! always keep your data on! BYE',
  (err) => {
    console.log(`The error is ${err}`);
  }
);

// configuration
app.config = {
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
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  // const port = app?.config?.port;
  const port = environment.port;
  server.listen(port, () => {
    console.log(`server runnig at http://localhost:${port}`);
  });
};

// handle request and response
app.handleReqRes = handleReqRes;

// starting the server
app?.createServer();
