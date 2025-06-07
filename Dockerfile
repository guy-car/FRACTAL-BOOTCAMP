FROM oven/bun:1

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to start your server
CMD ["npm", "run", "server"]


