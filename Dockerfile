FROM oven/bun:alpine

WORKDIR /app

COPY entrypoint.sh ./
COPY package.json ./
COPY bun.lockb ./
COPY src ./src

RUN bun install

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]

