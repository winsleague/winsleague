/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import log from '../../../utils/log';

import { Games } from '../games';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { LeagueFinder } from '../../leagues/finder';
import { SeasonFinder } from '../../seasons/finder';

Meteor.publish('relevantGames.ofPoolUser', function poolGameInterestRatingsOfPool(poolId, userId) {
  check(poolId, String);
  check(userId, String);
  if (!poolId || !userId) {
    return this.ready();
  }

  const nflLeagueId = LeagueFinder.getIdByName('NFL');

  const pool = Pools.findOne(poolId);
  if (pool.leagueId === nflLeagueId) {
    return relevantNflGames();
  } else {
    return todaysGames();
  }
});

function myPoolTeamId(poolId, userId) {
  PoolTeams.findOne({
    poolId,
    userId,
  })
}

function myLeagueTeams(poolId, userId) {
  PoolTeamPicks.find({
    poolId,

  })
}

function relevantNflGames(poolId, userId) {
  const season = SeasonFinder.getLatestByLeagueName('NFL');

  const nextGame = Games.findOne({
    leagueId: season.leagueId,
    seasonId: season._id,
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
    leagueId: season.leagueId,
    seasonId: season._id,
    week,
  });
}

function todaysGames(poolId, userId) {

}
