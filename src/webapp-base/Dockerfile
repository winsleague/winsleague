# This is the base image for our webapp. It should rarely change.

FROM node:4.2.2-slim

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
    python=2.7.9-1 \
 && apt-get autoremove -y \
 && apt-get clean all \
 && rm -rf /var/lib/apt/lists/*
RUN gem install compass -v 1.0.3 --no-document

# Install PhantomJS
# Do this here to make sure we install the Linux flavor
RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2 \
 && tar xvjf phantomjs-1.9.8-linux-x86_64.tar.bz2 \
 && mv phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/local/bin/ \
 && rm -f phantomjs-1.9.8-linux-x86_64.tar.bz2 && rm -rf phantomjs-1.9.8-linux-x86_64/bin/phantomjs

# Upgrade npm
RUN npm install -g npm@3.5.2

# Install global packages
RUN npm install -g \
    grunt-cli@0.1.13 \
    bower@1.7.1 \
    yo@1.5.0 \
    generator-karma@1.0.0 \
    generator-angular@0.15.1 \
    pm2@0.12.13

# Adjust permissions so we can run yo within Docker container (https://github.com/yeoman/yeoman.io/issues/282)
RUN mkdir /root/.config
RUN mkdir /root/.config/configstore
RUN chmod g+rwx /root /root/.config /root/.config/configstore

