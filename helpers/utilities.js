// dependencies

// module scaffolding
const utilities = {};

// parse json string to output
utilities.parseJSON = (joinString) => {
  let output;
  try {
    output = JSON.parse(joinString);
  } catch {
    output = {};
  }

  return output;
};

// exporting utilities
module.exports = utilities;
