# Build stage
FROM node:20-alpine3.19 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine3.19

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3001

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["dumb-init", "sh", "-c", "sleep 10 && npm run start"]