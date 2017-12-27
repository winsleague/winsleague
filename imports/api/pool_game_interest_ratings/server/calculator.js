import { _ } from 'lodash';
import moment from 'moment-timezone';
import log from '../../../utils/log';

import { PoolGameInterestRatings } from '../pool_game_interest_ratings';

import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';
import { Games } from '../../games/games';
import { Pools } from '../../pools/pools';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';

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

    const startMoment = moment(season.startDate).tz('US/Pacific').startOf('day');

    const daysSinceStart = moment().tz('US/Pacific').startOf('day').diff(startMoment, 'days');

    // we subtract 2 from daysSinceStart so that Wednesday is the start of the week
    const week = Math.round((daysSinceStart - 2) / 7) + 1;

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
    const poolId = pool._id;
    const seasonId = pool.latestSeasonId;

    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: game.homeTeamId,
    });

    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
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

    const gameTitle = game.title(poolId, seasonId);

    log.info(`Calculating interest ratings for ${gameTitle} (game: ${game._id}, pool: ${poolId})`);

    this.calculators().forEach(calculator => {
      const result = calculator.calculate(pool, game, homePoolTeamPick, awayPoolTeamPick);
      const rating = Math.round(result.rating);

      log.info(`${calculator.name()} rating for ${gameTitle} (${game._id}) is ${rating} because of ${result.justification}`);

      PoolGameInterestRatings.insert({
        poolId,
        gameId: game._id,
        rating,
        gameTitle,
        justification: result.justification,
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
};
