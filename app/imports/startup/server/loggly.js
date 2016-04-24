import { Meteor } from 'meteor/meteor';
import { Winston_Loggly} from 'meteor/infinitedg:winston-loggly';

import { isProduction } from '../environment';

Meteor.startup(() => {
  if (isProduction()) init();
});

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

  log.add(Winston_Loggly, options);
  log.info('Loggly setup complete');
}

function token() {
  // mup.json sets this
  return process.env.LOGGLY_TOKEN;
}
