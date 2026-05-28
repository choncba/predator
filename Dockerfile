FROM node:18-slim AS builder

RUN mkdir -p /usr/ui

COPY /ui /usr/ui

WORKDIR /usr/ui

RUN npm ci --silent

ENV NODE_ENV=production
ARG BUCKET_PATH
ARG PREDATOR_DOCS_URL

RUN VERSION=$(node -p -e "require('./package.json').version") && \
    BUCKET_PATH=$BUCKET_PATH PREDATOR_DOCS_URL=$PREDATOR_DOCS_URL VERSION=$VERSION npm run build

FROM node:18-slim AS production

RUN mkdir -p /usr/src

WORKDIR /usr

COPY package*.json /usr/
RUN npm ci --omit=dev --silent

COPY /src /usr/src
COPY /docs /usr/docs
COPY --from=builder /usr/ui/dist /usr/ui/dist

CMD ["node", "--max_old_space_size=512", "./src/server.js"]
