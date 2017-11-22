/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import log from '../../../utils/log';
import { Factory } from 'meteor/dburles:factory';

import { PoolTeams } from '../../pool_teams/pool_teams';
import { Games } from '../../games/games';

import '../../league_teams/league_teams_factory';
import '../../pool_team_picks/pool_team_picks_factory';

import './hooks'; // needed because it's not auto included during test

describe('Game hooks', function() {
  describe('When inserting or updating games', function() {
    it('should add up the wins and losses for all completed games', () => {
      const poolTeamPick = Factory.create('poolTeamPick');
      const awayLeagueTeam = Factory.create('awayLeagueTeam');

      Games.insert({
        leagueId: poolTeamPick.leagueId,
        seasonId: poolTeamPick.seasonId,
        gameId: '1',
        gameDate: new Date(),
        homeTeamId: poolTeamPick.leagueTeamId,
        homeScore: 17,
        awayTeamId: awayLeagueTeam._id,
        awayScore: 10,
        status: 'completed',
        period: 'final',
      });

      // Games.insert will automatically refresh all PoolTeams that are affected

      const poolTeam = PoolTeams.findOne(poolTeamPick.poolTeamId);
      log.debug('poolTeam:', poolTeam);

      assert.equal(poolTeam.totalWins, 1, 'totalWins');
      assert.equal(poolTeam.totalGames, 1, 'totalGames');
      assert.equal(poolTeam.totalPlusMinus, 7, 'totalPlusMinus');
    });

  });
});
