FROM node:20-alpine as base

WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files
COPY . .

# create database file
RUN mkdir -p /app/data && touch /app/data/database.sqlite

RUN npm run build

# release
FROM node:20-alpine as release
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist
COPY --from=base /app/data ./data

ENV ADDRESS=0.0.0.0

EXPOSE 3001

CMD ["npm", "start"]
