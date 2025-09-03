# Use official Node.js LTS image as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript and nodemon globally (for development)
RUN npm install -g typescript nodemon

# Compile TypeScript to JavaScript
RUN tsc

# Expose port if your location service has an HTTP API (optional, adjust as needed)
EXPOSE 5000

# Command to run the application with nodemon for development
CMD ["nodemon", "src/index.ts"]