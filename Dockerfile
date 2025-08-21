FROM node:22.15.0-alpine AS builder

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /frontend
COPY package*.json /frontend/
RUN npm ci
COPY . /frontend/
RUN npx ng build

FROM docker.io/nginxinc/nginx-unprivileged:1.26.3
USER root
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/dist/browser/ /usr/share/nginx/html/
COPY scripts/nginx.conf /etc/nginx/nginx.conf
USER 101
COPY --from=builder /frontend/dist/ /usr/share/nginx/html/
EXPOSE 8080
