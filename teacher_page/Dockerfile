# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
RUN npm install -g npm@11.6.2
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build client + server
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g npm@11.6.2
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Install production dependencies only
FROM node:22-alpine AS prod-deps
WORKDIR /app
RUN npm install -g npm@11.6.2
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Stage 4: Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["node", "dist/server/node-build.mjs"]
