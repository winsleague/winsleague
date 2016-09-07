/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { assert } from 'chai';
import { Promise } from 'meteor/promise';
import { denodeify } from '../../../utils/denodeify';
import { $ } from 'meteor/jquery';

import { generateData } from './../../../api/generate-data.app-tests.js';


// Utility -- returns a promise which resolves when all subscriptions are done
const waitForSubscriptions = () => new Promise(resolve => {
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

if (Meteor.isClient) {
  describe('Full-app test of Homepage', function () {
    this.timeout(5000);

    // First, ensure the data that we expect is loaded on the server
    //   Then, route the app to the homepage
    beforeEach(() =>
      generateData()
        .then(() => FlowRouter.go('/'))
        .then(waitForSubscriptions));

    it('has title on homepage', () => {
      return afterFlushPromise()
        .then(() => {
          assert.equal($('a.navbar-brand').html(), 'Wins League');
        });
    });
  });
}
