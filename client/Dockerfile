# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.18.0

################################################################################
# Install production dependecies.
FROM node:${NODE_VERSION}-alpine AS build
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM nginx:alpine

# Copy package.json so that package manager commands can be used.
COPY package.json ./

# Copy the production dependencies from the build stage into the image.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port that the application listens on.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
