# Use the official Node.js LTS image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port on which the backend listens (adjust if necessary)
EXPOSE 3000

# Start the backend
CMD ["node", "server.js"]
