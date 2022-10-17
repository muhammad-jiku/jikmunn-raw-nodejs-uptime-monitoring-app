//  dependencies
const https = require('https');
const querystring = require('querystring');
const { vonageSMS } = require('./environments');

// module scaffolding
const notifications = {};

// send sms via number
notifications.sendSMS = (phone, msg, callback) => {
  const userPhone =
    typeof phone === 'string' && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === 'string' &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    // configure the request payload
    const payload = {
      From: vonageSMS.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    // stringify the payload
    const stringifyThePayload = querystring.stringify(payload);

    // configure the request details
    const requestDetails = {
      hostname: 'rest.nexmo.com',
      method: 'POST',
      path: '/sms/json',
      apiKey: `${vonageSMS.apiKey}`,
      apiSecret: `${vonageSMS.apiSecret}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    // instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // get the status of the sent request
      const status = res.statusCode;

      // callback successfully if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    // handling error
    req.on('error', (e) => {
      callback(e);
    });

    req.write(stringifyThePayload);
    req.end();
  } else {
    callback('Given parameters were missing or invalid!!');
  }
};

// exporting module
module.exports = notifications;
