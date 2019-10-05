import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import moment from 'moment-timezone';
import log from '../../../utils/log';

import { Games } from '../games';
import { Pools } from '../../pools/pools';
import { PoolTeams } from '../../pool_teams/pool_teams';
import { PoolTeamPicks } from '../../pool_team_picks/pool_team_picks';
import { Seasons } from '../../seasons/seasons';
import LeagueFinder from '../../leagues/finder';

function myLeagueTeams(poolTeamId) {
  const poolTeamPicks = PoolTeamPicks.find({
    poolTeamId,
  });
  return poolTeamPicks.map((poolTeamPick) => poolTeamPick.leagueTeamId);
}

function relevantNflWeek(seasonId) {
  // if Wednesday or later, look forward
  // if Tuesday, look backward

  const season = Seasons.findOne(seasonId);
  const startMoment = moment(season.startDate).tz('US/Pacific').startOf('day');

  const daysSinceStart = moment().tz('US/Pacific').startOf('day').diff(startMoment, 'days');

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

  const today = moment().tz('US/Pacific').startOf('day').toDate();
  const tomorrow = moment().tz('US/Pacific').startOf('day').add(1, 'days')
    .toDate();

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

Meteor.publish('games.single', (gameId) => {
  check(gameId, Match.Maybe(String));

  return Games.find({ _id: gameId });
});

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

  const { seasonId, poolId } = poolTeam;

  const pool = Pools.findOne(poolId);
  if (!pool) {
    log.error('myGames.ofPoolTeam: Cannot find Pool ', poolId);
    return this.ready();
  }

  if (pool.leagueId === nflLeagueId) {
    return relevantNflGames(seasonId, poolTeamId);
  }
  return todaysGames(seasonId, poolTeamId);
});

Meteor.publish('games.ofSeasonLeagueTeam', (seasonId, leagueTeamId) => {
  check(seasonId, Match.Maybe(String));
  check(leagueTeamId, Match.Maybe(String));
  if (!seasonId || !leagueTeamId) {
    return this.ready();
  }

  return Games.find({
    seasonId,
    $or: [
      {
        homeTeamId: leagueTeamId,
      },
      {
        awayTeamId: leagueTeamId,
      },
    ],
  });
});
