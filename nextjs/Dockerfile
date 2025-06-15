# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that Next.js will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]