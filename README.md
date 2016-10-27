# Wins League

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

### Running tests once

```
$ (cd app; meteor test)
```

### Running tests during development

```
$ (cd app; meteor npm run test-watch)
$ (cd app; meteor npm run test-app-watch)
```

### Running tests with code coverage

```
$ (cd app; COVERAGE=1 COVERAGE_VERBOSE=1 COVERAGE_APP_FOLDER=${PWD/#$HOME/~}/ meteor test --driver-package practicalmeteor:mocha)
$ http://localhost:3000
```

In browser console, run `Meteor.sendCoverage(function(stats,err) { console.log(stats,err);});` to capture client coverage.

### Running acceptance tests

In one terminal:
```
$ (cd app; meteor test --full-app --driver-package tmeasday:acceptance-test-driver)
```

In another terminal:
```
$ (cd app; ./tests/acceptance_run)
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
$ (cd app; meteor shell)
```

### View and Edit Client Documents

Open app in the browser and press Control + M. See [Mongol documentation](https://github.com/msavin/Mongol) for more.

### Database Admin

```
$ http://stackoverflow.com/questions/22020580/how-to-connect-mongodb-clients-to-local-meteor-mongodb
```


## Migrations

Migrations are done with [percolate:migrations](https://github.com/percolatestudio/meteor-migrations).


## Deploying to Production

CircleCI automatically does this when tests pass.

If a change to `.deploy/production/mup.js` is needed, make sure to run `gpg -c mup.js` and commit the updated `mup.js.gpg`.
