/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import moment from 'moment';
import log from '../../../utils/log';

import { Games } from '../games';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { Seasons } from '../../seasons/seasons';
import LeagueFinder from '../../leagues/finder';
import SeasonFinder from '../../seasons/finder';

function myLeagueTeams(poolTeamId) {
  const poolTeamPicks = PoolTeamPicks.find({
    poolTeamId,
  });
  return poolTeamPicks.map(poolTeamPick => poolTeamPick.leagueTeamId);
}

function relevantNflWeek(seasonId) {
  // if Wednesday or later, look forward
  // if Tuesday, look backward

  const season = Seasons.findOne(seasonId);
  const startMoment = moment(season.startDate).startOf('day');

  const daysSinceStart = moment().startOf('day').diff(startMoment, 'days');

  // we subtract 2 from daysSinceStart so that Wednesday is the start of the week
  return Math.round((daysSinceStart - 2) / 7) + 1;
}

function relevantNflGames(seasonId, poolTeamId) {
  const week = relevantNflWeek(seasonId);

  if (!week) {
    return this.ready();
  }

  log.info(`Upcoming games are in week ${week} for season ${seasonId}`);

  const myTeams = myLeagueTeams(poolTeamId);

  return Games.find({
    seasonId,
    week,
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

function todaysGames(seasonId, poolTeamId) {
  const myTeams = myLeagueTeams(poolTeamId);

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

