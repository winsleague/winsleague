FROM leaguewinspool/webapp-base:latest

# Install node packages
COPY package.json /webapp/
COPY npm-shrinkwrap.json /webapp/
WORKDIR /webapp
RUN npm install

# Install bower packages
COPY assets/bower.json /webapp/assets/
WORKDIR /webapp/assets
RUN bower install

# Add app files to container
# Everything above this line should be cached in most cases
COPY . /webapp

EXPOSE 3000

WORKDIR /webapp

CMD ["npm", "start"]
