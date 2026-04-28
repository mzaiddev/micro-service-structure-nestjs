# NestJS Enterprise Microservices Monorepo

Production-oriented NestJS microservices platform starter with a centralized API gateway, RabbitMQ-based service communication, PostgreSQL and Mongo persistence, Redis caching, JWT auth, RBAC, Swagger, health checks, Winston logging, Docker, and CI scaffolding.

## What is included

- `apps/api-gateway`: public HTTP entrypoint with Swagger, rate limiting, JWT auth, RBAC, and service proxy controllers.
- `apps/auth-service`: credential store, password hashing, JWT issuance, and token verification.
- `apps/user-service`: user profile service with PostgreSQL persistence and Redis profile caching.
- `apps/product-service`: catalog and inventory service with PostgreSQL persistence and Redis-backed list caching.
- `apps/order-service`: order orchestration service that calls product inventory and emits notification events.
- `apps/notification-service`: Mongo-backed notification service consuming RabbitMQ events.
- `apps/*-service` placeholders for the remaining bounded contexts in the platform roadmap.
- `libs/common`: bootstrap helpers, decorators, filters, DTOs, and shared enums.
- `libs/config`: global `.env` configuration and validation.
- `libs/database`: reusable PostgreSQL and Mongo factory helpers plus base entities.
- `libs/messaging`: queue registry, RMQ helpers, and message pattern constants.
- `libs/auth`: JWT strategy, guards, token service, and shared auth interfaces.
- `libs/logger`: Winston-backed logger service.
- `libs/cache`: Redis service wrapper for cache use cases.
- `libs/utils`: small shared helpers such as pagination metadata builders.

## Service architecture

- Public traffic enters through `api-gateway`.
- The gateway authenticates JWTs, enforces RBAC and rate limits, and proxies to internal services over RabbitMQ RPC.
- Internal domain services stay loosely coupled by communicating through message patterns instead of direct imports.
- PostgreSQL is used for transactional services such as auth, users, products, and orders.
- MongoDB is used for notification/event-style document storage.
- Redis is used for read caching and can be extended for sessions, distributed locks, and lightweight queues.

## Folder structure

```text
apps/
  api-gateway/
  auth-service/
  user-service/
  product-service/
  order-service/
  notification-service/
  payment-service/
  subscription-service/
  email-service/
  sms-service/
  file-upload-service/
  filtering-service/
  streaming-service/
  chat-service/
  analytics-service/
  logging-service/
  admin-panel-service/
  reports-service/
  billing-service/
  invoice-service/
  wallet-service/
  review-service/
  recommendation-service/
  fraud-detection-service/
  audit-service/
  kyc-service/
  support-ticket-service/
  scheduler-service/
  webhook-service/
  settings-service/
  monitoring-service/
  backup-service/

libs/
  common/
  config/
  database/
  messaging/
  auth/
  logger/
  cache/
  utils/
```

## Local setup

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Start infrastructure with `docker compose up -d postgres mongo redis rabbitmq`.
4. Start services in separate terminals:
   - `npm run start:dev:gateway`
   - `npm run start:dev:auth`
   - `npm run start:dev:user`
   - `npm run start:dev:product`
   - `npm run start:dev:order`
   - `npm run start:dev:notification`
5. Open Swagger:
   - Gateway: `http://localhost:3000/docs`
   - Services: `http://localhost:3001/docs` through `http://localhost:3005/docs`

## Docker workflow

- Full stack: `docker compose up --build`
- Each app is built from the shared `Dockerfile` using the `APP_NAME` build arg.
- Infrastructure services are already wired in `docker-compose.yml`.

## Working example flows

### Register and login

1. `POST /api/v1/auth/register`
2. `POST /api/v1/auth/login`
3. Use the returned bearer token against protected endpoints.

### Product and order flow

1. `POST /api/v1/products` as an admin.
2. `GET /api/v1/products`
3. `POST /api/v1/orders` as an authenticated user.
4. `GET /api/v1/notifications/me` to see the order-created notification generated asynchronously.

## How to add the remaining services quickly

- Duplicate one of the existing services when you need a transactional service with health checks and RMQ connectivity.
- Use `npm run service:scaffold -- <service-name>` to create a new service shell and register it in `nest-cli.json`.
- Follow the same pattern:
  - Define DTOs, entities or schemas, and message patterns.
  - Add a queue entry in `libs/messaging/src/constants/service-registry.ts`.
  - Add environment variables for the new service port, queue, and database.
  - Import `registerRmqClients(...)` only for the dependent services you actually call.

## Enterprise conventions in this starter

- Loose coupling through message patterns and queue-based communication.
- Independent deployment per service using a shared Docker build contract.
- Centralized bootstrap, logging, configuration, and exception handling.
- JWT auth and RBAC at the gateway boundary.
- Health endpoints on every running service.
- CI foundation in `.github/workflows/ci.yml`.
- Monorepo organization with reusable shared libraries instead of copy-pasted infrastructure code.

## Notes

- The implemented services are production-pattern examples, not a finished business platform.
- The placeholder services are intentionally separated by bounded context so teams can evolve them independently.
- For a real deployment, add database migrations, secret management, tracing, queue dead-letter strategies, and environment-specific Compose or Helm overlays.
