FROM nginx 

ARG env=development 
# RUN ./node_modules/@angular/cli/bin/ng build --prod
COPY scripts/nginx.conf /etc/nginx/nginx.conf
COPY dist/${env} /usr/share/nginx/html  

EXPOSE 80
