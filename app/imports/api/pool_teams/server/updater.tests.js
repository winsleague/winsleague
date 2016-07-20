/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';
import '../../pool_teams/pool_teams'; // needed for factory
import '../../league_teams/league_teams'; // needed for factory
import '../../pool_team_picks/pool_team_picks'; // needed for factory

import { PoolTeams } from '../../pool_teams/pool_teams';
import { Games } from '../../games/games';
import PoolTeamsUpdater from '../../pool_teams/server/updater';

import { assert } from 'meteor/practicalmeteor:chai';

describe('Pool Teams Updater', () => {
  describe('Update Pool Team Wins', () => {
    it('should add up the wins and losses for all completed games', () => {
      let poolTeam = Factory.create('poolTeam');
      const homeLeagueTeam = Factory.create('leagueTeam', { leagueId: poolTeam.leagueId });
      const awayLeagueTeam = Factory.create('awayLeagueTeam', { leagueId: poolTeam.leagueId });

      Factory.create('poolTeamPick', {
        poolTeamId: poolTeam._id,
        leagueTeamId: homeLeagueTeam._id,
      });

      Games.insert({
        leagueId: poolTeam.leagueId,
        seasonId: poolTeam.seasonId,
        gameId: '1',
        gameDate: new Date(),
        homeTeamId: homeLeagueTeam._id,
        homeScore: 17,
        awayTeamId: awayLeagueTeam._id,
        awayScore: 10,
        status: 'completed',
        period: 'final',
      });

      PoolTeamsUpdater.updatePoolTeamWins(poolTeam._id);

      poolTeam = PoolTeams.findOne(poolTeam._id);
      log.debug('poolTeam:', poolTeam);

      assert.equal(poolTeam.totalWins, 1, 'totalWins');
      assert.equal(poolTeam.totalGames, 1, 'totalGames');
      assert.equal(poolTeam.totalPlusMinus, 7, 'totalPlusMinus');
    });
  });
});
