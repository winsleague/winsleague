/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import '../../pool_teams/pool_teams_factory';
import '../../league_teams/league_teams_factory';
import '../../season_league_teams/season_league_teams_factory';
import '../../pool_team_picks/pool_team_picks_factory';

import { Games } from '../../games/games';
import { PoolTeamHeadToHeadRecords } from '../pool_team_head_to_head_records';
import PoolTeamHeadToHeadRecordsUpdater from './updater';

describe('Pool Team Head to Head Records Updater', function () {
  this.timeout(5000);

  describe('updatePoolTeamRecord', () => {
    it('should update the head to head record', () => {
      const league = Factory.create('league');
      const season = Factory.create('season', { leagueId: league._id });
      const pool = Factory.create('pool', { leagueId: league._id, latestSeasonId: season._id });
      const poolTeam = Factory.create('poolTeam', { leagueId: league._id, seasonId: season._id, poolId: pool._id });
      const opponentPoolTeam = Factory.create('poolTeam', { leagueId: league._id, seasonId: season._id, poolId: pool._id });
  
      const homeLeagueTeam = Factory.create('leagueTeam', { leagueId: season.leagueId });
      const awayLeagueTeam = Factory.create('awayLeagueTeam', { leagueId: season.leagueId });

      Factory.create('poolTeamPick', {
        leagueId: league._id,
        seasonId: season._id,
        poolId: pool._id,
        poolTeamId: poolTeam._id,
        leagueTeamId: homeLeagueTeam._id,
        pickNumber: 1,
      });

      Factory.create('poolTeamPick', {
        leagueId: league._id,
        seasonId: season._id,
        poolId: pool._id,
        poolTeamId: opponentPoolTeam._id,
        leagueTeamId: awayLeagueTeam._id,
        pickNumber: 2,
      });

      Games.insert({
        leagueId: season.leagueId,
        seasonId: season._id,
        gameId: '1',
        gameDate: new Date(),
        homeTeamId: homeLeagueTeam._id,
        homeScore: 17,
        awayTeamId: awayLeagueTeam._id,
        awayScore: 10,
        status: 'completed',
        period: 'final',
      });

      PoolTeamHeadToHeadRecordsUpdater.updateAllPoolTeamRecords(league._id, season._id, pool._id);

      const poolTeamHeadToHeadRecord = PoolTeamHeadToHeadRecords.findOne({
        leagueId: season.leagueId,
        seasonId: season._id,
        poolTeamId: poolTeam._id,
      });
      assert.equal(poolTeamHeadToHeadRecord.wins, 1, 'wins');
      assert.equal(poolTeamHeadToHeadRecord.losses, 0, 'losses');
      assert.equal(poolTeamHeadToHeadRecord.ties, 0, 'ties');
    });
  });
});
