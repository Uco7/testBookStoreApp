# Stage 1: Build & Dependencies
FROM node:22-slim AS builder

# Install build essentials for native modules (like bcrypt)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Stage 2: Production Runtime
FROM node:22-slim

# CRITICAL: Install LibreOffice for your document conversion packages
RUN apt-get update && apt-get install -y \
    libreoffice \
    # ghostscript is often needed by docx-pdf
    ghostscript \
    # Clean up to keep the image small
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app /app

# Set environment to production
ENV NODE_ENV=production

# Render uses the PORT env variable automatically
EXPOSE 10000

# Start the application
CMD ["node", "src/server.js"]