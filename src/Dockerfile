FROM node:0.12.2

RUN apt-get update
RUN apt-get install ruby-full -y
RUN gem install compass

# Build client-side app within the container so we don't have to include it in our repo
WORKDIR /app
RUN npm install -g nodemon
RUN npm install -g grunt-cli
RUN npm install -g karma-phantomjs-launcher

ADD . /app
WORKDIR /app/client
RUN npm install
RUN grunt --force

WORKDIR /app/server
RUN npm install

EXPOSE 3000

CMD npm start
