# SuperBrainGameHub


## Restart docker compose
docker-compose up -d --build --force-recreate --no-deps

docker-compose up -d --build superbrain-gamehub-go

## Test Commands
curl http://localhost:8080/ping
curl -X POST -d '{"clicks":5,"length":5,"width":5}' http://localhost:8080/blackWhiteTile