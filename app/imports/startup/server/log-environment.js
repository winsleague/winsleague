import { Meteor } from 'meteor/meteor';

import log from '../../utils/log';

log.info('Meteor.isTest:', Meteor.isTest);
log.info('Meteor.isAppTest:', Meteor.isAppTest);

log.info('Meteor.isDevelopment:', Meteor.isDevelopment);
log.info('Meteor.isProduction:', Meteor.isProduction);

log.info('BUNDLE_PATH:', process.env.BUNDLE_PATH);
log.info('ROOT_URL:', process.env.ROOT_URL);
log.info('APP_DIR:', process.env.APP_DIR);
