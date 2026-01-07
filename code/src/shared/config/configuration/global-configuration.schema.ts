import * as Joi from 'joi';

const globalConfigurationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database configuration
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_NAME: Joi.string().default('lego_db'),
  // Queue configuration
  QUEUE_HOST: Joi.string().default('localhost'),
  QUEUE_PORT: Joi.number().default(1883),
});

export default globalConfigurationSchema;
