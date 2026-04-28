import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  GLOBAL_PREFIX: Joi.string().default('api'),
  SWAGGER_ENABLED: Joi.boolean().default(true),
  RMQ_URI: Joi.string().uri({ scheme: ['amqp', 'amqps'] }).required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  MONGO_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(12).required(),
  JWT_REFRESH_SECRET: Joi.string().min(12).required(),
  JWT_ACCESS_TTL: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().required(),
  RATE_LIMIT_TTL: Joi.number().integer().positive().required(),
  RATE_LIMIT_LIMIT: Joi.number().integer().positive().required(),
  LOG_LEVEL: Joi.string().default('info'),
});
