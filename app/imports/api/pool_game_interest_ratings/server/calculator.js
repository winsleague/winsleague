import { _ } from 'lodash';
import moment from 'moment';
import log from '../../../utils/log';

import { PoolGameInterestRatings } from '../pool_game_interest_ratings';

import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';
import { Games } from '../../games/games';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { LeagueTeams } from '../../league_teams/league_teams';

import TopPicks from './calculators/top-picks';
import PoolTeamsTotalWins from './calculators/pool-teams-total-wins';
import LeagueTeamsRecentWins from './calculators/league-teams-recent-wins';

export default {
  calculateAllInterestRatings() {
    this.nflPools().forEach(pool => {
      this.calculatePoolInterestRatings(pool);
    });
  },

  calculatePoolInterestRatings(pool) {
    PoolGameInterestRatings.remove({
      poolId: pool._id,
    });

    this.upcomingGames(pool).forEach(game => {
      this.calculatePoolGame(pool, game);
    });
  },

  upcomingGames(pool) {
    const leagueId = LeagueFinder.getIdByName('NFL');

    // we only support NFL
    if (pool.leagueId !== leagueId) {
      return [];
    }

    const season = SeasonFinder.getLatestByLeagueName('NFL');

    const nextGame = Games.findOne({
      leagueId,
      seasonId: season._id,
      status: { $in: ['scheduled', 'in progress'] },
    }, {
      sort: {
        gameDate: 1,
      },
    });

    if (!nextGame) {
      return [];
    }

    const week = nextGame.week;

    log.info(`Upcoming games are in week ${week} for season ${season.year} ${season._id}`);

    return Games.find({
      leagueId,
      seasonId: season._id,
      week,
    });
  },

  nflPools() {
    const leagueId = LeagueFinder.getIdByName('NFL');

    return Pools.find({ leagueId });
  },


  calculatePoolGame(pool, game) {
    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId: pool.latestSeasonId,
      poolId: pool._id,
      leagueTeamId: game.homeTeamId,
    });

    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId: pool.latestSeasonId,
      poolId: pool._id,
      leagueTeamId: game.awayTeamId,
    });

    if (!homePoolTeamPick || !awayPoolTeamPick) {
      // both teams need to be picked by owners (at least for now!)
      return;
    }

    if (homePoolTeamPick.poolTeamId === awayPoolTeamPick.poolTeamId) {
      // if same player picked both teams, we don't care
      return;
    }

    const gameTitle = this.gameTitle(pool, game);

    log.info(`Calculating interest ratings for ${gameTitle} (game: ${game._id}, pool: ${pool._id})`);

    this.calculators().forEach(calculator => {
      const rating = Math.round(calculator.rating(pool, game, homePoolTeamPick, awayPoolTeamPick));

      log.info(`Rating for ${gameTitle} (${game._id}) is ${rating} because of ${calculator.justification()}`);

      PoolGameInterestRatings.insert({
        poolId: pool._id,
        gameId: game._id,
        rating,
        gameTitle,
        justification: calculator.justification(),
      });
    });
  },

  calculators() {
    return [
      TopPicks,
      PoolTeamsTotalWins,
      LeagueTeamsRecentWins,
    ];
  },

  gameTitle(pool, game) {
    // "Noah's #6 NYG at Charlie's #8 GB"

    // see who picked these teams
    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId: pool.latestSeasonId,
      poolId: pool._id,
      leagueTeamId: game.homeTeamId,
    });
    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId: pool.latestSeasonId,
      poolId: pool._id,
      leagueTeamId: game.awayTeamId,
    });

    if (!homePoolTeamPick || !awayPoolTeamPick) {
      throw new Error(`Both teams weren't picked for poolId ${pool._id} and gameId ${game._id}`);
    }

    const homePoolTeam = PoolTeams.findOne(homePoolTeamPick.poolTeamId);
    const awayPoolTeam = PoolTeams.findOne(awayPoolTeamPick.poolTeamId);

    const homeLeagueTeam = LeagueTeams.findOne(game.homeTeamId);
    const awayLeagueTeam = LeagueTeams.findOne(game.awayTeamId);

    const homeSummary = `${awayPoolTeam.userTeamName}'s #${awayPoolTeamPick.pickNumber} ${awayLeagueTeam.abbreviation}`;
    const awaySummary = `${homePoolTeam.userTeamName}'s #${homePoolTeamPick.pickNumber} ${homeLeagueTeam.abbreviation}`;

    return `${homeSummary} at ${awaySummary}`;
  },
};
