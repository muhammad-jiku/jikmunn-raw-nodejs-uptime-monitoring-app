// dependencies
const data = require('../../lib/data');
const { hashedPassword, parseJSON } = require('../../helpers/utilities');
const { tokenHandler, _token } = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestedProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  // console.log(requestedProperties);
  if (acceptedMethods?.indexOf(requestedProperties?.method) > -1) {
    handler._check[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405, {
      message: 'Permission Denied!!',
    });
  }
};

// module scaffolding for private user router
handler._check = {};

// get method
handler._check.get = (requestedProperties, callback) => {};

// post method
handler._check.post = (requestedProperties, callback) => {};

// put method
handler._check.put = (requestedProperties, callback) => {};

// delete method
handler._check.delete = (requestedProperties, callback) => {};

module.exports = handler;
