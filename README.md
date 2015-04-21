# League Wins Pool

## Local Development

    $ [Install Docker](https://docs.docker.com/installation/)
    $ boot2docker run (if on OSX)
    $ cd src && docker build -t league-wins-pool . (run anytime there's a change to Dockerfile)
    $ docker run \
      -v ~/path/to/repo/src:/app \
      -p 3000:3000 league-wins-pool test

Open a separate tab

    $ docker ps (look for container id)
    $ docker exec -it <container id> bash
    $ cd ../client && grunt serve

Open a browser to view changes

    $ curl http://$(boot2docker ip):3000
    

## Build for Production

    $ docker-compose up
    $ docker ps (look for port number of new container)
    $ curl http://$(boot2docker ip):<container port>
