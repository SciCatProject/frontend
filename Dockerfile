FROM node:16-alpine AS builder

WORKDIR /catanie
COPY package*.json /catanie/
RUN npm ci
COPY . /catanie/
RUN npx ng build

FROM nginx:1.12-alpine
RUN rm -rf /usr/share/nginx/html*
COPY --from=builder /catanie/dist/ /usr/share/nginx/html/
COPY scripts/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
