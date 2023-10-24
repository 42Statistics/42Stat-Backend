FROM node:18
RUN npm install -g pnpm@latest-8
EXPOSE 4000
WORKDIR /app
