/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import log from '../../../startup/log';
import '../../seasons/seasons'; // needed for factory
import '../../league_teams/league_teams'; // needed for factory

import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';
import { Games } from '../../games/games';
import SeasonLeagueTeamsUpdater from '../../season_league_teams/server/updater';

import { assert } from 'meteor/practicalmeteor:chai';

describe('Season League Teams Updater', () => {
  describe('Update Team Stats', () => {
    it('should add up the wins and losses for all completed games', () => {
      const season = Factory.create('season');
      const homeLeagueTeam = Factory.create('leagueTeam', { leagueId: season.leagueId });
      const awayLeagueTeam = Factory.create('awayLeagueTeam', { leagueId: season.leagueId });

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

      SeasonLeagueTeamsUpdater.updateTeamStats(
        season.leagueId,
        season._id,
        homeLeagueTeam._id
      );

      const homeSeasonLeagueTeam = SeasonLeagueTeams.findOne({
        leagueId: season.leagueId,
        seasonId: season._id,
        leagueTeamId: homeLeagueTeam._id,
      });
      assert.equal(homeSeasonLeagueTeam.wins, 1, 'wins');
      assert.equal(homeSeasonLeagueTeam.losses, 0, 'losses');
    });
  });
});
