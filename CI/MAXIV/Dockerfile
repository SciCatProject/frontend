FROM node:14-alpine as builder
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
ARG env=maxiv-prod
WORKDIR /catanie
COPY package*.json  /catanie/
RUN npm ci
COPY . /catanie/
# Site image needs to be copied to assets before building
COPY CI/MAXIV/maxiv-site.png /catanie/src/assets/images/site.png
COPY CI/MAXIV/maxiv-theme.scss src/theme.scss
RUN npx ng build --configuration=${env}

FROM nginx:alpine
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /catanie/dist/ /usr/share/nginx/html
COPY scripts/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
