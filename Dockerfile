FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM deps AS build
WORKDIR /usr/src/app
COPY . .
ARG APP_NAME=api-gateway
RUN npx nest build ${APP_NAME}

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
ARG APP_NAME=api-gateway
ENV APP_NAME=${APP_NAME}
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main.js"]
