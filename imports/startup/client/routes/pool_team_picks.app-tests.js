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
import { Games } from '../../../api/games/games';

if (Meteor.isClient) {
  describe('Full-app test of PoolTeamPicks', function () {
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

    describe('Full-app test of PoolTeamPicks.show', () => {
      const page = {
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
        .then(() => FlowRouter.go('PoolTeamPicks.show', {
          poolId: Pools.findOne()._id,
          poolTeamId: PoolTeams.findOne()._id,
          poolTeamPickId: PoolTeamPicks.findOne()._id,
        }))
        .then(() => afterFlushPromise())
        .then(waitForSubscriptions));

      it('has the game row selector', () => afterFlushPromise()
        .then(() => {
          const game = Games.findOne();
          expect($(page.getGameSelector(game._id))).to.exist;
        }));
    });
  });
}
