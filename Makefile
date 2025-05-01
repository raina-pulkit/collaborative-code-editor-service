SERVICE_NAME := collaborative-code-editor-service
LATEST_TAG := latest
MAIN_BRANCH := main

start:
	echo "MAKE Start"
	echo "BUILDPLATFORM: ${BUILDPLATFORM}"
	docker compose version
	docker compose up -d
	make db-seed-questions

logs:
	docker compose logs -f ${SERVICE_NAME}

stop:
	docker compose stop

build:
	docker compose build

clean:
	docker compose down --remove-orphans --rmi local
	rm -rf ./tmp

restart:
	docker compose up -d --build

generate-jwt:
	ts-node bin/create-valid-jwt.ts

generate-api-spec:
	curl -s http://localhost:3030/api-json | jq . > swagger.json

db-seed-questions:
	docker compose exec ${SERVICE_NAME} npm run db:seed:fake-questions

clean-db:
	docker container stop collaborative-code-editor-service-postgres
	docker container rm collaborative-code-editor-service-postgres