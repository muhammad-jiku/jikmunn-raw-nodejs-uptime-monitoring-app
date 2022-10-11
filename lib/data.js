// dependencies
const fs = require('fs');
const path = require('path');

//
const lib = {};

// base directory for data folder
lib.baseDir = path.join(__dirname, '/../data/');

// write data to file
lib.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(`${lib.baseDir + dir / file.json}`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // writ data to file and then close it
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback('Error closing the new file!');
            }
          });
        } else {
          callback('Error writing to new File!');
        }
      });
    } else {
      // callback(err);
      callback('Could nor create new file, it may alreeady exists!!');
    }
  });
};

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir + dir / file.json}`, 'utf-8', (err, data) => {
    callback(err, data);
  });
};

// exports lib
module.exports = lib;
