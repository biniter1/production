# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files trước để tận dụng Docker layer cache
# Nếu code thay đổi nhưng package.json không đổi → layer này được cache
COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Builder (dev deps để chạy test nếu cần) ──
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ── Stage 3: Production Runner ──
FROM node:20-alpine AS runner

WORKDIR /app

# Security: không chạy với quyền root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy chỉ những thứ cần thiết
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Chạy với non-root user
USER appuser

EXPOSE 3000

# Health check tích hợp trong Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
