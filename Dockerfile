# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all other project files
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine
WORKDIR /app

# Install 'serve', a simple static HTTP server
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/build ./build

# The application defaults to port 3000
EXPOSE 3000

# Start the application using serve
CMD ["serve", "-s", "build", "-l", "3000"]
