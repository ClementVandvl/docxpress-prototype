FROM node:22 AS node_base
FROM ubuntu:latest
COPY --from=node_base / /

LABEL authors="noatrachez"

ENV NODE_ENV production

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY . .

# Setup ubuntu apt
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN npm install -g n
RUN n lts
RUN npm install -g npm-check-updates
RUN ncu -u

# Install Tesseract Ocr
RUN apt-get install tesseract-ocr -y

RUN npm install

EXPOSE 3000

CMD node app.js
