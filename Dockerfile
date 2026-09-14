FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Install bash and git for expo modules
RUN apk add --no-cache bash git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source files
COPY . .

# Expose Metro (19000) and React Native debugger (10000)
EXPOSE 19000 19001 19002

# Start Expo dev server, listen on all interfaces for Docker access
CMD ["npx", "expo", "start", "--web", "--clear", "--localhost", "0.0.0.0"]