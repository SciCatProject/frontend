FROM node:18-alpine as builder
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

WORKDIR /frontend
COPY package*.json  /frontend/
RUN npm ci
COPY . /frontend/
RUN npx ng build

FROM nginx:1.21-alpine
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /frontend/dist/ /usr/share/nginx/html
COPY scripts/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
