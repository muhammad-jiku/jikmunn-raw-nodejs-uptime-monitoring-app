// dependecies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const {
  notFoundHandler,
} = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// module scaffolding
const handler = {};

// handle request and response
handler.handleReqRes = (req, res) => {
  // requesting url handling
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true); // parse url receives two parameters. one of them is requested url and other one is thoe boolean statement. if its "true" its gonna take everything from url like qurey and if its "false" its gonna take only the url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  // collecting all the requested property of the url
  const requestedProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder('utf-8');
  let realData = '';

  // chosing and checking routes
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  chosenHandler(requestedProperties, (statusCode, payload) => {
    statusCode = typeof statusCode === 'number' ? statusCode : 500;
    payload = typeof payload === 'object' ? payload : {};

    const payloadString = JSON.stringify(payload);

    // returning final response
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  // payload or body in the request
  // receivng buffer
  req.on('data', (buffer) => {
    // converting buffer to data
    realData += decoder.write(buffer);
  });

  // triggering stop receiving buffer
  req.on('end', () => {
    realData += decoder.end();

    // receiving data from users
    requestedProperties.body = parseJSON(realData);

    // console.log(realData);
    // response handle
    res.end('Hello World!!');
  });
};

module.exports = handler;
