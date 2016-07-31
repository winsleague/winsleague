/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { assert } from 'meteor/practicalmeteor:chai';
import { Promise } from 'meteor/promise';
import { $ } from 'meteor/jquery';
import log from '../../../utils/log';

import { denodeify } from '../../../utils/denodeify';
import { generateData } from '../../../api/generate-data.app-tests.js';
import { Pools } from '../../../api/pools/pools';
import { PoolTeams } from '../../../api/pool_teams/pool_teams';


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
  const page = {
    getPoolTeamRowSelector: poolTeamId => `tr[id="${poolTeamId}"]`,
    getSeasonSwitcherSelector: seasonId => `a[id="${seasonId}"]`,
    getSecondPoolTeamRowSelector: () => 'tr:nth-child(2)',
  };

  describe('Full-app test of Pools.show', () => {
    // First, ensure the data that we expect is loaded on the server
    //   Then, route the app to the pools show page
    beforeEach(() =>
      generateData()
        .then(() => Meteor.loginWithPassword('test@test.com', 'test'))
        .then(() => FlowRouter.go('/'))
        .then(waitForSubscriptions)
        .then(() => FlowRouter.go('Pools.show', { poolId: Pools.findOne()._id }))
        .then(waitForSubscriptions));

    it('has the pool team row selector', () => {
      return afterFlushPromise()
        .then(() => {
          const poolTeam = PoolTeams.findOne();
          assert.isTrue($(page.getPoolTeamRowSelector(poolTeam._id)).length > 0);
        });
    });

    describe('when a pool spans multiple seasons', () => {
      let seasonId;

      beforeEach(() => {
        const pool = Pools.findOne();
        const poolId = pool._id;
        const leagueId = pool.leagueId;
        seasonId = Factory.create('season', { leagueId })._id;
        Factory.create('poolTeam', { seasonId, poolId, userId: Meteor.userId() });
      });

      it('should allow user to switch seasons', () => {
        return afterFlushPromise()
          .then(() => {
            assert.isTrue($(page.getSeasonSwitcherSelector(seasonId)).length > 0);
          });
      });
    });
  });
}
