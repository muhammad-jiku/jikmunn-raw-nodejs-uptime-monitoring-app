// dependencies
const data = require('../../lib/data');
const { hashedPassword } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestedProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  // console.log(requestedProperties);
  if (acceptedMethods?.indexOf(requestedProperties?.method) > -1) {
    handler._users[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405, {
      message: 'Permission Denied!!',
    });
  }
};

// module scaffolding for private user router
handler._users = {};

// get method
handler._users.get = (requestedProperties, callback) => {
  callback(200, {
    message: 'This is users route!!',
  });
};

// post method
handler._users.post = (requestedProperties, callback) => {
  const firstName =
    typeof requestedProperties.body.firstName === 'string' &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName
      : false;

  const lastName =
    typeof requestedProperties.body.lastName === 'string' &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : false;

  const phone =
    typeof requestedProperties.body.phone === 'string' &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : false;

  const password =
    typeof requestedProperties.body.password === 'string' &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : false;

  const tosAgreement =
    typeof requestedProperties.body.tosAgreement === 'string' &&
    requestedProperties.body.tosAgreement.trim().length > 0
      ? requestedProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read('users', phone, (err, usersResult) => {
      if (err) {
        let userDetails = {
          firstName,
          lastName,
          phone,
          password: hashedPassword(password),
          tosAgreement,
        };
      } else {
        callback(500, {
          error:
            'This information is already exists! please check properly and then insert the correct data',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request!!',
    });
  }
};

// put method
handler._users.put = (requestedProperties, callback) => {};

// delete method
handler._users.delete = (requestedProperties, callback) => {};

module.exports = handler;