FROM node:20-alpine

WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files
COPY . .

# build the app
RUN npm run build

# expose the port
EXPOSE 4173

CMD ["npm", "run", "preview", "--host"]
