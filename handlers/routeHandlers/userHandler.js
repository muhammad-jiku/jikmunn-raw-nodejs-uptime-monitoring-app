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
handler._users.post = (requestedProperties, callback) => {};

// put method
handler._users.put = (requestedProperties, callback) => {};

// delete method
handler._users.delete = (requestedProperties, callback) => {};

module.exports = handler;
