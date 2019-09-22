import log from '../../../utils/log';

import { Games } from '../../games/games';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamHeadToHeadRecords } from '../pool_team_head_to_head_records';

export default {
  updatePoolTeamByLeagueTeam(leagueId, seasonId, leagueTeamId) {
    if (!leagueId) {
      throw new Error('Undefined leagueId!');
    }
    if (!seasonId) {
      throw new Error('Undefined seasonId!');
    }
    if (!leagueTeamId) {
      throw new Error('Undefined leagueTeamId!');
    }

    log.info(`Updating pool team records for seasonId ${seasonId} and leagueTeam ${leagueTeamId}`);

    log.info(`Finding PoolTeams who picked leagueTeamId ${leagueTeamId} for seasonId ${seasonId}`);

    const poolTeamPicks = PoolTeamPicks.find({ seasonId, leagueTeamId });
    poolTeamPicks.forEach((poolTeamPick) => {
      this.updatePoolTeamRecord(poolTeamPick.leagueId,
        poolTeamPick.seasonId,
        poolTeamPick.poolId,
        poolTeamPick.poolTeamId);
    });

    log.debug(`Done updating PoolTeamHeadToHeadRecords for seasonId ${seasonId} and leagueTeamId ${leagueTeamId}`);
  },

  updateAllPoolTeamRecords(leagueId, seasonId, poolId) {
    const poolTeams = PoolTeams.find({ leagueId, seasonId, poolId });
    poolTeams.forEach((poolTeam) => {
      this.updatePoolTeamRecord(poolTeam.leagueId, poolTeam.seasonId, poolTeam.poolId, poolTeam._id);
    });
  },

  updatePoolTeamRecord(leagueId, seasonId, poolId, poolTeamId) {
    log.info(`Updating PoolTeamHeadToHeadRecords for seasonId ${seasonId}, poolTeamId ${poolTeamId}`);

    const poolTeamPicks = PoolTeamPicks.find({ leagueId, seasonId, poolId, poolTeamId });
    const myLeagueTeams = poolTeamPicks.map((poolTeamPick) => poolTeamPick.leagueTeamId);

    const poolTeams = PoolTeams.find({ leagueId, seasonId, poolId });
    poolTeams.forEach((poolTeam) => {
      if (poolTeam._id !== poolTeamId) {
        let wins = 0;
        let losses = 0;
        let ties = 0;
        let pointsFor = 0;
        let pointsAgainst = 0;

        const opponentPoolTeamId = poolTeam._id;

        const opponentPoolTeamPicks = PoolTeamPicks.find({ leagueId, seasonId, poolId, poolTeamId: poolTeam._id });
        const opponentLeagueTeams = opponentPoolTeamPicks.map((poolTeamPick) => poolTeamPick.leagueTeamId);

        log.info(`Looking for Games with homeTeamId in ${myLeagueTeams} and awayTeamId in ${opponentLeagueTeams}`);
        const homeGames = Games.find({
          leagueId,
          seasonId,
          homeTeamId: { $in: myLeagueTeams },
          awayTeamId: { $in: opponentLeagueTeams },
          status: 'completed',
        });
        homeGames.forEach((game) => {
          log.debug(`Found home game: ${game._id}`);

          if (game.homeScore > game.awayScore) {
            wins += 1;
          } else if (game.homeScore < game.awayScore) {
            losses += 1;
          } else {
            ties += 1;
          }
          pointsFor += game.homeScore;
          pointsAgainst += game.awayScore;
        });


        log.info(`Looking for Games with homeTeamId in ${opponentLeagueTeams} and awayTeamId in ${myLeagueTeams}`);
        const awayGames = Games.find({
          leagueId,
          seasonId,
          homeTeamId: { $in: opponentLeagueTeams },
          awayTeamId: { $in: myLeagueTeams },
          status: 'completed',
        });
        awayGames.forEach((game) => {
          log.debug(`Found away game: ${game._id}`);

          if (game.awayScore > game.homeScore) {
            wins += 1;
          } else if (game.awayScore < game.homeScore) {
            losses += 1;
          } else {
            ties += 1;
          }
          pointsFor += game.awayScore;
          pointsAgainst += game.homeScore;
        });

        let winPercentage = 0;
        if (wins + losses + ties > 0) {
          winPercentage = wins / (wins + losses + ties);
        }

        PoolTeamHeadToHeadRecords.upsert({
          leagueId,
          seasonId,
          poolId,
          poolTeamId,
          opponentPoolTeamId,
        }, {
          $set: {
            wins,
            losses,
            ties,
            winPercentage,
            pointsFor,
            pointsAgainst,
          },
        });
      }
    });
  },
};