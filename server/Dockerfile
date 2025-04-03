# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.18.0

# Step 1: Build the server
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json tsconfig.json ./
RUN npm install

# Copy the rest of the server files
COPY src ./src

# Build the TypeScript files
RUN node_modules/.bin/tsc -b

# Step 2: Run the server
FROM node:${NODE_VERSION}-alpine AS deploy

WORKDIR /app

# Copy dependencies from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./

# Expose port 3000 for the server
EXPOSE 3000

# Run the server
CMD ["npm", "run", "start"]
