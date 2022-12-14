// dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 4000,
  envName: 'staging',
  secretKey: '9a8b7c66d5e4f3g02kl001',
  maxChecks: 10,
  vonageSMS: {
    fromPhone: '+8801855613783',
    apiKey: '74676b74',
    apiSecret: 'uOOWz8dyeprGB9EL',
  },
};

environments.production = {
  port: 5000,
  envName: 'production',
  secretKey: 'hijklmnop1giujkl;23456789',
  maxChecks: 10,
  vonageSMS: {
    fromPhone: '+8801855613783',
    apiKey: '74676b74',
    apiSecret: 'uOOWz8dyeprGB9EL',
  },
};

// determine which environment is passing
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// exporting environments
module.exports = environmentToExport;
