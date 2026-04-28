export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  globalPrefix: process.env.GLOBAL_PREFIX ?? 'api',
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
  rateLimitTtl: Number(process.env.RATE_LIMIT_TTL ?? 60),
  rateLimitLimit: Number(process.env.RATE_LIMIT_LIMIT ?? 100),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
  rmq: {
    uri: process.env.RMQ_URI ?? 'amqp://localhost:5672',
  },
});
