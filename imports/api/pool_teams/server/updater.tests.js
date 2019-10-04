import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import '../pool_teams_factory';
import '../../league_teams/league_teams_factory';
import '../../pool_team_picks/pool_team_picks_factory';

import { PoolTeams } from '../pool_teams';
import { Games } from '../../games/games';
import PoolTeamsUpdater from './updater';

describe('Pool Teams Updater', function () {
  this.timeout(10000);

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

      PoolTeamsUpdater.updatePoolTeamRecord(poolTeam._id);

      poolTeam = PoolTeams.findOne(poolTeam._id);
      log.debug('poolTeam:', poolTeam);

      assert.equal(poolTeam.totalWins, 1, 'totalWins');
      assert.equal(poolTeam.totalGames, 1, 'totalGames');
      assert.equal(poolTeam.totalPlusMinus, 7, 'totalPlusMinus');
      assert.equal(poolTeam.closeWins, 0, 'closeWins');
      assert.equal(poolTeam.closeLosses, 0, 'closeLosses');
    });
  });

  describe('Update Pool Team Undefeated Weeks', () => {
    it('should calculate the number of undefeated and defeated weeks', () => {
      let poolTeam = Factory.create('poolTeam');
      const homeLeagueTeam = Factory.create('leagueTeam', { leagueId: poolTeam.leagueId });
      const homeLeagueTeam2 = Factory.create('leagueTeam', { leagueId: poolTeam.leagueId });
      const awayLeagueTeam = Factory.create('awayLeagueTeam', { leagueId: poolTeam.leagueId });
      const awayLeagueTeam2 = Factory.create('awayLeagueTeam', { leagueId: poolTeam.leagueId });

      Factory.create('poolTeamPick', {
        poolTeamId: poolTeam._id,
        leagueTeamId: homeLeagueTeam._id,
      });

      Factory.create('poolTeamPick', {
        poolTeamId: poolTeam._id,
        leagueTeamId: homeLeagueTeam2._id,
      });

      Games.insert({
        leagueId: poolTeam.leagueId,
        seasonId: poolTeam.seasonId,
        gameId: '1',
        gameDate: new Date(),
        week: 1,
        homeTeamId: homeLeagueTeam._id,
        homeScore: 17,
        awayTeamId: awayLeagueTeam._id,
        awayScore: 10,
        winnerTeamId: homeLeagueTeam._id,
        loserTeamId: awayLeagueTeam._id,
        status: 'completed',
        period: 'final',
      });

      Games.insert({
        leagueId: poolTeam.leagueId,
        seasonId: poolTeam.seasonId,
        gameId: '1',
        gameDate: new Date(),
        week: 1,
        homeTeamId: homeLeagueTeam2._id,
        homeScore: 7,
        awayTeamId: awayLeagueTeam2._id,
        awayScore: 0,
        winnerTeamId: homeLeagueTeam._id,
        loserTeamId: awayLeagueTeam._id,
        status: 'completed',
        period: 'final',
      });

      PoolTeamsUpdater.updatePoolTeamUndefeatedWeeks(poolTeam._id);

      poolTeam = PoolTeams.findOne(poolTeam._id);
      log.debug('poolTeam:', poolTeam);

      assert.equal(poolTeam.undefeatedWeeks, 1, 'undefeatedWeeks');
      assert.equal(poolTeam.defeatedWeeks, 0, 'defeatedWeeks');
    });
  });
});
