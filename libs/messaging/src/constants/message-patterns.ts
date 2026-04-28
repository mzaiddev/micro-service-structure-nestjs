export const MESSAGE_PATTERNS = {
  auth: {
    register: 'auth.register',
    login: 'auth.login',
    verifyAccessToken: 'auth.verify-access-token',
    getUserById: 'auth.get-user-by-id',
  },
  users: {
    upsertProfile: 'users.upsert-profile',
    getProfile: 'users.get-profile',
    listProfiles: 'users.list-profiles',
  },
  products: {
    create: 'products.create',
    list: 'products.list',
    getById: 'products.get-by-id',
    getByIds: 'products.get-by-ids',
    reserveStock: 'products.reserve-stock',
  },
  orders: {
    create: 'orders.create',
    listByUser: 'orders.list-by-user',
  },
  notifications: {
    create: 'notifications.create',
    listByUser: 'notifications.list-by-user',
    orderCreated: 'notifications.order-created',
  },
} as const;
