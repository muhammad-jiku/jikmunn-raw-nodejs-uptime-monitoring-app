// module scaffolding
const handler = {};

handler.notFoundHandler = (requestedProperties, callback) => {
  callback(404, {
    message: '404! URL NOT FOUND!!',
  });
};

module.exports = handler;
