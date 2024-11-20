FROM oven/bun

WORKDIR /app

COPY . /app

RUN bun install --production

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]

