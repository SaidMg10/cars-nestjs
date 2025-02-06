import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  hostApi: process.env.HOST_API || 'http://localhost:3000/',
  loggerLevel: process.env.LOGGER_LEVEL || 'log',
  apiVersion: process.env.API_VERSION || '0.0.1',
}));
