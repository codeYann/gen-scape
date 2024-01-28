FROM node:20.11-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app

# Copying package.json to working directory
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying source files
COPY . .

# Exposing port 3000
EXPOSE 3000

# Building app
RUN npm run build

# Running the app
CMD ["node", "./dist/app.js"]