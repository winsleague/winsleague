FROM node:0.12

WORKDIR /app
RUN npm install -g nodemon
ADD package.json /app/
RUN npm install
ADD . /app

EXPOSE 3000

CMD npm start
