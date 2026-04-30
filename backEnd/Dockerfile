# ===============================
# Stage 1: Build Dependencies
# ===============================
FROM node:22-slim AS builder

# Install build tools (for native modules like bcrypt)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev

# Copy app source code
COPY . .

# ===============================
# Stage 2: Production Runtime
# ===============================
FROM node:22-slim

# Install LibreOffice + required dependencies for conversion
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    ghostscript \
    fonts-dejavu \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

# Set environment
ENV NODE_ENV=production

# Render will inject PORT automatically
EXPOSE 10000

# Start server
CMD ["node", "src/server.js"]






