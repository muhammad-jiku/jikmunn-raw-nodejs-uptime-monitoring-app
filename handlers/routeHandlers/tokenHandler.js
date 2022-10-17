// dependencies
const {
  hashedPassword,
  createRandomString,
  parseJSON,
} = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestedProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];

  if (acceptedMethods?.indexOf(requestedProperties?.method) > -1) {
    handler._token[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405, {
      message: 'Permission Denied!!',
    });
  }
};

// module scaffolding for private user router
handler._token = {};

// get method
handler._token.get = (requestedProperties, callback) => {
  // checking the user validation based on token id validation
  const id =
    typeof requestedProperties.queryStringObject?.id === 'string' &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : false;

  if (id) {
    data.read('tokens', id, (err, tokenInfo) => {
      const tokenData = { ...parseJSON(tokenInfo) };
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, {
          error: 'Requested token for the id is not found!!',
        });
      }
    });
  } else {
    callback(404, {
      error: 'Requested token for the id is not found!!',
    });
  }
};

// post method
handler._token.post = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body?.phone === 'string' &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : false;

  const password =
    typeof requestedProperties.body?.password === 'string' &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : false;

  if (phone && password) {
    data.read('users', phone, (err, userInfo) => {
      const userData = { ...parseJSON(userInfo) };
      let convertedHashedPassword = hashedPassword(password);

      if (convertedHashedPassword === userData.password) {
        let tokenId = createRandomString(20);
        let expiresInTime = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expiresInTime,
        };

        //   store the token to the db
        data.create('tokens', tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: 'There is something wrong in the server!',
            });
          }
        });
      } else {
        callback(400, {
          error: 'Password did not match! Please try again!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There is a problem in your request!!',
    });
  }
};

// put method
handler._token.put = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.body?.id === 'string' &&
    requestedProperties.body.id.trim().length === 20
      ? requestedProperties.body.id
      : false;
  const extend =
    typeof requestedProperties.body?.extend === 'boolean' &&
    requestedProperties.body?.extend === true
      ? true
      : false;

  if (id && extend) {
    data.read('tokens', id, (err, tokenData) => {
      const token = parseJSON(tokenData);
      if (token.expiresInTime > Date.now()) {
        token.expiresInTime = Date.now() + 60 * 60 * 1000;

        // store the updated token
        data.update('tokens', id, token, (err2) => {
          if (!err2) {
            callback(200);
          } else {
            callback(500, {
              error: 'There was an error in server side!',
            });
          }
        });
      } else {
        callback(400, { error: 'Token is already expired!' });
      }
    });
  } else {
    callback(400, { error: 'There is an error in the request!' });
  }
};

// delete method
handler._token.delete = (requestedProperties, callback) => {
  // checking the user validation based on token id validation
  const id =
    typeof requestedProperties.queryStringObject?.id === 'string' &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : false;

  // searching user data  based on token id
  if (id) {
    data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('tokens', id, (err2) => {
          if (!err2) {
            callback(200, {
              message: 'Token deleted successfully!!',
            });
          } else {
            callback(500, {
              error: 'There was a server side error!!',
            });
          }
        });
      } else {
        callback(500, {
          error: 'Sorry! server has some issues!!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Something wen wrong during the request! Please try again later!!',
    });
  }
};

// verifying token
handler._token.verify = (id, phone, callback) => {
  data.read('tokens', id, (err, tokenData) => {
    const token = parseJSON(tokenData);
    if (!err && token) {
      if (token.phone === phone && token.expiresInTime > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
