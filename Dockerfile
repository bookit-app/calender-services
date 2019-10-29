# Use the official lightweight Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:10.16.3-alpine

# Service should map to the directory name of the services/*
# path with the build context of the node source code
ARG service

# Create and change to the app directory.
WORKDIR /usr/app

# Copy root level dependencies details
COPY package*.json ./

# Install root level production dependencies.
RUN npm install --only=production

# Copy shared code to the image
COPY src/lib ./src/lib

# Use build argument to only copy what is necessary
COPY src/services/${service} ./src/services/${service}

# Switch to location of the service
WORKDIR /usr/app/src/services/${service}

# Install any service level dependencies
RUN npm install --only=production

# Run the web service on container startup.
CMD [ "npm", "start" ]