# League Wins Pool

## Getting Started

1. [Install Node](https://nodejs.org/download/)
2. [Install Docker](https://docs.docker.com/installation/)
3. If on Mac, start Boot2docker

    ```bash
    $ boot2docker up
    ```

4. Create secrets file and add passwords
 
    ```bash
    $ cp src/db/secrets.example.env src/db/secrets.env
    $ vim src/db/secrets.env
    ```
    
5. Install package dependencies

    ```bash
    $ (cd scripts; ./install-packages)
    ```

6. Install Git hooks so that dependencies are automatically installed when switching or merging branches

    ```bash
    $ (cd scripts; ./install-git-hooks)
    ```


## Developing Locally

Launch the entire development environment:

    $ (cd src; docker-compose up)

This links your local `src/webapp` folder to the container so that server-side changes automatically reload the server. 

To also monitor client-side changes, open a separate terminal tab and run:

    $ docker exec -it src_webapp_1 bash
    $ (cd /webapp/client; grunt serve)

Open a browser to view changes:

    $ curl http://$(boot2docker ip)
    
    
## Running Database Migrations

Make sure the containers are running first.

    $ docker-compose run webapp /webapp/server/node_modules/.bin/sequelize db:migrate
    
Sequelize automatically syncs the database when the webapp starts. However, this only creates and drops tables -- it doesn't run pending migrations. That is currently done manually but we should figure out how to automate them as part of the deploy process. 
    

## Adding or Removing Node Packages

When changing either the client or server's package.json, run `npm shrinkwrap` in `src/webapp/client` and `src/webapp/server` to update the `npm-shrinkwrap.json` file. This ensures everyone is using the exact same package versions.


## Rebuilding Docker Images

The `webapp-base` image (`src/webapp-base/Dockerfile`) is used to manage core dependencies such as node and its global packages. Although changes should be rare, when doing so, rebuild and publish the image by running:

    $ cd src/webapp-base
    $ docker build -t leaguewinspool/webapp-base .
    $ docker push leaguewinspool/webapp-base

When changing any of the other Dockerfiles, rebuild the images by running:

    $ docker-compose build

Now you are ready for development again.


## Building for Production

To effectively run a staging environment on your machine, run:

    $ (cd src; docker-compose -f docker-production.yml up) 
    $ curl http://$(boot2docker ip)
    
This difference is `docker-production.yml` won't link your local code to the container.

Actually deploying to production is done automatically when code is merged to `master`.
