// dependencies
const http = require('http');
const environment = require('../helpers/environments');
const { handleReqRes } = require('../helpers/handleReqRes');
const { sendSMS } = require('../helpers/notifications');
const data = require('./data');

// worker object
const worker = {};

// starting the worker
worker.init = () => {
  console.log('worker initialization started!!');
};

// exporting worker
module.exports = worker;
