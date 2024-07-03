FROM node:22.4.0-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# run app
EXPOSE 1234
CMD ["npm", "run", "dev", "--", "--port=1234", "--host=0.0.0.0"]
