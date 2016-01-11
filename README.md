# League Wins Pool

## Getting Started

1. [Install Meteor](https://www.meteor.com/install)


## Developing Locally

1. Launch the development environment:

    ```bash
    $ (cd app; meteor)
    ```

2. Open a browser to view changes:

    ```bash
    $ http://localhost:3000
    ```

3. Meteor automatically watches for changes and hot reloads the app.


## Testing

    ### Running tests

    ```bash
    $ (cd app; meteor run --test)
    ```

    ### Running Meteor without tests running automatically

    ```bash
    $ (cd app; VELOCITY=0 meteor run)
    ```

    ### Running tests in debug mode
    ```bash
    $ (cd app; DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 VELOCITY_DEBUG_MIRROR=1 meteor)
    ```

    ### Viewing test logs

    ```bash
    $ (cd app; tail -f .meteor/local/log/jasmine-server-integration.log)
    $ (cd app; tail -f .meteor/local/log/jasmine-client-integration.log)
    ```


## Debugging

    ### Interactive Development Console

    ```bash
    $ (cd app; meteor shell)
    ```

    ### Database Admin

    ```bash
    $ http://localhost:3000/admin
    ```


## Deploying to Production

    ```bash
    $ (cd app; meteor deploy)
    ```
