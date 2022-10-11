// dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 4000,
  envName: 'staging',
};

environments.production = {
  port: 5000,
  envName: 'staging',
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
