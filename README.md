# League Wins Pool

## Getting Started

1. [Install Node 4.2.2](https://nodejs.org/download/)
2. [Install Docker 1.6+](https://docs.docker.com/installation/)
3. If on Mac, install [VirtualBox](https://www.virtualbox.org) and [Dingy](https://github.com/codekitchen/dinghy)
4. [Install Docker Compose 1.3+](https://docs.docker.com/compose/install/)
5. Install package dependencies for development

    ```bash
    $ (cd scripts; ./install-packages)
    ```

6. Install Git hooks so that dependencies are automatically installed when switching or merging branches

    ```bash
    $ (cd scripts; ./install-git-hooks)
    ```

7. Create secrets file and add passwords
    
    ```bash
    $ cp src/db/secrets.example.env src/db/secrets.env
    $ vim src/db/secrets.env
    ```

8. If on Mac, create a VM with Dinghy

    ```bash
    $ dinghy create --provider virtualbox
    $ dinghy status
    ```


## Developing Locally

1. Launch the entire development environment:

    ```bash
    $ (cd src; docker-compose up)
    ```

    This links your local `src/webapp` folder to the container so that changes automatically reload the server.

2. Run any outstanding database migrations:

    ```bash
    $ (cd src; docker-compose run webapp grunt db:migrate:up)
    ```

3. Open a browser to view changes:

    ```bash
    $ curl http://$(dinghy ip)
    ```
    

## Running Tests

    ```bash
    $ (cd src; docker-compose run webapp npm test)
    ```

    
## Interactive Development Console

    ```bash
    $ (cd src; docker-compose run webapp node_modules/.bin/sails console)
    ```


## Running Database Migrations

    ```bash
    $ (cd src; docker-compose run webapp grunt db:migrate)
    ```

Documentation on writing migrations can be found [here](http://umigrate.readthedocs.org/projects/db-migrate/en/latest/)
    

## Adding or Removing Node Packages

After updating `package.json`:

    $ (cd src; docker-compose run webapp npm install <package-name> --save)
    $ (cd src; docker-compose run webapp npm shrinkwrap --dev) # install packages in container
    $ (cd src; docker-compose up) # restart webapp


## Rebuilding Docker Images

The `webapp-base` image (`src/webapp-base/Dockerfile`) is used to manage core dependencies such as node and its global packages. Although changes should be rare, when doing so, rebuild and publish the image by running:

    $ cd src/webapp-base
    $ docker build -t leaguewinspool/webapp-base .
    $ docker push leaguewinspool/webapp-base

When changing any of the other Dockerfiles, rebuild the images by running:

    $ (cd src; docker-compose build)

Now you are ready for development again.


## Debugging commands

Add `-e LOG_LEVEL=debug` to run command:

    $ (cd src; docker-compose run -e LOG_LEVEL=debug webapp <command>)


## Running a Staging Environment

These are the same commands the integration tests on CircleCI run:

    $ (cd src; docker-compose -f docker-production.yml up)
    $ (cd src; docker-compose -f docker-production.yml run webapp npm test)
    $ curl http://$(dinghy ip)

The difference is `docker-production.yml` won't sync your local code with the container.


## Deploying to Production

When code is merged into `master`, CircleCI runs the integration tests. If they pass, CircleCI notifies DockerHub to rebuild the `webapp` container. Once the build finishes, DockerHub notifies Tutum to swap the old container with the new `webapp` image.

The other containers are not deployed automatically because they rarely change. If they need updating:

1. On CircleCI, [clear the cache](https://circleci.com/docs/how-cache-works) and rerun the tests
2. On DockerHub, manually start a build on the updated container
3. On Tutum, redeploy the container
