# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory
WORKDIR /TODOApp

# Copy the package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the frontend files
COPY ./public ./public
COPY ./src ./src

# Expose the port React runs on
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]