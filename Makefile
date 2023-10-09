ping:
	curl http://localhost:8080/ping

restart:
	docker-compose up --build --force-recreate --no-deps -d

test:
	curl -X POST -d '{"clicks":5,"length":5,"width":5}' http://localhost:8080/blackWhiteTile

psql:
	docker exec -it superbraingamehub_postgres_1 psql -U postgres