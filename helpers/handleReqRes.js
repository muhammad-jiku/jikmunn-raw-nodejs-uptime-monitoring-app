// dependecies
const url = require('url');
const { StringDecoder } = require('string_decoder');

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

module.exports = handler;
