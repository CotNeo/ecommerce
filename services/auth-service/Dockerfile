# Auth Service Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package*.json ../../
COPY ../../packages/shared-kernel/package.json ../../packages/shared-kernel/
COPY ../../packages/shared-config/package.json ../../packages/shared-config/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
COPY ../../packages ../../packages

# Build shared packages
WORKDIR /app/../../packages/shared-kernel
RUN npm run build

WORKDIR /app/../../packages/shared-config
RUN npm run build

# Build service
WORKDIR /app
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package*.json ../../
COPY ../../packages/shared-kernel/package.json ../../packages/shared-kernel/
COPY ../../packages/shared-config/package.json ../../packages/shared-config/

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/../../packages/shared-kernel/dist ../../packages/shared-kernel/dist
COPY --from=builder /app/../../packages/shared-config/dist ../../packages/shared-config/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]

