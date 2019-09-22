import log from '../../../utils/log';

import { Games } from '../../games/games';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamRecords } from '../pool_team_records';

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

    log.debug(`Done updating PoolTeamRecords for seasonId ${seasonId} and leagueTeamId ${leagueTeamId}`);


    /* BE CAREFUL THAT THIS MAY HAPPEN ASYNCRONOUSLY. WE MAY NEED TO HOOK OURSELVES IN MORE DOWNSTREAM.

    update PoolTeamRecords
    find out which PoolTeams have doc.homeTeamId and doc.awayTeamId
      update head to head record between those pool teams
        for each pool team, get which teams they picked
          for each team they picked, get which games they played against the opponent's teams
            add up wins and losses
    */
  },

  updatePoolTeamRecord(leagueId, seasonId, poolId, poolTeamId) {
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


        const awayGames = Games.find({
          leagueId,
          seasonId,
          homeTeamId: { $in: myLeagueTeams },
          awayTeamId: { $in: opponentLeagueTeams },
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

        PoolTeamRecords.upsert({
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
            pointsFor,
            pointsAgainst,
          },
        });
      }
    });

    // which teams does this poolTeamId have
    // for every other poolTeamId in this pool
      // get picks for that poolTeamId
      // look for games where the poolTeamIds played each other
        // add up wins and losses
        // upsert 
  },
};