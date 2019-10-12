import { _ } from 'lodash';

import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';
import { LeaguePickExpectedWins } from '../../league_pick_expected_wins/league_pick_expected_wins';
import { Leagues } from '../../leagues/leagues';
import { PoolTeamPicks } from '../pool_team_picks';
import log from '../../../utils/log';

export default {
  updatePickQuality(poolTeamPick) {
    // wins for team
    const seasonLeagueTeam = SeasonLeagueTeams.findOne({
      leagueId: poolTeamPick.leagueId,
      seasonId: poolTeamPick.seasonId,
      leagueTeamId: poolTeamPick.leagueTeamId,
    });
    const actualWins = _.get(seasonLeagueTeam, 'wins', 0);
    const gamesPlayed = (seasonLeagueTeam ? seasonLeagueTeam.totalGames() : 0);

    const expectedWinsRecord = LeaguePickExpectedWins.findOne({
      leagueId: poolTeamPick.leagueId,
      rank: poolTeamPick.pickNumber,
    });

    if (!expectedWinsRecord) {
      return null;
    }

    const expectedWinsFullSeason = expectedWinsRecord.wins;

    const { seasonGameCount } = Leagues.findOne(poolTeamPick.leagueId);

    const expectedWins = (gamesPlayed / seasonGameCount) * expectedWinsFullSeason;

    let pickQuality = actualWins - expectedWins;
    if (poolTeamPick.pointsMetric === 'losses') pickQuality *= -1;

    const plusMinus = _.get(seasonLeagueTeam, 'pointsFor', 0) - _.get(seasonLeagueTeam, 'pointsAgainst', 0);

    log.info(
      'Updating PoolTeamPick quality:', poolTeamPick,
      'actualWins:', actualWins,
      'expectedWins:', expectedWins,
      'pickQuality:', pickQuality,
      'plusMinus:', plusMinus,
    );

    PoolTeamPicks.direct.update(poolTeamPick._id, {
      $set: {
        actualWins,
        expectedWins,
        pickQuality,
        plusMinus,
      },
    });

    return pickQuality;
  },
};
