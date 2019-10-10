import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import moment from 'moment-timezone';
import log from '../../../utils/log';

import { Games } from '../games';
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

function releventNflGames(seasonId, poolTeamId) {
  const week = relevantNflWeek(seasonId);

  if (!week) {
    return this.ready();
  }

  log.info(`Upcoming games are in week ${week} for season ${seasonId}`);

  if (poolTeamId) {
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
  return Games.find({
    seasonId,
    week,
  });
}

function todaysGames(seasonId, poolTeamId) {
  const today = moment().tz('US/Pacific').startOf('day').toDate();
  const tomorrow = moment().tz('US/Pacific').startOf('day').add(1, 'days')
    .toDate();

  if (poolTeamId) {
    const myTeams = myLeagueTeams(poolTeamId);
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
  });
}

Meteor.publish('games.single', (gameId) => {
  check(gameId, String);

  return Games.find({ _id: gameId });
});

Meteor.publish('games.ofSeason', (seasonId, poolTeamId) => {
  check(seasonId, String);
  check(poolTeamId, Match.Maybe(String));
  if (!seasonId) {
    return this.ready();
  }

  const nflLeagueId = LeagueFinder.getIdByName('NFL');

  const season = Seasons.findOne(seasonId);
  if (!season) {
    log.error('games.ofSeason: Cannot find Pool ', seasonId);
    return this.ready();
  }

  if (season.leagueId === nflLeagueId) {
    return releventNflGames(seasonId, poolTeamId);
  }
  return todaysGames(seasonId, poolTeamId);
});

Meteor.publish('games.ofSeasonLeagueTeam', (seasonId, leagueTeamId) => {
  check(seasonId, String);
  check(leagueTeamId, String);
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
