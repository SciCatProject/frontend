FROM nginx:1.19-alpine

ENV env=production
WORKDIR /catanie

#npm ci
COPY . /catanie
RUN apk -v update && apk upgrade -v && \
    apk -v add --update nodejs && apk -v add --update npm
RUN npm ci --only=prod

#nginx config
COPY ./scripts/nginx.conf /etc/nginx/
RUN echo "npx ng build --configuration=\${env} --output-path /usr/share/nginx/html" > /docker-entrypoint.d/npx_ng_build.sh && \
    chmod +x /docker-entrypoint.d/npx_ng_build.sh
