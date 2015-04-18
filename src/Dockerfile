FROM node:0.12.2

# Install dependencies
RUN apt-get update -y
RUN apt-get install ruby-full -y
RUN gem install compass -v 1.0.3

# Install PhantomJS dependencies (https://github.com/karma-runner/karma-phantomjs-launcher/issues/31)
# TODO: specify versions of these packages so they don't change under us
RUN apt-get install build-essential chrpath libssl-dev libxft-dev -y
RUN apt-get install libfreetype6 libfreetype6-dev -y
RUN apt-get install libfontconfig libfontconfig1 libfontconfig1-dev  -y

# Install global packages
RUN npm install -g grunt-cli@0.1.13
RUN npm install -g bower@1.3.8
RUN npm install -g phantomjs@1.9.7-14
RUN npm install -g nodemon@1.3.7

# Install client-side packages
ADD client/package.json /app/client/
ADD client/npm-shrinkwrap.json /app/client/
ADD client/bower.json /app/client/
WORKDIR /app/client
RUN bower install --allow-root # --allow-root allows bower to run as sudo, which is how Docker runs it
RUN npm install

# Install server-side packages
ADD server/package.json /app/server/
ADD server/npm-shrinkwrap.json /app/server/
WORKDIR /app/server
RUN npm install

# Add app files to container
# Everything above this lined should be cached in most cases
ADD . /app

# Build client-side code
WORKDIR /app/client
RUN grunt --force

EXPOSE 3000

WORKDIR /app/server
CMD npm start
