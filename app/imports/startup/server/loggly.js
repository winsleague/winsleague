import { Meteor } from 'meteor/meteor';
import log from '../../utils/log';

import 'winston-loggly-bulk';

const token = () => {
  // mup.js sets this
  return process.env.LOGGLY_TOKEN;
};

const init = () => {
  if (! token()) {
    log.warn('LOGGLY_TOKEN not found!');
    return;
  }

  const options = {
    'level': 'info',
    'subdomain': 'winsleague',
    'inputToken': token(),
    'json': true,
    'tags': ['meteor'],
    'handleExceptions': true,
  };

  log.add(log.transports.Loggly, options);
  log.info('Loggly setup complete');
};

Meteor.startup(() => {
  if (Meteor.isProduction) init();
});
