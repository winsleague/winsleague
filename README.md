# Wins League

[![Greenkeeper badge](https://badges.greenkeeper.io/winsleague/winsleague.svg)](https://greenkeeper.io/)

## Getting Started

1. [Install Meteor](https://www.meteor.com/install)
2. (optional) [Install ESLint packages](https://www.npmjs.com/package/eslint-config-airbnb)


## Developing Locally

1. Launch the development environment:

    ```bash
    $ meteor
    ```

2. Open a browser to view the app:

    ```bash
    $ http://localhost:3000
    ```

3. Meteor automatically watches for changes and hot reloads the app.


### Updating Node packages

```bash
$ yarn
```


## Testing

### Running tests once

```
$ meteor npm run test
$ meteor npm run test-app
```

### Running tests during development

```
$ meteor npm run test-watch
$ meteor npm run test-app-watch
```

### Running acceptance tests

In one terminal:
```
$ meteor test --full-app --driver-package tmeasday:acceptance-test-driver
```

In another terminal:
```
$ ./tests/acceptance_run
```

We run these in two separate terminals so the acceptance tests don't wipe out the dev database.

### Running [Flow check](http://flowtype.org)

```
$ flow check --all
```

Note that Flow doesn't yet support TypeScript declarations so it will complain about a bunch of Meteor global variables.

### Other tips:

1. Change `describe()` to `fdescribe()` or `it()` to `fit()` to only run specific specs.


## Debugging

### Interactive Development Console

```
$ meteor shell
```

### View and Edit Client Documents

Open app in the browser and press Control + M. See [Mongol documentation](https://github.com/msavin/Mongol) for more.

### Database Admin

```
$ http://stackoverflow.com/questions/22020580/how-to-connect-mongodb-clients-to-local-meteor-mongodb
```

### Bundle Visualizing

```
$ meteor --extra-packages bundle-visualizer --production
```


## Migrations

Migrations are done with [percolate:migrations](https://github.com/percolatestudio/meteor-migrations).


## Deploying to Production

CircleCI automatically does this when tests pass.

If a change to `.deploy/production/mup.js` is needed, make sure to run `gpg -c mup.js` and commit the updated `mup.js.gpg`.
