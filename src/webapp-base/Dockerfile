# This is the base image for our webapp. It should rarely change.

FROM node:5.0.0-slim

# Install dependencies
# This includes PhantomJS dependencies (https://github.com/karma-runner/karma-phantomjs-launcher/issues/31)
# Python required for npm and npm-gyp
RUN apt-get update && apt-get install -y \
    build-essential=11.7 \
    git=1:2.1.4-2.1 \
    ruby-full=1:2.1.5+deb8u1 \
    chrpath=0.16-1 \
    libssl-dev=1.0.1k-3+deb8u1 \
    libxft-dev=2.3.2-1 \
    libfreetype6-dev=2.5.2-3+deb8u1 \
    libfontconfig1-dev=2.11.0-6.3 \
    python=2.7.9-1
RUN gem install compass -v 1.0.3 --no-document

# Install global packages
RUN npm install -g \
    grunt-cli@0.1.13 \
    bower@1.3.8 \
    yo@1.5.0 \
    generator-karma@1.0.0 \
    generator-angular@0.14.0 \
    nodemon@1.3.7 \
    pm2@0.12.13

# Adjust permissions so we can run yo within Docker container (https://github.com/yeoman/yeoman.io/issues/282)
RUN mkdir /root/.config
RUN mkdir /root/.config/configstore
RUN chmod g+rwx /root /root/.config /root/.config/configstore

