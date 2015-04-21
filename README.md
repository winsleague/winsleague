# League Wins Pool

## Getting Started

    $ [Install Docker](https://docs.docker.com/installation/)
    $ boot2docker up (if on OSX)


## Local Development

    $ cd src
    $ docker-compose build webapp
    $ docker run \
        -v ~/path/to/repo/src/webapp:/webapp \
        -p 3000:3000 \
        src_webapp \
        test

Open a separate tab

    $ docker ps (look for container id)
    $ docker exec -it <container id> bash
    $ cd /webapp/client
    $ grunt serve

Open a browser to view changes

    $ curl http://$(boot2docker ip):3000
    

## Build for Production

    $ docker-compose up
    $ curl http://$(boot2docker ip)
