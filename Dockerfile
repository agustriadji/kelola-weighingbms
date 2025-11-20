# Gunakan base image Node.js
FROM node:lts-alpine3.21

# Set working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Salin seluruh source code
COPY . .

# Build Next.js app
RUN npm run build

# Expose port Next.js
EXPOSE 3000

# Jalankan Next.js dev server
CMD ["npm", "run", "dev"]
