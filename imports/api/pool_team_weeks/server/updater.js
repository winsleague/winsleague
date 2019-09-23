import log from '../../../utils/log';

import { PoolTeamWeeks } from '../pool_team_weeks';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { Games } from '../../games/games';

export default {
  updateLeagueTeam(leagueId, seasonId, leagueTeamId, week) {
    log.info(`PoolTeamWeeksUpdater.updateLeagueTeam(leagueId: ${leagueId}, seasonId: ${seasonId}, \
leagueTeamId: ${leagueTeamId}, week: ${week})`);

    const poolTeamPicks = PoolTeamPicks.find({
      leagueId,
      seasonId,
      leagueTeamId,
    });
    poolTeamPicks.forEach((poolTeamPick) => {
      this.updatePoolTeam(poolTeamPick.poolTeamId, week);
    });
  },

  updatePoolTeam(poolTeamId, week) {
    log.info(`PoolTeamWeeksUpdater.updatePoolTeam(poolTeamId: ${poolTeamId}, week: ${week})`);

    const poolTeam = PoolTeams.findOne(poolTeamId);
    if (!poolTeam) {
      throw new Error(`Unable to find poolTeam ${poolTeamId}`);
    }

    log.debug(`poolTeam: ${JSON.stringify(poolTeam)}`);

    let pointsFor = 0;
    let pointsAgainst = 0;
    const gameSummaries = [];

    const poolTeamPicks = PoolTeamPicks.find({ poolTeamId });
    poolTeamPicks.forEach((poolTeamPick) => {
      log.debug(`poolTeamPick: ${JSON.stringify(poolTeamPick)}`);

      const { poolId, seasonId } = poolTeamPick;

      const homeGame = Games.findOne({
        seasonId: poolTeam.seasonId,
        week,
        homeTeamId: poolTeamPick.leagueTeamId,
        status: 'completed',
      });

      if (homeGame) {
        pointsFor += homeGame.homeScore;
        pointsAgainst += homeGame.awayScore;
        const homeScoreSummary = `${homeGame.homeTeamPick(poolId, seasonId)} ${homeGame.homeScore}`;
        const awayScoreSummary = `${homeGame.awayTeamPick(poolId, seasonId)} ${homeGame.awayScore}`;
        gameSummaries.push(`${homeScoreSummary} vs ${awayScoreSummary}`);
      } else {
        const awayGame = Games.findOne({
          seasonId: poolTeam.seasonId,
          week,
          awayTeamId: poolTeamPick.leagueTeamId,
          status: 'completed',
        });

        if (awayGame) {
          pointsFor += awayGame.awayScore;
          pointsAgainst += awayGame.homeScore;
          const homeScoreSummary = `${awayGame.homeTeamPick(poolId, seasonId)} ${awayGame.homeScore}`;
          const awayScoreSummary = `${awayGame.awayTeamPick(poolId, seasonId)} ${awayGame.awayScore}`;
          gameSummaries.push(`${awayScoreSummary} at ${homeScoreSummary}`);
        } else {
          log.debug(`${poolTeamPick.leagueTeamId} team had a bye week`);
          // their team had a bye week
        }
      }
    });

    const gameSummary = gameSummaries.join(', ');
    log.debug(`gameSummary: ${gameSummary}`);

    if (gameSummary) { // make sure at least one game was completed
      PoolTeamWeeks.upsert({
        leagueId: poolTeam.leagueId,
        seasonId: poolTeam.seasonId,
        seasonYear: poolTeam.seasonYear,
        week,
        poolId: poolTeam.poolId,
        poolTeamId,
      }, {
        $set: {
          pointsFor,
          pointsAgainst,
          plusMinus: pointsFor - pointsAgainst,
          gameSummary,
          userId: poolTeam.userId,
          userTeamName: poolTeam.userTeamName,
        },
      });
    }
  },
};
