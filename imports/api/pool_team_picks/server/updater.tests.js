import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import log from '../../../utils/log';

import '../../pool_teams/pool_teams_factory';
import '../../league_teams/league_teams_factory';
import '../../season_league_teams/season_league_teams_factory';
import '../../league_pick_expected_wins/league_pick_expected_wins_factory';

import { PoolTeamPicks } from '../pool_team_picks';
import PoolTeamPicksUpdater from './updater';

describe('Pool Team Picks Updater', function () {
  this.timeout(10000);

  describe('updatePickQuality', () => {
    it('should update the pick quality ', () => {
      const poolTeam = Factory.create('poolTeam');
      const leagueTeam = Factory.create('leagueTeam', { leagueId: poolTeam.leagueId });

      const pickNumber = 8;
      const expectedWins = 4;
      const currentWins = 10;
      const currentLosses = 3;

      Factory.create('leaguePickExpectedWin', {
        leagueId: poolTeam.leagueId,
        rank: pickNumber,
        wins: expectedWins,
      });

      Factory.create('seasonLeagueTeam', {
        leagueId: poolTeam.leagueId,
        seasonId: poolTeam.seasonId,
        leagueTeamId: leagueTeam._id,
        abbreviation: leagueTeam.abbreviation,
        wins: currentWins, // intentionally not 16 games
        losses: currentLosses,
        pointsFor: 10,
        pointsAgainst: 4,
      });

      let poolTeamPick = Factory.create('poolTeamPick', {
        poolTeamId: poolTeam._id,
        leagueTeamId: leagueTeam._id,
        pickNumber,
      });

      PoolTeamPicksUpdater.updatePickQuality(poolTeamPick);

      poolTeamPick = PoolTeamPicks.findOne(poolTeamPick._id);
      log.debug('poolTeamPick:', poolTeamPick);

      assert.equal(poolTeamPick.actualWins, currentWins, 'actualWins');
      assert.equal(poolTeamPick.expectedWins.toFixed(1), '3.3', 'expectedWins'); // toFixed returns string
      assert.equal(poolTeamPick.pickQuality.toFixed(1), '6.8', 'pickQuality'); // toFixed returns string
      assert.equal(poolTeamPick.plusMinus, 6, 'plusMinus');
    });
  });
});
