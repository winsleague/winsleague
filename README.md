# League Wins Pool

## Getting Started

    $ cd src/client
    $ npm install
    $ bower install
    $ gem install compass
    
    $ cd ../server
    $ npm install

In the client folder command line tab do a `$ grunt serve` and let the thing fire up on `localhost:9000` in your web browser. Close that web browser tab, you don't need it.

In the server folder command line tab do a `$ npm test` and your express server will begin running on `localhost:3000`.

## Build for Production

When you want to build things into production mode you'd shut both your grunt server and your express server down (so a ctrl+c in your client command line tab and your server command line tab). Next, in your client tab, run

    $ grunt --force
    
And Yeoman will optimize/jshint/minify your client side code, CSS, images, etc, and put the fresh version in your `server/dist` directory. To test it out go to your server tab and run

    $ npm start
    
And your production ready version will fire up on `localhost:3000`! After doing these steps, your server folder is what you'd deploy to your hosting service of choice.

## Deploying to Docker

    $ boot2docker run (if on OSX)
    $ cd src
    $ docker build -t league-wins-pool .
    $ docker run -d -P league-wins-pool
    $ docker ps (look for port number of new container)
    $ curl http://$(boot2docker ip):<container port>
