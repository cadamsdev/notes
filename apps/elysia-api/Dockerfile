FROM oven/bun:1 as base

WORKDIR /app

# copy package.json and bun.lockb
COPY package.json bun.lockb* ./

# install dependencies
RUN bun install --frozen-lockfile

# copy the rest of the files
COPY . .

# create database file
RUN mkdir -p /app/data && touch /app/data/database.sqlite

# release
FROM oven/bun:1 as release
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/src ./src
COPY --from=base /app/data ./data

ENV ADDRESS=0.0.0.0

EXPOSE 3001

CMD ["bun", "run", "start"]
