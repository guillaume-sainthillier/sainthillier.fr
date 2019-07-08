FROM node:8-slim as builder

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    graphicsmagick \
    imagemagick

ADD package.json yarn.lock gulpfile.js ./
ADD assets ./assets
ADD required ./required
ADD templates ./templates

RUN ls -alh .
RUN mkdir -p public && \
	npm install -g yarn gulp && \
	NODE_ENV=development yarn install && \
	gulp build

FROM guystlr/php-apache:7.2

# Apache conf
COPY docker/app.conf /etc/apache2/sites-available/000-default.conf

COPY . /app
COPY --from=builder /app/public /app/public/
RUN composer install -o --no-dev && \
	mkdir cache && \
	chown www-data:www-data cache
