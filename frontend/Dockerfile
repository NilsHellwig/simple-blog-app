# Step 1: Node image as build environment
FROM node:23-alpine AS build

# Working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (for faster cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React app with Vite
RUN npm run build

# Step 2: Nginx as web server for the built app
FROM nginx:1.27.5-alpine

# Remove default Nginx configuration
RUN rm -rf /usr/share/nginx/html/*

# Copy built Vite output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
