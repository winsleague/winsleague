import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';

import { denodeify } from '../../../utils/denodeify';
import log from '../../../utils/log';

// Utility -- returns a promise which resolves when all subscriptions are done
const waitForSubscriptions = () => new Promise((resolve) => {
  const poll = Meteor.setInterval(() => {
    if (DDP._allSubscriptionsReady()) {
      Meteor.clearInterval(poll);
      resolve();
    }
  }, 200);
});

// Tracker.afterFlush runs code when all consequent of a tracker based change
//   (such as a route change) have occured. This makes it a promise.
const afterFlushPromise = denodeify(Tracker.afterFlush);

const resetRoute = () => new Promise((resolve) => {
  log.info('Going to homepage');
  FlowRouter.go('/?force=true');
  FlowRouter.watchPathChange();
  Tracker.afterFlush(resolve);
});

const login = () => new Promise((resolve) => {
  log.info('Logging in...');
  Meteor.loginWithPassword('test@test.com', 'test', function (err) {
    if (err) {
      log.error(err);
    }
    log.info('Logged in!');
    FlowRouter.go('/?force=true');
    FlowRouter.watchPathChange();
    Tracker.afterFlush(resolve);
  });
});

export {
  waitForSubscriptions,
  afterFlushPromise,
  resetRoute,
  login,
};
