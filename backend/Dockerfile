# Use the current Node.js LTS (Long Term Support) release on Alpine Linux.
# Alpine is a minimal Linux distribution that keeps the image size small.
# "lts-alpine" always resolves to the active LTS version, which receives
# long-term security and bug-fix updates.
FROM node:lts-alpine

# Set the working directory inside the container.
# All subsequent commands will run relative to this path.
WORKDIR /app

# Copy only the dependency manifests first.
# Docker caches each layer — by copying these files before the source code,
# the npm install layer is only re-executed when dependencies actually change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy the rest of the backend source code into the container.
COPY . .

# Document that the container listens on port 3335.
EXPOSE 3335

# Start the Node.js server.
CMD ["node", "server.js"]
