export const SERVICE_REGISTRY = {
  AUTH: {
    token: 'AUTH_SERVICE',
    queueEnv: 'AUTH_SERVICE_QUEUE',
    queue: 'auth.queue',
  },
  USER: {
    token: 'USER_SERVICE',
    queueEnv: 'USER_SERVICE_QUEUE',
    queue: 'user.queue',
  },
  PRODUCT: {
    token: 'PRODUCT_SERVICE',
    queueEnv: 'PRODUCT_SERVICE_QUEUE',
    queue: 'product.queue',
  },
  ORDER: {
    token: 'ORDER_SERVICE',
    queueEnv: 'ORDER_SERVICE_QUEUE',
    queue: 'order.queue',
  },
  NOTIFICATION: {
    token: 'NOTIFICATION_SERVICE',
    queueEnv: 'NOTIFICATION_SERVICE_QUEUE',
    queue: 'notification.queue',
  },
} as const;

export type ServiceKey = keyof typeof SERVICE_REGISTRY;
