import { Meteor } from 'meteor/meteor';
import log from '../log';

import WinstonLoggly from 'winston-loggly';

Meteor.startup(() => {
  if (Meteor.isProduction) init();
});

function token() {
  // mup.json sets this
  return process.env.LOGGLY_TOKEN;
}

function init() {
  if (! token()) {
    log.warn('LOGGLY_TOKEN not found!');
    return;
  }

  const options = {
    'level': 'info',
    'subdomain': 'leaguewinspool',
    'inputToken': token(),
    'json': true,
    'tags': ['meteor'],
    'handleExceptions': true,
  };

  log.add(WinstonLoggly, options);
  log.info('Loggly setup complete');
}

