FROM node:0.12.2

# Install dependencies
RUN apt-get update -y
RUN apt-get install ruby-full -y
RUN gem install compass
RUN apt-get install libfontconfig -y # required for PhantomJS (https://github.com/karma-runner/karma-phantomjs-launcher/issues/31)

# Build client-side app within the container so we don't have to include it in our repo
WORKDIR /app
RUN npm install nodemon -g
RUN npm install grunt-cli -g

ADD . /app
WORKDIR /app/client
RUN npm install
RUN grunt --force

WORKDIR /app/server
RUN npm install

EXPOSE 3000

CMD npm start
