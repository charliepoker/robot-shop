FROM node:22-alpine AS build

WORKDIR /opt/server

COPY package.json package-lock.json /opt/server/

RUN npm ci --omit=dev

COPY server.js /opt/server/

FROM node:22-alpine

RUN apk add --no-cache curl

ENV INSTANA_AUTO_PROFILE=true \
    NODE_ENV=production

EXPOSE 8080

WORKDIR /opt/server

COPY --from=build /opt/server /opt/server

USER node

CMD ["node", "server.js"]
