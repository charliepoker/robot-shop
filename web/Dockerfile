FROM alpine:3.20 AS build
ARG KEY

WORKDIR /instana

RUN apk add --update --no-cache wget unzip

ENV ARTI_PATH='artifact-public.instana.io/artifactory/shared/com/instana/nginx_tracing/'

RUN if [ -n "$KEY" ]; then \
    sensor_version=$(wget -O- "https://_:${KEY}@${ARTI_PATH}" 2>&1 | \
      egrep -o "href=\"([0-9]+\.){2}[0-9]+/" | cut -d'"' -f2 | sort -V | tail -n1 | tr -d /); \
    echo "Downloading sensor version ${sensor_version} for Nginx version 1.21.6" ; \
    $(wget -O instana.zip \
      "https://_:${KEY}@${ARTI_PATH}/${sensor_version}/linux-amd64-glibc-nginx-1.21.6.zip") && \
    unzip instana.zip && \
    mv glibc-libinstana_sensor.so libinstana_sensor.so && \
    mv glibc-nginx-1.21.6-ngx_http_ot_module.so ngx_http_opentracing_module.so; \
    else echo "KEY not provided. Not adding tracing"; \
    touch dummy.so; \
    fi


FROM nginx:1.27-alpine

RUN apk add --no-cache bash

EXPOSE 8080

ENV CATALOGUE_HOST=catalogue \
    USER_HOST=user \
    CART_HOST=cart \
    SHIPPING_HOST=shipping \
    PAYMENT_HOST=payment \
    RATINGS_HOST=ratings \
    INSTANA_SERVICE_NAME=nginx-web

# Instana tracing
# NOTE: the Instana nginx sensor above is only built for nginx 1.21.6 on
# glibc, so INSTANA_AGENT_KEY-based tracing is not functional on this image.
# It's superseded by OpenTelemetry instrumentation in a later phase.
COPY --from=build /instana/*.so /tmp/

COPY entrypoint.sh /root/
ENTRYPOINT ["/root/entrypoint.sh"]

COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY static /usr/share/nginx/html
