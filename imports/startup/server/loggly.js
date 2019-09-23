import { Meteor } from 'meteor/meteor';
import 'winston-loggly-bulk';

import log from '../../utils/log';

// mup.js sets this
const token = () => process.env.LOGGLY_TOKEN;

const init = () => {
  if (!token()) {
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
  if (Meteor.isProduction) {
    init();
  }
});
