import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { assert, expect } from 'chai';
import 'chai-jquery';
import { $ } from 'meteor/jquery';
import log from '../../../utils/log';

import {
  waitForSubscriptions, afterFlushPromise, resetRoute, login,
} from './helpers.app-tests';
import { generateData } from '../../../api/generate-data.app-tests';

import { Pools } from '../../../api/pools/pools';
import { PoolTeams } from '../../../api/pool_teams/pool_teams';
import { PoolTeamPicks } from '../../../api/pool_team_picks/pool_team_picks';

if (Meteor.isClient) {
  describe('Full-app test of PoolTeams', function () {
    this.timeout(10000);

    beforeEach(() => resetRoute()
      .then(() => generateData())
      .then(login)
      .then(waitForSubscriptions));

    afterEach((done) => {
      Meteor.logout(() => {
        log.info('Logged out');
        FlowRouter.go('/?force=true');
        FlowRouter.watchPathChange();
        done();
      });
    });

    describe('Full-app test of PoolTeams.show', () => {
      const page = {
        getPoolTeamPickRowSelector: (poolTeamPickId) => `tr[id="${poolTeamPickId}"]`,
        getGameSelector: (gameId) => `table[id="game${gameId}"]`,
      };

      beforeEach(() => afterFlushPromise()
        .then(() => FlowRouter.go('Pools.show', { poolId: Pools.findOne()._id }))
        .then(() => afterFlushPromise())
        .then(waitForSubscriptions)
        .then(() => FlowRouter.go('PoolTeams.show', {
          poolId: Pools.findOne()._id, poolTeamId: PoolTeams.findOne()._id,
        }))
        .then(() => afterFlushPromise())
        .then(waitForSubscriptions));

      it('has the pool team pick row selector', () => afterFlushPromise()
        .then(() => {
          const poolTeamPick = PoolTeamPicks.findOne();
          expect($(page.getPoolTeamPickRowSelector(poolTeamPick._id))).to.exist;
        }));
    });

    describe('Full-app test of PoolTeams.new', () => {
      const page = {
        getUserEmailSelector: () => 'input[name="userEmail"]',
        getUserTeamNameSelector: () => 'input[name="userTeamName"]',
      };

      beforeEach(() => afterFlushPromise()
        .then(() => FlowRouter.go('PoolTeams.new', { poolId: Pools.findOne()._id }))
        .then(() => afterFlushPromise())
        .then(waitForSubscriptions));

      it('should display the email', () => () => {
        expect($(page.getUserEmailSelector())).to.exist;
      });

      it('should display the name field', () => () => {
        expect($(page.getUserTeamNameSelector())).to.exist;
      });

      it('should create new pool team', () => {
        const userEmail = 'test123@test.com';
        $(page.getUserEmailSelector()).val(userEmail);
        const userTeamName = 'Dummy Dummies';
        $(page.getUserTeamNameSelector()).val(userTeamName);
        $('#submitButton').click();

        return afterFlushPromise()
          .then(waitForSubscriptions)
          .then(() => {
            const poolTeam = PoolTeams.findOne({ userTeamName });
            assert.isNotNull(poolTeam, 'poolTeam');
            assert.isNotNull(poolTeam.leagueId, 'leagueId');
          });
      });
    });
  });
}
