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
import { PoolTeams } from '../../../api/pool_teams/pool_teams';
import { PoolTeamPicks } from '../../../api/pool_team_picks/pool_team_picks';
import { Games } from '../../../api/games/games';

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
  describe('Full-app test of PoolTeams', function () {
    this.timeout(5000);

    beforeEach(() =>
      generateData()
        .then(() => Meteor.loginWithPassword('test@test.com', 'test'))
        .then(() => FlowRouter.go('/'))
        .then(waitForSubscriptions)
    );

    describe('Full-app test of PoolTeams.show', () => {
      const page = {
        getPoolTeamPickRowSelector: poolTeamPickId => `tr[id="${poolTeamPickId}"]`,
        getGameSelector: gameId => `table[id="game${gameId}"]`,
      };

      beforeEach(() =>
        afterFlushPromise()
          .then(() => FlowRouter.go('PoolTeams.show', { poolId: Pools.findOne()._id, poolTeamId: PoolTeams.findOne()._id }))
          .then(waitForSubscriptions)
      );

      it('has the pool team pick row selector', () => {
        return afterFlushPromise()
          .then(() => {
            const poolTeamPick = PoolTeamPicks.findOne();
            expect($(page.getPoolTeamPickRowSelector(poolTeamPick._id))).to.exist;
          });
      });

      it('shows current games for the pool team', () => {
        return afterFlushPromise()
          .then(() => {
            const game = Games.findOne();
            expect($(page.getGameSelector(game._id))).to.exist;
          });
      })
    });

    describe('Full-app test of PoolTeams.new', () => {
      const page = {
        getUserEmailSelector: () => 'input[name="userEmail"]',
        getUserTeamNameSelector: () => 'input[name="userTeamName"]',
      };

      beforeEach(() =>
        afterFlushPromise()
          .then(() => FlowRouter.go('PoolTeams.new', { poolId: Pools.findOne()._id }))
          .then(waitForSubscriptions)
      );

      it('should display the email', () => {
        return () => {
          expect($(page.getUserEmailSelector())).to.exist;
        };
      });

      it('should display the name field', () => {
        return () => {
          expect($(page.getUserTeamNameSelector())).to.exist;
        };
      });

      it('should create new pool team', () => {
        const userEmail = 'test123@test.com';
        $(page.getUserEmailSelector()).val(userEmail);
        const userTeamName = 'Dummy Dummies';
        $(page.getUserTeamNameSelector()).val(userTeamName);
        $('form').submit();

        return afterFlushPromise()
          .then(() => {
            const poolTeam = PoolTeams.findOne({ userTeamName });
            assert.isNotNull(poolTeam, 'poolTeam');
            assert.isNotNull(poolTeam.leagueId, 'leagueId');
          });
      });
    });
  });
}

