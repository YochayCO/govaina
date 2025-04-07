# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.18.0

################################################################################
# Install production dependecies.
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY --link . .

# Run the build script.
RUN npm run build

# Remove devDependencies
RUN npm prune --omit=dev  

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM nginx:alpine

# Use production node environment by default.
ENV NODE_ENV=production

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the build stage into the image.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port that the application listens on.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
