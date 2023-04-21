FROM node:19-alpine3.16
RUN npm install -g pnpm
EXPOSE 3000
WORKDIR /app
COPY entry.sh /tmp/
RUN chmod +x /tmp/entry.sh