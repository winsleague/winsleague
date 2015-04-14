FROM node:0.12.2

WORKDIR /app
RUN npm install -g nodemon
ADD package.json /app/ # is this needed if we're adding the whole app folder below?
RUN npm install
ADD . /app

WORKDIR /app/src/client
RUN npm install
RUN grunt --force

EXPOSE 3000

WORKDIR /app
CMD npm start
