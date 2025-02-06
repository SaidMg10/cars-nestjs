const {
  NODE_ENV: environment = 'development',
  PORT: port = 3000,
  HOST_API: hostApi = 'http://localhost:3000/',
  LOGGER_LEVEL: loggerLevel = 'log',
  API_VERSION: apiVersion = '0.0.1',
} = process.env;

export const AppConfiguration = () => ({
  environment,
  port,
  hostApi,
  loggerLevel,
  apiVersion,
});
