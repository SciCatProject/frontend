FROM node:18-alpine AS builder

# Install Python and build dependencies for node-gyp
RUN apk add --no-cache python3 py3-pip make g++ \
    && pip3 install --upgrade pip \
    && apk add --no-cache py3-setuptools py3-wheel py3-distutils

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
