# Use an official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve for static file serving
RUN npm install -g serve

# Expose the port for the frontend application
EXPOSE 3000

# Run the application in production mode
CMD ["serve", "-s", "dist"]
