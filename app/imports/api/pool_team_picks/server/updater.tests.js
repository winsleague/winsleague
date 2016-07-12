/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import { PoolTeams } from '../../pool_teams/pool_teams'; // needed for factory
import { LeagueTeams } from '../../league_teams/league_teams'; // needed for factory

import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import PoolTeamPicksUpdater from '../../pool_team_picks/server/updater';

import { assert } from 'meteor/practicalmeteor:chai';

describe('Pool Team Picks Updater', () => {
  describe('updatePickQuality', () => {
    it('should update the pick quality ', () => {
      const poolTeam = Factory.create('poolTeam');
      const leagueTeam = Factory.create('leagueTeam', { leagueId: poolTeam.leagueId });

      SeasonLeagueTeams.insert({
        leagueId: poolTeam.leagueId,
        seasonId: poolTeam.seasonId,
        leagueTeamId: leagueTeam._id,
        wins: 10, // intentionally not 16 games
        losses: 3,
      });

      const poolTeamPickId = PoolTeamPicks.insert({
        poolTeamId: poolTeam._id,
        leagueTeamId: leagueTeam._id,
        pickNumber: 8,
      });

      let poolTeamPick = PoolTeamPicks.findOne(poolTeamPickId);

      PoolTeamPicksUpdater.updatePickQuality(poolTeamPick);

      poolTeamPick = PoolTeamPicks.findOne(poolTeamPickId);
      log.debug('poolTeamPick:', poolTeamPick);

      assert.equal(poolTeamPick.actualWins, 10, 'actualWins');
      assert.equal(poolTeamPick.expectedWins.toFixed(1), '8.4', 'expectedWins'); // toFixed returns string
      assert.equal(poolTeamPick.pickQuality.toFixed(1), '1.6', 'pickQuality'); // toFixed returns string
    });
  });
});
