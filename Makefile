SERVICE_NAME := collaborative-code-editor-service
LATEST_TAG := latest
MAIN_BRANCH := main

start:
	echo "MAKE Start"
	echo "BUILDPLATFORM: ${BUILDPLATFORM}"
	docker compose version
	docker compose up -d

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