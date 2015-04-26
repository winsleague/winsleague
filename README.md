# League Wins Pool

## Getting Started

1. [Install Docker](https://docs.docker.com/installation/)
2. If on Mac, start Boot2docker

    ```bash
    $ boot2docker up
    ```

3. Create `src/db/secrets.env` from `src/db/secrets.example.env`


## Local Development

    $ cd src
    $ docker-compose up

Open a separate tab

    $ docker exec -it src_webapp_1 bash
    $ cd /webapp/client && grunt serve

Open a browser to view changes

    $ curl http://$(boot2docker ip)
    
    
## Running Database Migrations

Make sure the containers are running first.

    $ docker-compose run webapp /webapp/server/node_modules/.bin/sequelize db:migrate
    

## Rebuilding Docker Images

When changing the webapp-app Dockerfile, rebuild and publish the image by running:

    $ cd src/webapp-base
    $ docker build -t leaguewinspool/webapp-base .
    $ docker push leaguewinspool/webapp-base

When changing any of the other Dockerfiles, rebuild the images by running:

    $ docker-compose build

Now you are ready for development again.


## Build for Production

    $ cd src
    $ docker-compose -f docker-production.yml up 
    $ curl http://$(boot2docker ip)
