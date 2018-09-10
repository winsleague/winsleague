/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import moment from 'moment-timezone';
import log from '../../../utils/log';

import { Games } from '../games';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import NflGameData from './nfl_game_data';
import LeagueFinder from '../../leagues/finder';

function myLeagueTeams(poolTeamId) {
  const poolTeamPicks = PoolTeamPicks.find({
    poolTeamId,
  });
  return poolTeamPicks.map(poolTeamPick => poolTeamPick.leagueTeamId);
}

function relevantNflGames(seasonId, poolTeamId) {
  const week = NflGameData.relevantNflWeek(seasonId);

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

  const today = moment().tz('US/Pacific').startOf('day').toDate();
  const tomorrow = moment().tz('US/Pacific').startOf('day').add(1, 'days').toDate();

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
  if (!poolTeam) {
    log.error('myGames.ofPoolTeam: Cannot find PoolTeam ', poolTeamId);
    return this.ready();
  }

  const seasonId = poolTeam.seasonId;
  const poolId = poolTeam.poolId;

  const pool = Pools.findOne(poolId);
  if (!pool) {
    log.error('myGames.ofPoolTeam: Cannot find Pool ', poolId);
    return this.ready();
  }

  if (pool.leagueId === nflLeagueId) {
    return relevantNflGames(seasonId, poolTeamId);
  } else {
    return todaysGames(seasonId, poolTeamId);
  }
});

