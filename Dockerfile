# Dockerfile (multi-stage) for Next.js standalone output
# Builder: official Node 20 image
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# Runtime: lightweight alpine Node
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone output produced by Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

EXPOSE 3000

# The standalone output provides a server.js entrypoint
CMD ["node", "server.js"]
