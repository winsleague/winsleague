Package.describe({
  name: 'testing',
  version: '0.0.0',
  summary: 'Tools that help us testing the app',
  documentation: 'README.md',
  // Only available in development mode! (for security)
  debugOnly: true,
});

Package.onUse(function (api) {
  api.use([
    'ecmascript',
    'es5-shim',
    'promise',
    'underscore',
    'mongo',
    'infinitedg:winston',
    'stevezhu:lodash@3.10.1',
  ], 'server');
  api.addFiles([
    'lib/log.js',
    'league_fixtures.js',
    'pool_fixtures.js',
    'pool_team_fixtures.js',
    'reset.js',
    'user_fixtures.js',
  ], 'server');
});
