# --- STAGE 1: Build the application ---
FROM node:20-slim AS builder

# Set working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json (or yarn.lock)
# This step is cached if package files haven't changed, speeding up subsequent builds
COPY package.json package.json
# Your package.json indicates 'type: module', so ensure npm can handle it if a lock file is present.
# Since no lock file was provided, we skip copying it.

# Install dependencies
# The original project uses 'prisma', so we run `prisma generate` here.
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client for the final stage
RUN npx prisma generate

# --- STAGE 2: Create the final production image ---
FROM node:20-slim AS production

# Set working directory
WORKDIR /backend

# The app runs on port 3000 as defined in your server.js
EXPOSE 3000

# Copy only necessary files from the builder stage
# Copy the node_modules, generated Prisma client, and source code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./.prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js .
COPY --from=builder /app/package.json .
COPY --from=builder /app/.env . 
# WARNING: In production, environment variables should be set in Render, not copied via

# Set the command to run the application
# Your package.json defines a "start" script as "node ./server.js"
CMD [ "npm", "start" ]