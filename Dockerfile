FROM nginx:1.19-alpine

ENV env=development
WORKDIR /usr/src/app

#npm ci
COPY . /usr/src/app
RUN apk update && apk upgrade && \
    apk add --update nodejs npm
RUN npm ci

#nginx config
COPY ./scripts/nginx.conf /etc/nginx/
RUN echo "npx ng build --configuration=\${env} --output-path /usr/share/nginx/html" > /docker-entrypoint.d/npx_ng_build.sh && \
    chmod +x /docker-entrypoint.d/npx_ng_build.sh
