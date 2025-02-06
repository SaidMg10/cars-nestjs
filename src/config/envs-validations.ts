import * as Joi from 'joi';

export const envsSchema = Joi.object({
  PORT: Joi.number().min(1000).required(),
  NODE_ENV: Joi.string()
    .valid('development', 'testing', 'production')
    .default('development'),
  API_VERSION: Joi.string().min(1).required(),
  HOST_API: Joi.string().uri().default('http://localhost:3000/api'),
  LOGGER_LEVEL: Joi.string()
    .valid('log', 'error', 'warn', 'debug')
    .default('log'),
});
