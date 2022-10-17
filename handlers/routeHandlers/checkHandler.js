// dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const { _token } = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

// module scaffolding
const handler = {};

handler.checkHandler = (requestedProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];

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
handler._check.get = (requestedProperties, callback) => {
  // checking the user validation based on checkId validation
  const id =
    typeof requestedProperties.queryStringObject?.id === 'string' &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : false;

  if (id) {
    // verify token
    let token =
      typeof requestedProperties.headersObject.token === 'string'
        ? requestedProperties.headersObject.token
        : false;

    data.read('checks', id, (err, checkData) => {
      const checkInfo = parseJSON(checkData);
      if (!err && checkInfo) {
        _token.verify(token, checkInfo.userPhone, (isTokenValid) => {
          if (isTokenValid) {
            callback(200, checkInfo);
          } else {
            callback(403, { error: 'Authentication error' });
          }
        });
      } else {
        callback(500, { error: 'You have a problem' });
      }
    });
  } else {
    callback(400, {
      error: 'There is a problem in the request you just made!',
    });
  }
};

// post method
handler._check.post = (requestedProperties, callback) => {
  // validate inputs
  const protocol =
    typeof requestedProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestedProperties.body.protocol) > -1
      ? requestedProperties.body.protocol
      : false;

  const url =
    typeof requestedProperties.body.url === 'string' &&
    requestedProperties.body.url.trim().length > 0
      ? requestedProperties.body.url
      : false;

  const method =
    typeof requestedProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestedProperties.body.method) >
      -1
      ? requestedProperties.body.method
      : false;

  const successCodes =
    typeof requestedProperties.body.successCodes === 'object' &&
    requestedProperties.body.successCodes instanceof Array
      ? requestedProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestedProperties.body.timeoutSeconds === 'number' &&
    requestedProperties.body.timeoutSeconds % 1 === 0 &&
    requestedProperties.body.timeoutSeconds >= 1 &&
    requestedProperties.body.timeoutSeconds <= 5
      ? requestedProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // verify token
    let token =
      typeof requestedProperties.headersObject.token === 'string'
        ? requestedProperties.headersObject.token
        : false;

    // accessing user data by token
    data.read('tokens', token, (err, tokenData) => {
      let userData = parseJSON(tokenData);
      if (!err && tokenData) {
        let userPhone = userData?.phone;
        // getting user data
        data.read('users', userPhone, (err2, userInfo) => {
          if (!err2 && userInfo) {
            _token.verify(token, userPhone, (isTokenValid) => {
              if (isTokenValid) {
                let userObject = parseJSON(userInfo);
                let userChecks =
                  typeof userObject.checks === 'object' &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks?.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  // save the object
                  data.create('checks', checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id to the user object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update('users', userPhone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about the new check
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: 'there is a server side error',
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: 'there is a server side error here!',
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: 'User has already max check limit!',
                  });
                }
              } else {
                callback(403, {
                  error: 'Authentication problem!!',
                });
              }
            });
          } else {
            callback(403, {
              error: 'User not found!!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication problem!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have an problem in your request',
    });
  }
};

// put method
handler._check.put = (requestedProperties, callback) => {
  // id validation
  const id =
    typeof requestedProperties.body?.id === 'string' &&
    requestedProperties.body.id.trim().length === 20
      ? requestedProperties.body.id
      : false;

  // validate inputs
  const protocol =
    typeof requestedProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestedProperties.body.protocol) > -1
      ? requestedProperties.body.protocol
      : false;

  const url =
    typeof requestedProperties.body.url === 'string' &&
    requestedProperties.body.url.trim().length > 0
      ? requestedProperties.body.url
      : false;

  const method =
    typeof requestedProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestedProperties.body.method) >
      -1
      ? requestedProperties.body.method
      : false;

  const successCodes =
    typeof requestedProperties.body.successCodes === 'object' &&
    requestedProperties.body.successCodes instanceof Array
      ? requestedProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestedProperties.body.timeoutSeconds === 'number' &&
    requestedProperties.body.timeoutSeconds % 1 === 0 &&
    requestedProperties.body.timeoutSeconds >= 1 &&
    requestedProperties.body.timeoutSeconds <= 5
      ? requestedProperties.body.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // checking data on checkk route
      data.read('checks', id, (err, checkData) => {
        if (!err && checkData) {
          const checkObject = parseJSON(checkData);

          // verify token
          let token =
            typeof requestedProperties.headersObject.token === 'string'
              ? requestedProperties.headersObject.token
              : false;

          _token.verify(token, checkObject.userPhone, (isTokenValid) => {
            if (isTokenValid) {
              if (protocol) {
                checkObject.protocol = protocol;
              }
              if (url) {
                checkObject.url = url;
              }
              if (method) {
                checkObject.method = method;
              }
              if (successCodes) {
                checkObject.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
              }

              //  update the stored data in checks
              data.update('checks', id, checkObject, (err2) => {
                if (!err2) {
                  callback(200);
                } else {
                  callback(500, { error: 'Server side error!' });
                }
              });
            } else {
              callback(403, { error: 'authentication failed' });
            }
          });
        } else {
          callback(500, {
            error: 'There is a server side error in your request, Sir!',
          });
        }
      });
    } else {
      callback(400, {
        error: 'There is a problem in your request, Sir!',
      });
    }
  } else {
    callback(400, {
      error: 'There is a problem in your request, Sir',
    });
  }
};

// delete method
handler._check.delete = (requestedProperties, callback) => {
  // checking the user validation based on checkId validation
  const id =
    typeof requestedProperties.queryStringObject?.id === 'string' &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : false;

  if (id) {
    // verify token
    let token =
      typeof requestedProperties.headersObject.token === 'string'
        ? requestedProperties.headersObject.token
        : false;

    data.read('checks', id, (err, checkData) => {
      const checkInfo = parseJSON(checkData);
      if (!err && checkInfo) {
        _token.verify(token, checkInfo.userPhone, (isTokenValid) => {
          if (isTokenValid) {
            // delete the checked data
            data.delete('checks', id, (err2) => {
              if (!err2) {
                data.read('users', checkInfo.userPhone, (err3, userData) => {
                  let userObject = parseJSON(userData);
                  if (!err3 && userData) {
                    let userChecks =
                      typeof userObject.checks === 'object' &&
                      userObject.checks instanceof Array
                        ? userObject.checks
                        : [];

                    // remove the deleted checkId  from the users data
                    let checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      // resave the user data
                      userObject.checks = userChecks;

                      data.update(
                        'users',
                        userObject.phone,
                        userObject,
                        (err4) => {
                          if (!err4) {
                            callback(200);
                          } else {
                            callback(500, {
                              error: 'Server error happens',
                            });
                          }
                        }
                      );
                    } else {
                      callback(400, { error: 'checkId is not found!' });
                    }
                  } else {
                    callback(500, {
                      error: 'There was a server side problem!!',
                    });
                  }
                });
              } else {
                callback(500, {
                  error: 'There was a server side problem!',
                });
              }
            });
          } else {
            callback(403, { error: 'Authentication error' });
          }
        });
      } else {
        callback(500, { error: 'You have a problem' });
      }
    });
  } else {
    callback(400, {
      error: 'There is a problem in the request you just made!',
    });
  }
};

module.exports = handler;
