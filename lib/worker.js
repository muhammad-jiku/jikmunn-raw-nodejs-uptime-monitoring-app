// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendSMS } = require('../helpers/notifications');

// worker object
const worker = {};

// checking all the check data
worker.gatherAllTheChecks = () => {
  //  get all the checks
  data.list('checks', (err, checkLists) => {
    if (!err && checkLists && checkLists.length > 0) {
      checkLists.forEach((check) => {
        //   read the checkdata
        data.read('checks', check, (err2, checkData) => {
          if (!err2 && checkData) {
            // passing the data to check the validattor
            worker.validateCheckData(parseJSON(checkData));
          } else {
            console.log('Error: reading one of the check data!');
          }
        });
      });
    } else {
      console.log('Error: could not find any checks to process!');
    }
  });
};

// validating individula check data
worker.validateCheckData = (checkDataInfo) => {
  const checkInfo = checkDataInfo;
  if (checkDataInfo && checkDataInfo?.id) {
    checkInfo.state =
      typeof checkDataInfo.state === 'string' &&
      ['up', 'down'].indexOf(checkDataInfo.state) > -1
        ? checkDataInfo.state
        : 'down';

    checkInfo.lastChecked =
      typeof checkDataInfo.lastChecked === 'number' &&
      checkDataInfo.lastChecked > 0
        ? checkDataInfo.lastChecked
        : false;

    // passing to the next process
    worker.performCheck(checkInfo);
  } else {
    //
    console.log(`Error: check was invalid or not properly formatted!!`);
  }
};

// checking perform of check
worker.performCheck = (checkDataInfo) => {
  // prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false,
  };

  // mark the outcome has not been sent yet
  let outcomeSent = false;

  //  parse the goostnaem & full url from original data
  const parsedUrl = url.parse(
    `${checkDataInfo.protocol}://${checkDataInfo.url}`,
    true
  );
  const hostName = parsedUrl.hostname;
  const { path } = parsedUrl;

  // construct the request
  const requestDetails = {
    protocol: `${checkDataInfo.protocol}:`,
    hostname: hostName,
    method: checkDataInfo.method.toUpperCase(),
    path,
    timeout: checkDataInfo.timeoutSeconds * 1000,
  };

  // const requestInfo = { ...parseJSON(requestDetails) };
  // // console.log(requestDetails);
  // console.log(requestInfo);

  const protocolToUse = checkDataInfo.protocol === 'http' ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    // console.log(requestInfo.protocol);

    // grab the status of the response
    const status = res.statusCode;
    // console.log(status);

    // update the check outcome and pass to the next process
    checkOutcome.responseCode = status;
    // console.log(checkOutcome.responseCode);

    if (!outcomeSent) {
      worker.processCheckOutcome(checkDataInfo, checkOutcome);
      outcomeSent = true;
    }
  });

  // handling the error
  req.on('error', (e) => {
    checkOutcome = {
      error: true,
      value: e,
    };

    // update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(checkDataInfo, checkOutcome);
      outcomeSent = true;
    }
  });

  // handling the timeout
  req.on('timeout', () => {
    checkOutcome = {
      error: true,
      value: 'timeout',
    };

    // update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(checkDataInfo, checkOutcome);
      outcomeSent = true;
    }
  });

  // sending the req
  req.end();
};

// save outcome to database and passing to next process
worker.processCheckOutcome = (checkDataInfo, checkOutcome) => {
  // checking if check outcome is up or down
  const state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    checkDataInfo.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? 'up'
      : 'down';

  // decide wheather we should alert the user or not
  const alertWanted = !!(
    checkDataInfo.lastChecked && checkDataInfo.state !== state
  );

  // update check data
  let newCheckData = checkDataInfo;

  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // update the check data to disk
  data.update('checks', newCheckData?.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // send the checkdata to next process
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log('Alert is not needed as there is no state changed!');
      }
    } else {
      console.log('Error trying to save check data of one of the checks!!');
    }
  });
};

// sending notification to user if state is changed
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: You check for ${newCheckData?.method?.toUpperCase()} ${
    newCheckData?.protocol
  }://${newCheckData?.url} is currently ${newCheckData?.state}`;

  sendSMS(newCheckData?.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was notified to a status change via sms: ${msg}`);
    } else {
      console.log('There was a problem sending sms to one of the user!');
    }
  });
};

// executing the process per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllTheChecks();
  }, 60 * 1000);
};

// starting the worker
worker.init = () => {
  //   executing the all checks data
  worker.gatherAllTheChecks();

  // calling the checks to continue the loop
  worker.loop();
};

// exporting worker
module.exports = worker;
