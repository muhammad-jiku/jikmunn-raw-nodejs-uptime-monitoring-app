// dependencies
const crypto = require('crypto');
const environment = require('./environments');

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
  // console.log(output);
  return output;
};

// hash password
utilities.hashedPassword = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const secret = environment.secretKey;
    const hash = crypto.createHmac('sha256', secret).update(str).digest('hex');

    return hash;
  } else {
    return false;
  }
};

// random string genrator for token
utilities.createRandomString = (strLength) => {
  let length = strLength;

  length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
  if (length) {
    const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let output = '';
    for (let i = 1; i <= length; i++) {
      const randomChar = possibleChar.charAt(
        Math.floor(Math.random() * possibleChar.length)
      );
      output += randomChar;
    }
    return output;
  }
  return false;
};

// exporting utilities
module.exports = utilities;
