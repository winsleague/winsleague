/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import moment from 'moment';
import log from '../../../utils/log';

import { Games } from '../games';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';

function myLeagueTeams(poolTeamId) {
  const poolTeamPicks = PoolTeamPicks.find({
    poolTeamId,
  });
  return poolTeamPicks.map(poolTeamPick => poolTeamPick.leagueTeamId);
}

function relevantNflGames(seasonId, poolTeamId) {
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

function todaysGames(seasonId, poolTeamId) {
  const myTeams = myLeagueTeams(poolTeamId);

  log.info('myTeams', myTeams);

  const today = moment().startOf('day').toDate();
  const tomorrow = moment().startOf('day').add(1, 'days').toDate();

  return Games.find({
    seasonId,
    $and: [
      {
        gameDate: {
          $gte: today,
        },
      },
      {
        gameDate: {
          $lt: tomorrow,
        },
      },
    ],
    $or: [
      {
        homeTeamId: { $in: myTeams },
      },
      {
        awayTeamId: { $in: myTeams },
      },
    ],
  });
}

Meteor.publish('myGames.ofPoolTeam', function relevantGamesOfPoolTeamId(poolTeamId) {
  log.info('checking!', poolTeamId);

  check(poolTeamId, Match.Maybe(String));
  if (!poolTeamId) {
    return this.ready();
  }

  const nflLeagueId = LeagueFinder.getIdByName('NFL');

  const poolTeam = PoolTeams.findOne(poolTeamId);
  const seasonId = poolTeam.seasonId;
  const poolId = poolTeam.poolId;

  const pool = Pools.findOne(poolId);
  if (pool.leagueId === nflLeagueId) {
    return relevantNflGames(seasonId, poolTeamId);
  } else {
    return todaysGames(seasonId, poolTeamId);
  }
});

