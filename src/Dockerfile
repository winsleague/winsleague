FROM node:0.12.2

WORKDIR /app
RUN npm install -g nodemon

ADD . /app
WORKDIR /app/client
RUN npm install
RUN grunt --force

WORKDIR /app/server
RUN npm install

EXPOSE 3000

CMD npm start
