import log from '../../../utils/log';

import { LeagueTeams } from '../../league_teams/league_teams';
import { PoolTeams } from '../pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';
import { Games } from '../../games/games';

import PoolTeamPickUpdater from '../../pool_team_picks/server/updater';

export default {
  updateWhoPickedLeagueTeam(seasonId, leagueTeamId) {
    log.info(`Finding PoolTeams who picked leagueTeamId ${leagueTeamId} for seasonId ${seasonId}`);

    const poolTeamPicks = PoolTeamPicks.find({ seasonId, leagueTeamId });
    poolTeamPicks.forEach(poolTeamPick => {
      this.updatePoolTeamRecord(poolTeamPick.poolTeamId);
      this.updatePoolTeamPickQuality(poolTeamPick.poolTeamId);
      this.updatePoolTeamUndefeatedWeeks(poolTeamPick.poolTeamId);
    });

    log.debug(`Done finding PoolTeams who picked leagueTeamId ${leagueTeamId} for seasonId ${seasonId}`);
  },

  updatePoolTeamRecord(poolTeamId) {
    log.info('Updating PoolTeam record', poolTeamId);

    let totalWins = 0;
    let totalLosses = 0;
    let totalGames = 0;
    let totalPlusMinus = 0;

    const picks = PoolTeamPicks.find({ poolTeamId });

    picks.forEach(poolTeamPick => {
      const seasonId = poolTeamPick.seasonId;
      const leagueTeamId = poolTeamPick.leagueTeamId;
      const seasonLeagueTeam = SeasonLeagueTeams.findOne({ seasonId, leagueTeamId });
      if (seasonLeagueTeam) {
        PoolTeamPicks.direct.update(poolTeamPick._id, {
          $set: {
            actualWins: seasonLeagueTeam.wins,
            actualLosses: seasonLeagueTeam.losses,
            actualTies: seasonLeagueTeam.ties,
          },
        });

        totalWins += seasonLeagueTeam.wins;
        totalLosses += seasonLeagueTeam.losses;
        totalGames += seasonLeagueTeam.totalGames();
        totalPlusMinus += seasonLeagueTeam.pointsFor - seasonLeagueTeam.pointsAgainst;
      }
    });

    // .direct is needed to avoid an infinite recursion loop
    // https://github.com/matb33/meteor-collection-hooks#direct-access-circumventing-hooks
    const numberAffected = PoolTeams.direct.update(poolTeamId,
      { $set: { totalWins, totalLosses, totalGames, totalPlusMinus } });
    log.debug(`PoolTeams.update ${poolTeamId} with totalWins: ${totalWins}, ` +
      `totalLosses: ${totalLosses}, numberAffected: ${numberAffected}`);
  },

  updatePoolTeamPickQuality(poolTeamId) {
    PoolTeamPicks.find({ poolTeamId }).forEach(poolTeamPick => {
      PoolTeamPickUpdater.updatePickQuality(poolTeamPick);
    });
  },

  updatePoolTeamUndefeatedWeeks(poolTeamId) {
    log.info('Updating PoolTeam undefeated and defeated weeks', poolTeamId);

    let undefeatedWeeks = 0;
    let defeatedWeeks = 0;

    const poolTeam = PoolTeams.findOne(poolTeamId);
    const seasonId = poolTeam.seasonId;

    const picks = PoolTeamPicks.find({ poolTeamId });
    const pickCount = picks.count();
    if (pickCount > 0) {
      const leagueTeams = picks.map(poolTeamPick => poolTeamPick.leagueTeamId);

      for (let week = 1; week < 18; week++) {
        const gamesWon = Games.find({
          seasonId,
          week,
          status: 'completed',
          winnerTeamId: { $in: leagueTeams },
        });
        if (gamesWon.count() === pickCount) {
          undefeatedWeeks++;
        }

        const gamesLost = Games.find({
          seasonId,
          week,
          status: 'completed',
          loserTeamId: { $in: leagueTeams },
        });
        if (gamesLost.count() === pickCount) {
          defeatedWeeks++;
        }
      }
    }

    const numberAffected = PoolTeams.direct.update(poolTeamId,
      {
        $set: {
          undefeatedWeeks,
          defeatedWeeks,
        },
      }
    );

    log.debug(`PoolTeams.update ${poolTeamId} with undefeatedWeeks: ${undefeatedWeeks}, defeatedWeeks: ${defeatedWeeks}, ` +
      `numberAffected: ${numberAffected}`);
  },

  updateTeamSummary(poolTeamId) {
    log.info('Updating team summary for PoolTeam:', poolTeamId);

    let teamSummary = '';
    const picks = PoolTeamPicks.find({ poolTeamId }, { sort: { pickNumber: 1 } });
    picks.forEach(poolTeamPick => {
      const leagueTeam = LeagueTeams.findOne(poolTeamPick.leagueTeamId);
      teamSummary += `${leagueTeam.abbreviation}, `;
    });
    if (teamSummary.length > 0) {
      teamSummary = teamSummary.substr(0, teamSummary.length - 2);
    } else {
      teamSummary = 'No teams drafted!';
    }

    const numberAffected = PoolTeams.direct.update(poolTeamId,
      {
        $set: {
          teamSummary,
        },
      });
    log.debug(`PoolTeams.update ${poolTeamId} with teamSummary: ${teamSummary}, ` +
      `numberAffected: ${numberAffected}`);
  },
};
