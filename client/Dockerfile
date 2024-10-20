# Stage 1: Build the React app using a Node.js container
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using a lightweight web server (nginx)
FROM nginx:alpine

# Copy the build output to the nginx HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port that NGINX will use
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]