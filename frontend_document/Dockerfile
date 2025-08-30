# --- Stage 1: Builder ---
FROM node:20 AS builder

WORKDIR /app

# Copy only lock files and package info to leverage caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy full source code
COPY . .

# Build Next.js app
RUN npm run build


# --- Stage 2: Production runner ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=1111

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Optional: include env
COPY .env.local .env.local

EXPOSE 1111

CMD ["npm", "start"]


# --- Stage 3: Dev mode ---
FROM node:20 AS dev

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=1111

# Copy package files & install
COPY package.json package-lock.json* ./
RUN npm install

# Copy full code
COPY . .

EXPOSE 1111

CMD ["npm", "run", "dev"]
