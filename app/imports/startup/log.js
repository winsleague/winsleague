import { Meteor } from 'meteor/meteor';
import { Winston } from 'meteor/infinitedg:winston';

const log = Winston;
if (Meteor.isProduction) {
  log.level = 'info';
} else {
  log.level = 'debug';
}
log.info('Initialized logger');

export default log;
