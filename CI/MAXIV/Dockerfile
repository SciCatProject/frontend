FROM node:14-alpine as builder
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
ARG env=maxiv-prod
WORKDIR /frontend
COPY package*.json  /frontend/
RUN npm ci
COPY . /frontend/
# Site image needs to be copied to assets before building
COPY CI/MAXIV/maxiv-site.png /frontend/src/assets/images/site.png
COPY CI/MAXIV/maxiv-logo.png /frontend/src/assets/images/site-logo.png
COPY CI/MAXIV/scicat-logo.png /frontend/src/assets/images/scicat-logo-white.png
COPY CI/MAXIV/maxiv-theme.scss src/styles.scss
COPY CI/MAXIV/index.html /frontend/index.html
# Google fonts (Store Google fonts locally since blue network can't connect to internet)
COPY CI/MAXIV/google-fonts/css /frontend/src/assets/css
COPY CI/MAXIV/google-fonts/fonts /frontend/src/assets/fonts
RUN npx ng build --configuration=${env}

FROM nginx:alpine
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/dist/ /usr/share/nginx/html
COPY scripts/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
