dev:
  deno run --allow-net --allow-read --allow-env --watch server.js

run:
  deno run --allow-net --allow-read --allow-env server.js

serve:
  @echo "will run the server in parallel mode"
  deno serve --parallel --allow-net --allow-read --allow-env server.js

compile:
  deno compile --allow-net --allow-env --allow-read --env-file --include unreachable_tiles.json server.js

podman_publish_ghcr:
  podman manifest rm --ignore ghcr.io/simonneutert/unreachable_tiles_map_editor:main
  podman manifest create ghcr.io/simonneutert/unreachable_tiles_map_editor:main
  podman build --platform linux/amd64 --manifest ghcr.io/simonneutert/unreachable_tiles_map_editor:main .
  podman build --platform linux/arm64 --manifest ghcr.io/simonneutert/unreachable_tiles_map_editor:main .
  podman manifest push --all ghcr.io/simonneutert/unreachable_tiles_map_editor:main docker://ghcr.io/simonneutert/unreachable_tiles_map_editor:main

docker_publish_ghcr:
  docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/simonneutert/unreachable_tiles_map_editor:main --push .

lint:
  deno lint --ignore=static

format:
  deno fmt --ignore=static --ignore=*.md
