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
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
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
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
    callback(err, data);
  });
};

// update existing data on the file
lib.update = (dir, file, data, callback) => {
  // open file for writing and updating
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //  convert the data to string
      const stringData = JSON.stringify(data);

      // truncate the file
      // fs.truncate(fileDescriptor, (err2) => { // truncate is deperecreted
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              // close the file
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback('Error Close');
                }
              });
            } else {
              callback('Error writing the file');
            }
          });
        } else {
          callback('Error truncating file!!');
        }
      });
    } else {
      console.log('Error updating! File may not exist!!');
    }
  });
};

// deleting existing data
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Failed to delete the file ');
    }
  });
};

// exports lib
module.exports = lib;
