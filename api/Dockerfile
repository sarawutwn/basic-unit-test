FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json

RUN bun install

COPY ./src ./src
COPY ./schema ./schema
# COPY .env .env

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/app.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server
COPY --from=build /app/node_modules /app/node_modules

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3050