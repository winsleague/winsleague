import log from '../../../utils/log';

import { Leagues } from '../../leagues/leagues';
import { Games } from '../../games/games';
import { LeagueTeams } from '../../league_teams/league_teams';
import { SeasonLeagueTeams } from '../season_league_teams';
import './hooks';

export default {
  updateTeamStats(leagueId, seasonId, leagueTeamId) {
    if (!leagueId) {
      throw new Error('Undefined leagueId!');
    }
    if (!seasonId) {
      throw new Error('Undefined seasonId!');
    }
    if (!leagueTeamId) {
      throw new Error('Undefined leagueTeamId!');
    }

    log.info(`Updating team stats for seasonId ${seasonId} and leagueTeam ${leagueTeamId}`);

    const league = Leagues.findOne(leagueId);
    if (!league) {
      throw new Error(`League doesn't exist for leagueId ${leagueId}`);
    }
    const { closeScore } = league;

    const games = Games.find({
      seasonId,
      status: 'completed',
      $or: [
        { homeTeamId: leagueTeamId },
        { awayTeamId: leagueTeamId },
      ],
    });

    let wins = 0; let losses = 0; let ties = 0;
    let homeWins = 0; let homeLosses = 0; let homeTies = 0;
    let awayWins = 0; let awayLosses = 0; let awayTies = 0;
    let pointsFor = 0; let pointsAgainst = 0;
    let closeWins = 0; let closeLosses = 0;
    games.forEach((game) => {
      const pointDifference = Math.abs(game.homeScore - game.awayScore);

      if (game.homeTeamId === leagueTeamId) {
        if (game.homeScore > game.awayScore) {
          wins += 1;
          homeWins += 1;
          if (pointDifference <= closeScore || game.quarter === 'final overtime') {
            closeWins += 1;
          }
        } else if (game.homeScore < game.awayScore) {
          losses += 1;
          homeLosses += 1;
          if (pointDifference <= closeScore || game.quarter === 'final overtime') {
            closeLosses += 1;
          }
        } else {
          ties += 1;
          homeTies += 1;
        }
        pointsFor += game.homeScore;
        pointsAgainst += game.awayScore;
      } else if (game.awayTeamId === leagueTeamId) {
        if (game.awayScore > game.homeScore) {
          wins += 1;
          awayWins += 1;
          if (pointDifference <= closeScore || game.quarter === 'final overtime') {
            closeWins += 1;
          }
        } else if (game.awayScore < game.homeScore) {
          losses += 1;
          awayLosses += 1;
          if (pointDifference <= closeScore || game.quarter === 'final overtime') {
            closeLosses += 1;
          }
        } else {
          ties += 1;
          awayTies += 1;
        }
        pointsFor += game.awayScore;
        pointsAgainst += game.homeScore;
      }
    });

    const { abbreviation } = LeagueTeams.findOne(leagueTeamId);

    // leagueId needed because it could be an insert
    const result = SeasonLeagueTeams.upsert({ leagueId, seasonId, leagueTeamId },
      {
        $set: {
          abbreviation,
          wins,
          losses,
          ties,
          homeWins,
          homeLosses,
          homeTies,
          awayWins,
          awayLosses,
          awayTies,
          pointsFor,
          pointsAgainst,
          closeWins,
          closeLosses,
        },
      });

    log.debug(`SeasonLeagueTeams.upsert for seasonId ${seasonId}, leagueTeamId: ${leagueTeamId}: \
${wins} wins, ${losses} losses, ${ties} ties, ${result.numberAffected} affected`);
  },
};
