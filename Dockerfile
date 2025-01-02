# Stage 1: Build the frontend
FROM node:23-alpine AS frontend-builder
RUN apk add --no-cache libc6-compat
WORKDIR /app/frontend
COPY services/frontend/package.json services/frontend/package-lock.json services/frontend/pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm --version
RUN pnpm install
COPY services/frontend/ ./
RUN pnpm run build

# Stage 2: Build the backend
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app/backend
COPY services/backend/go.mod services/backend/go.sum ./
RUN go mod download
COPY services/backend/ ./
RUN go build -o alertflow-backend

# Stage 3: Create the final image
FROM ubuntu:20.04
WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL="https://your-api-url.com"

# Create user and group
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy the backend binary
COPY --from=backend-builder /app/backend/alertflow-backend /app/

# Copy the frontend build
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public

# Set the correct permission for prerender cache
RUN mkdir .next \
    && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

# Expose ports
EXPOSE 8080 3000

# Start the backend and frontend
CMD ["sh", "-c", "./alertflow-backend --config /app/backend/config/config.yaml & node server.js"]