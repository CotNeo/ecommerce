# Frontend Dockerfile
FROM node:18-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package*.json ../../
COPY ../packages/shared-kernel/package.json ../packages/shared-kernel/
COPY ../packages/shared-config/package.json ../packages/shared-config/

# Install dependencies
RUN npm ci

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/../../node_modules ../../node_modules

# Copy source code
COPY . .
COPY ../packages ../packages

# Build shared packages
WORKDIR /app/../packages/shared-kernel
RUN npm run build

WORKDIR /app/../packages/shared-config
RUN npm run build

# Build frontend
WORKDIR /app
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

