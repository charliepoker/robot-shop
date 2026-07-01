#
# Build the app
#
FROM php:8.2-apache AS build

RUN apt-get update && apt-get install -yqq --no-install-recommends unzip libzip-dev \
    && docker-php-ext-install pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY html/ /var/www/html

RUN composer install --no-dev --optimize-autoloader --no-interaction

#
# Runtime
#
FROM php:8.2-apache

RUN apt-get update && apt-get install -yqq --no-install-recommends libzip-dev \
    && docker-php-ext-install pdo_mysql opcache zip \
    && apt-get purge -yqq --auto-remove libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Enable AutoProfile for PHP which is currently opt-in beta
RUN echo "instana.enable_auto_profile=1" > "/usr/local/etc/php/conf.d/zzz-instana-extras.ini"

# relax permissions on status
COPY status.conf /etc/apache2/mods-available/status.conf
# Enable Apache mod_rewrite and status
RUN a2enmod rewrite && a2enmod status

WORKDIR /var/www/html

COPY --from=build /var/www/html /var/www/html

# Symfony needs write access to var/cache and var/log; www-data is the
# user Apache's worker processes run as, so owner perms are enough -
# no need for the previous chmod 777 free-for-all.
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 750 /var/www/html
