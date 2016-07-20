import { Meteor } from 'meteor/meteor';
import { Winston } from 'meteor/brentjanderson:winston-client';

let winston;
if (Meteor.isClient) {
  winston = Winston;
} else {
  winston = require('winston');
}

if (Meteor.isProduction) {
  winston.level = 'info';
} else {
  winston.level = 'debug';
}
winston.info('Initialized logger');

export default winston;

