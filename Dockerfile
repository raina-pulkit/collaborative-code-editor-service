# BUILDPLATFORM is automatically set by Docker BuildKit
# You can also manually specify it when building:
# docker build --build-arg BUILDPLATFORM=linux/amd64 -t collaborative-code-editor-service .
FROM --platform=$BUILDPLATFORM node:23-alpine3.20 AS install

WORKDIR /usr/src/app
ENV NODE_ENV=development
RUN apk add --no-cache g++ make python3
ADD package.json package-lock.json .npmrc* /usr/src/app/
RUN npm install

FROM install AS build

COPY . .
RUN npm run build

FROM install AS development

WORKDIR /usr/src/app

ENV PORT=3000
COPY . .
RUN npm run build

EXPOSE $PORT

CMD ["/bin/sh", "-c", "node dist/main"]

FROM node:23-alpine3.20 AS production

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY package.json package-lock.json ./

RUN npm prune --production

ARG COMMIT_SHA
ENV SENTRY_RELEASE=$COMMIT_SHA

EXPOSE $PORT

CMD ["/bin/sh", "-c", "node dist/main"]
