FROM node:9.3.0-slim

WORKDIR /usr/local/src
ADD . /usr/local/src

RUN apt-get update \
  && apt-get install -y git \
  && yarn --proxy ${http_proxy} --https-proxy ${https_proxy} install \
  && yarn run build

ENTRYPOINT ["node"]
CMD ["lib/controllers/index.js"]
