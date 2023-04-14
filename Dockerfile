# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 node:16-alpine

WORKDIR /products-api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "server/index.js"]

EXPOSE 3001