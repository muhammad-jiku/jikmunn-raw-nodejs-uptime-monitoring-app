// dependencies
const data = require('../../lib/data');
const { hashedPassword, parseJSON } = require('../../helpers/utilities');

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
  // checking the user validation based on number validation
  const phone =
    typeof requestedProperties.queryStringObject?.phone === 'string' &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read('users', phone, (err, userData) => {
      const user = { ...parseJSON(userData) };
      if (!err && user) {
        delete user?.password;
        callback(200, user);
      } else {
        callback(404, {
          error: 'Requested user not found!!',
        });
      }
    });
  } else {
    callback(404, {
      error: 'Requested user not found!!',
    });
  }
};

// post method
handler._users.post = (requestedProperties, callback) => {
  // console.log(requestedProperties);
  const firstName =
    typeof requestedProperties.body?.firstName === 'string' &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName
      : false;

  const lastName =
    typeof requestedProperties.body?.lastName === 'string' &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestedProperties.body?.tosAgreement === 'boolean'
      ? requestedProperties.body.tosAgreement
      : false;

  console.log(firstName, lastName, phone, password, tosAgreement);

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read('users', phone, (err) => {
      if (err) {
        let userDetails = {
          firstName,
          lastName,
          phone,
          password: hashedPassword(password),
          tosAgreement,
        };

        // store the users info to the db
        data.create('users', phone, userDetails, (err2) => {
          if (!err2) {
            callback(200, {
              message: 'User information added to the database successfully!!',
            });
          } else {
            callback(500, {
              error:
                'Sorry! fail to create user information! try again later!!',
            });
          }
        });
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
handler._users.put = (requestedProperties, callback) => {
  const firstName =
    typeof requestedProperties.body?.firstName === 'string' &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName
      : false;

  const lastName =
    typeof requestedProperties.body?.lastName === 'string' &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      data.read('users', phone, (err, userInfo) => {
        const userData = { ...parseJSON(userInfo) };
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hashedPassword(password);
          }

          // store data to the server
          data.update('users', phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: 'User information updated successfully!',
              });
            } else {
              callback(500, {
                error: 'There was a problem in the server side!!',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Your request have a problem!!',
          });
        }
      });
    } else {
      callback(400, {
        error: 'Something went wrong! Please try again!!',
      });
    }
  } else {
    callback(400, {
      error: 'Invalid phone number! Please try again!!',
    });
  }
};

// delete method
handler._users.delete = (requestedProperties, callback) => {
  // checking the user validation based on number validation
  const phone =
    typeof requestedProperties.queryStringObject?.phone === 'string' &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read('users', phone, (err, userData) => {
      if (!err && userData) {
        data.delete('users', phone, (err2) => {
          if (!err2) {
            callback(200, {
              message: ' User details removed successfully!!',
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

module.exports = handler;
