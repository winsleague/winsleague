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
  describe('Full-app test of Pools', () => {
    beforeEach(() =>
      generateData()
        .then(() => Meteor.loginWithPassword('test@test.com', 'test'))
        .then(() => FlowRouter.go('/'))
        .then(waitForSubscriptions)
    );

    describe('Full-app test of Pools.show', () => {
      const page = {
        getPoolTeamRowSelector: poolTeamId => `tr[id="${poolTeamId}"]`,
        getSeasonSwitcherSelector: seasonId => `a[id="${seasonId}"]`,
        getSecondPoolTeamRowSelector: () => 'tr:nth-child(2)',
      };

      beforeEach(() =>
        afterFlushPromise()
          .then(() => FlowRouter.go('Pools.show', { poolId: Pools.findOne()._id }))
          .then(waitForSubscriptions)
      );

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

    describe('Full-app test of Pools.records', () => {
      const page = {
        getMostWinsAllTimeCellSelector: () =>
          `table#pool_users_most_wins_all_time tbody tr td.metric`,
        getMostLossesAllTimeCellSelector: () =>
          `table#pool_users_most_losses_all_time tbody tr td.metric`,
        getBestPlusMinusAllTimeCellSelector: () =>
          `table#pool_users_best_plus_minus_all_time tbody tr td.metric`,
        getWorstPlusMinusAllTimeCellSelector: () =>
          `table#pool_users_worst_plus_minus_all_time tbody tr td.metric`,

        getMostWinsSeasonCellSelector: () =>
          `table#pool_teams_most_wins_season tbody tr td.metric`,
        getMostLossesSeasonCellSelector: () =>
          `table#pool_teams_most_losses_season tbody tr td.metric`,
        getBestPlusMinusSeasonCellSelector: () =>
          `table#pool_teams_best_plus_minus_season tbody tr td.metric`,
        getWorstPlusMinusSeasonCellSelector: () =>
          `table#pool_teams_worst_plus_minus_season tbody tr td.metric`,

        getBestPickQualitySeasonCellSelector: () =>
          `table#pool_team_picks_best_pick_quality_season tbody tr td.metric`,
        getWorstPickQualitySeasonCellSelector: () =>
          `table#pool_team_picks_worst_pick_quality_season tbody tr td.metric`,
      };

      beforeEach(() =>
        afterFlushPromise()
          .then(() => FlowRouter.go('Pools.records', { poolId: Pools.findOne()._id }))
          .then(waitForSubscriptions)
      );

      it('should display the teams with the most wins of all time', () => {
        return afterFlushPromise()
          .then(() => {
            assert.equal($(page.getMostWinsAllTimeCellSelector()).text(), 10);
          });
      });
    });

  });
}
