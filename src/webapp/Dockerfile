FROM node:0.12.2

# Install dependencies
# TODO: specify versions of these packages so they don't change under us
# This includes PhantomJS dependencies (https://github.com/karma-runner/karma-phantomjs-launcher/issues/31)
RUN apt-get update && apt-get install -y \
    ruby-full \
    build-essential \
    chrpath \
    libssl-dev \
    libxft-dev \
    libfreetype6 \
    libfreetype6-dev \
    libfontconfig \
    libfontconfig1 \
    libfontconfig1-dev
RUN gem install compass -v 1.0.3

# Install global packages
RUN npm install -g grunt-cli@0.1.13
RUN npm install -g bower@1.3.8
RUN npm install -g phantomjs@1.9.7-14
RUN npm install -g nodemon@1.3.7

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
