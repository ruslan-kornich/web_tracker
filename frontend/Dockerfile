# frontend/Dockerfile

# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package.json ./
COPY package-lock.json ./

# Install the npm dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
