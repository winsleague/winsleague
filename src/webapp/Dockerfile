FROM leaguewinspool/webapp-base:latest

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
# Everything above this line should be cached in most cases
COPY . /webapp

# Build client-side code
WORKDIR /webapp/client
RUN grunt --force

EXPOSE 3000

WORKDIR /webapp/server
CMD ["npm", "start"]
