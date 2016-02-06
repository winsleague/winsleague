Modules.server.loggly = {
  init() {
    if (! Modules.server.loggly.token()) {
      log.warn('LOGGLY_TOKEN not found!');
      return;
    }

    const options = {
      'level': 'info',
      'subdomain': 'leaguewinspool',
      'inputToken': Modules.server.loggly.token(),
      'json': true,
      'tags': ['meteor'],
      'handleExceptions': true,
    };

    log.add(Winston_Loggly, options);
    log.info('Loggly setup complete');
  },

  token() {
    // Deploying from local settings.json will set Meteor.settings
    // CircleCI will set process.env.LOGGLY_TOKEN
    return (Meteor.settings.private && Meteor.settings.private.logglyToken)
      || process.env.LOGGLY_TOKEN;
  },
};
