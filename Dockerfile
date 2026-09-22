# ==============================================================================
# Multi-stage Dockerfile for Festival "11 Kadrov"
# Builds modern React/Tailwind frontend + Node.js/Express backend into a single image
# ==============================================================================

# STAGE 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source tree
COPY . .

# Build frontend into dist/ and bundle server into dist/server.cjs
RUN npm run build

# STAGE 2: Lightweight Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors and install only runtime production packages
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy compiled production assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/schema.sql ./schema.sql

EXPOSE 3000

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Start bundled Express server
CMD ["node", "dist/server.cjs"]
