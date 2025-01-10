FROM denoland/deno:distroless

WORKDIR /app

COPY static/ ./static/
COPY data/ ./data/
COPY views/ ./views/
COPY lib/ ./lib/
COPY server.js ./

COPY LICENSE ./

RUN ["deno", "install"]

CMD [ "serve", "--parallel", "--allow-net", "--allow-read", "--allow-env", "--allow-write", "server.js" ]
