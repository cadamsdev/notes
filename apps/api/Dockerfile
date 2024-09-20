FROM node:20-alpine as base

WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files
COPY . .

# create .env file
RUN mv .env.example .env

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

EXPOSE 3001

CMD ["npm", "start"]
