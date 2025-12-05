# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Configure npm for better network handling
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-factor 2
RUN npm config set fetch-retry-mintimeout 10000
RUN npm config set fetch-retry-maxtimeout 60000

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production --no-audit --no-fund

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including autoprefixer
RUN npm install
RUN npm install autoprefixer

# Copy source code
COPY . .

# Skip build for development mode

EXPOSE 3000

# Copy start script
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

# Start the application
CMD ["./docker-start.sh"]