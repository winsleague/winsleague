import { Mailer } from 'meteor/lookback:emails';
import log from '../../utils/log';

import weeklyTemplate from './mailer/weekly-template';

Mailer.config({
  from: 'League Wins Pool <no-reply@leaguewinspool.com>',
  routePrefix: 'emails',              // Route prefix.
  baseUrl: process.env.ROOT_URL,      // The base domain to build absolute link URLs from in the emails.
  testEmail: 'team@leaguewinspool.com',  // Default address to send test emails to.
  logger: log,
  addRoutes: process.env.NODE_ENV === 'development',
  plainTextOpts: {
    ignoreImage: true,
  },
});

Meteor.startup(() => {
  Mailer.init({
    templates: {
      weeklyTemplate,
    },
    helpers: {},
    layout: {
      name: 'emailLayout',
      path: 'layout.html',   // Relative to 'private' dir.
      css: 'layout.css',
    },
  });
});
