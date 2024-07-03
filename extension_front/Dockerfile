FROM node:latest

WORKDIR /react-project

COPY public ./public/
COPY src ./src/
COPY package.json ./package.json

RUN npm install

CMD ["npm", "start"]

EXPOSE 8080
