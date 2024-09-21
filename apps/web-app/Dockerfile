FROM node:20-alpine as base

WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files
COPY . .

# build the app
RUN npm run build

# release
FROM node:20-alpine as release
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/vite.config.ts ./
COPY --from=base /app/.svelte-kit ./.svelte-kit

EXPOSE 4173

CMD ["npm", "run", "preview", "--host"]
