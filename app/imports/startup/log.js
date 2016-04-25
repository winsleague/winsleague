import { Meteor } from 'meteor/meteor';
import { Winston } from 'meteor/infinitedg:winston';

const winston = Winston;
if (Meteor.isProduction) {
  winston.level = 'info';
} else {
  winston.level = 'debug';
}
winston.info('Initialized logger');

export default winston;
