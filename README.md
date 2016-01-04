# League Wins Pool

## Getting Started

1. [Install Meteor](https://www.meteor.com/install)
2. Install Git hooks so that dependencies are automatically installed when switching or merging branches

    ```bash
    $ (cd scripts; ./install-git-hooks)
    ```


## Developing Locally

1. Launch the development environment:

    ```bash
    $ (cd app; meteor)
    ```

2. Open a browser to view changes:

    ```bash
    $ curl http://localhost:3000)
    ```

3. Meteor automatically watches for changes and hot reloads the app.


## Running Tests

    ```bash
    $ (cd app; meteor run --test)
    ```


## Running Meteor without tests running automatically

    ```bash
    $ (cd app; VELOCITY=0 meteor run)
    ```
    

## Interactive Development Console

    ```bash
    $ (cd app; meteor shell)
    ```


## Deploying to Production

    ```bash
    $ (cd app; meteor deploy)
    ```
