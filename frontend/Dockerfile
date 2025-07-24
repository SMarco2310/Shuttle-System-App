# This is a Dockerfile for the Front-End application
FROM node:22

# This creates a new directory called /app in the container
WORKDIR /app

# This copies the package.json file to the container (List of the dependencies)
COPY package*.json ./

# This installs the dependencies listed in package.json in the container
RUN npm install

# This copies the rest of the application files to the container
COPY . .

# This builds the application using npm
RUN npm run build

# This exposes port 5173 for the application
EXPOSE 5173

# This starts the application using npm
CMD ["npm", "start"]
