FROM node:18-alpine AS builder

WORKDIR /frontend
COPY package*.json /frontend/
RUN npm ci
COPY . /frontend/
RUN npx ng build

FROM nginx:1.21-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/dist/ /usr/share/nginx/html/
COPY scripts/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
