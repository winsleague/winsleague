FROM node:0.12.2-slim

# Install dependencies
# TODO: specify versions of these packages so they don't change under us
# This includes PhantomJS dependencies (https://github.com/karma-runner/karma-phantomjs-launcher/issues/31)
RUN apt-get update && apt-get install -y \
    build-essential=11.7 \
    git=1:2.1.4-2.1 \
    ruby-full=1:2.1.5 \
    chrpath=0.16-1 \
    libssl-dev=1.0.1k-3 \
    libxft-dev=2.3.2-1 \
    libfreetype6-dev=2.5.2-3 \
    libfontconfig1-dev=2.11.0-6.3
RUN gem install compass -v 1.0.3 --no-document

# Install global packages
RUN npm install -g \
    grunt-cli@0.1.13 \
    bower@1.3.8 \
    phantomjs@1.9.7-14 \
    nodemon@1.3.7 \
    yo@1.4.6 \
    generator-angular@0.11.1

# Adjust permissions so we can run yo within Docker container (https://github.com/yeoman/yeoman.io/issues/282)
RUN mkdir /root/.config
RUN mkdir /root/.config/configstore
RUN chmod g+rwx /root /root/.config /root/.config/configstore

# Install client-side packages
COPY client/package.json /webapp/client/
COPY client/npm-shrinkwrap.json /webapp/client/
COPY client/bower.json /webapp/client/
WORKDIR /webapp/client
RUN bower install --allow-root # --allow-root allows bower to run as sudo, which is how Docker runs it
RUN npm install

# Install server-side packages
COPY server/package.json /webapp/server/
COPY server/npm-shrinkwrap.json /webapp/server/
WORKDIR /webapp/server
RUN npm install

# Add app files to container
# Everything above this lined should be cached in most cases
COPY . /webapp

# Build client-side code
WORKDIR /webapp/client
RUN grunt --force

EXPOSE 3000

WORKDIR /webapp/server
ENTRYPOINT ["npm"]
CMD ["start"]
