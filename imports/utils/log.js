import { Meteor } from 'meteor/meteor';
import { Winston } from 'meteor/brentjanderson:winston-client';

// eslint-disable-next-line import/no-mutable-exports
let winston;
if (Meteor.isClient) {
  winston = Winston;
} else {
  // eslint-disable-next-line global-require
  winston = require('winston');
}

if (Meteor.isProduction) {
  winston.level = 'info';
} else {
  winston.level = 'debug';
}
winston.info('Initialized logger');

export default winston;
