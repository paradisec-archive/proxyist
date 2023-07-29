FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile \
  && yarn cache clean

EXPOSE 3000

ENV PROXYIST_ADAPTER_NAME=@paradisec/proxyist-adapter-local
ENV PROXYIST_ADAPTER_CONFIG=/usr/src/app/proxyist.config.js

LABEL org.opencontainers.image.source https://github.com/paradisec-archive/proxyist

# CMD [ "node", "node_modules/.bin/proxyist" ]
CMD [ "node", "node_modules/@paradisec/proxyist/dist/index.js" ]
