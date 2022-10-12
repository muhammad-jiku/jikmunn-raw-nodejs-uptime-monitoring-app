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
  // console.log(requestedProperties);
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
  // console.log(requestedProperties);

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

  console.log(phone, password);

  if (phone && password) {
    data.read('users', phone, (err, userInfo) => {
      const userData = { ...parseJSON(userInfo) };
      let convertedHashedPassword = hashedPassword(password);
      console.log(convertedHashedPassword);
      //   console.log(userInfo);
      console.log(userData.password);
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
handler._token.put = (requestedProperties, callback) => {};

// delete method
handler._token.delete = (requestedProperties, callback) => {};

module.exports = handler;
