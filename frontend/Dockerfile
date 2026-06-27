# Use the current Node.js LTS (Long Term Support) release on Alpine Linux.
# Alpine is a minimal Linux distribution that keeps the image size small.
# "lts-alpine" always resolves to the active LTS version, which receives
# long-term security and bug-fix updates.
FROM node:lts-alpine AS build

# Set the working directory inside the container.
# All subsequent commands will run relative to this path.
WORKDIR /app

# Copy only the dependency manifests first.
# Docker caches each layer — by copying these files before the source code,
# the npm install layer is only re-executed when dependencies actually change.
COPY package*.json ./

# Install all dependencies, including devDependencies required for the build step.
RUN npm install

# Copy the rest of the source code into the container.
COPY . .

# Declare a build-time argument that can be passed via docker-compose (build.args).
# ARG values are only available during the image build, not at container runtime.
# The default value is used when no argument is supplied.
ARG VITE_API_URL=http://localhost:3335

# Promote the ARG to an ENV so it is available as an environment variable
# when the build command runs below. Vite reads VITE_* variables at build time
# and embeds their values into the compiled static files.
ENV VITE_API_URL=$VITE_API_URL

# Build the React app. Vite compiles all source files into /app/dist.
RUN npm run build

# --- Stage 2: serve the compiled app with Nginx ---
# Nginx is a high-performance web server. We use it to serve the static files
# produced by Vite. Using a separate stage keeps the final image small
# because the Node.js toolchain is not included.
FROM nginx:alpine

# Remove the default Nginx welcome page.
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled output from the build stage into Nginx's document root.
COPY --from=build /app/dist /usr/share/nginx/html

# Document that the container listens on port 80 (standard HTTP).
EXPOSE 80

# Start Nginx in the foreground. "daemon off" prevents Nginx from
# forking into the background, which would cause the container to exit immediately.
CMD ["nginx", "-g", "daemon off;"]
