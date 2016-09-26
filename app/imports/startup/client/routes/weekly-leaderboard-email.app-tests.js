/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { assert, expect } from 'chai';
import 'chai-jquery';
import { Promise } from 'meteor/promise';
import { $ } from 'meteor/jquery';
import log from '../../../utils/log';

import { denodeify } from '../../../utils/denodeify';
import { generateData } from '../../../api/generate-data.app-tests.js';

import { Pools } from '../../../api/pools/pools';
import { Seasons } from '../../../api/seasons/seasons';

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
  describe('Full-app test of Leaderboard Email', function () {
    this.timeout(5000);

    beforeEach(() =>
      generateData()
        .then(() => Meteor.loginWithPassword('test@test.com', 'test'))
        .then(() => FlowRouter.go('/'))
        .then(waitForSubscriptions)
    );

    describe('Full-app test of Leaderboard Email', () => {
      const page = {
        getLeaderboardTableSelector: () => '.leaderboard-wins',
      };

      const poolId = Pools.findOne()._id;
      const seasonId = Seasons.findOne()._id;

      beforeEach(() =>
        afterFlushPromise()
          .then(() => FlowRouter.go(`/emails/preview/weekly-leaderboard-email/pools/${poolId}/seasons/${seasonId}`))
          .then(waitForSubscriptions)
      );

      it('has the leaderboard table selector', () => {
        return afterFlushPromise()
          .then(() => {
            expect($(page.getLeaderboardTableSelector())).to.exist;
          });
      });
    });
  });
}

