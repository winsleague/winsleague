FROM leaguewinspool/webapp-base:latest

# Install node packages
COPY package.json /webapp/
COPY npm-shrinkwrap.json /webapp/
WORKDIR /webapp
RUN npm install

# Install bower packages
COPY assets/bower.json /webapp/assets/
WORKDIR /webapp/assets
RUN bower install --allow-root # Not sure why allow-root is needed when we set USER to node in webapp-base, but if we remove it, the install fails

# Add app files to container
# Everything above this line should be cached in most cases
COPY . /webapp

EXPOSE 3000

WORKDIR /webapp

CMD ["npm", "start"]
