FROM node:14-alpine as builder
LABEL maintainer="gareth.murphy@esss.se"
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
ARG env=dmscdev
WORKDIR /catanie
COPY package*.json  /catanie/
RUN npm ci
COPY . /catanie/
RUN npx ng build --configuration=${env}

FROM nginx:alpine
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /catanie/dist/ /usr/share/nginx/html
COPY scripts/nginx.conf /etc/nginx/nginx.conf
COPY CI/ESS/google43e14584df796f63.html   /usr/share/nginx/html
EXPOSE 80
