import { Meteor } from 'meteor/meteor';

import log from '../../utils/log';

log.info('Meteor.isTest:', Meteor.isTest);
log.info('Meteor.isAppTest:', Meteor.isAppTest);

log.info('Meteor.isDevelopment:', Meteor.isDevelopment);
log.info('Meteor.isProduction:', Meteor.isProduction);

