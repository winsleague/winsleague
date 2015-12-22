FROM leaguewinspool/webapp-base:latest

# Install packages
COPY package.json /webapp/
COPY npm-shrinkwrap.json /webapp/
WORKDIR /webapp
RUN npm install

COPY assets/bower.json /webapp/assets/
WORKDIR /webapp/assets
RUN bower install --allow-root # --allow-root allows bower to run as sudo, which is how Docker runs it

# Add app files to container
# Everything above this line should be cached in most cases
COPY . /webapp

EXPOSE 3000

WORKDIR /webapp

CMD ["npm", "start"]
