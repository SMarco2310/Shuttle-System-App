# This is a Dockerfile for the Back-End application
FROM node:20-alpine

# This creates a new directory called /app in the container
WORKDIR /app

# This copies the package.json file into the container
COPY package*.json ./
COPY prisma ./prisma/

# This installs the dependencies listed in package.json
RUN npm install

# This copies the rest of the application files into the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (if needed)
# RUN npm run build

# This exposes port 3000 for the application
EXPOSE 3000

# This starts the application using npm start
CMD ["npm", "start"]
