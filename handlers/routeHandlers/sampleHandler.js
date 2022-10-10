// module scaffolding
const handler = {};

handler.sampleHandler = (requestedProperties, callback) => {
  console.log(requestedProperties);
  callback(200, {
    message: 'This is just a sample url test!!',
  });
};

module.exports = handler;
