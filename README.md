# League Wins Pool

## Getting Started

1. [Install Meteor](https://www.meteor.com/install)
2. (optional) [Install ESLint packages](https://www.npmjs.com/package/eslint-config-airbnb)


## Developing Locally

1. Launch the development environment:

    ```bash
    $ (cd app; meteor)
    ```

2. Open a browser to view the app:

    ```bash
    $ http://localhost:3000
    ```

3. Meteor automatically watches for changes and hot reloads the app.


## Testing

### Running tests

```
$ (cd app; meteor run --test)
```

### Running Meteor without tests running automatically

```
$ (cd app; VELOCITY=0 meteor run)
```

### Running tests in debug mode

```
$ (cd app; DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 VELOCITY_DEBUG_MIRROR=1 meteor)
```

### Viewing test logs

These are best run in a separate Terminal window while Meteor is running.

```
$ (cd app; tail -f .meteor/local/log/jasmine-server-integration.log)
$ (cd app; tail -f .meteor/local/log/jasmine-client-integration.log)
```

### Running [Flow check](http://flowtype.org)

```
$ flow check --all
```

Note that Flow doesn't yet support TypeScript declarations so it will complain about a bunch of Meteor global variables.

### Other tips:

1. Change `describe()` to `fdescribe()` or `it()` to `fit()` to only run specific specs.
2. To disable specific testing modes, use these environment variables:

    ```bash
    JASMINE_SERVER_UNIT=0
    JASMINE_SERVER_INTEGRATION=0
    JASMINE_CLIENT_UNIT=0
    JASMINE_CLIENT_INTEGRATION=0
    ```


## Debugging

### Interactive Development Console

```
$ (cd app; meteor shell)
```

### View and Edit Client Documents

Open app in the browser and press Control + M. See [Mongol documentation](https://github.com/msavin/Mongol) for more.

### Database Admin

```
$ http://stackoverflow.com/questions/22020580/how-to-connect-mongodb-clients-to-local-meteor-mongodb
```


## Deploying to Production

CircleCI automatically does this when tests pass.

If a change to `config/production/mup.json` is needed, make sure to run `gpg -c mup.json` and commit the updated `mup.json.gpg`.
