FROM node:12-slim as builder

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -qy \
    dh-autoreconf \
    graphicsmagick \
    imagemagick

ADD package.json yarn.lock gulpfile.js ./
ADD assets ./assets
ADD required ./required
ADD templates ./templates

RUN mkdir -p public && \
	npm install -g gulp && \
	NODE_ENV=development yarn install && \
	gulp build

FROM silarhi/php-apache:7.4

ARG BUILD_DATE=`date`
ENV BUILD_DATE=${BUILD_DATE}

# Apache conf
COPY docker/app.conf /etc/apache2/sites-available/000-default.conf

COPY . /app
COPY --from=builder /app/public /app/public/
RUN composer install --optimize-autoloader --classmap-authoritative --no-interaction --no-ansi --no-dev && \
	mkdir cache && \
	chown www-data:www-data cache
