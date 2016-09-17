import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';

import { PoolTeams } from '../pool_teams/pool_teams';
import { LeagueTeams } from '../league_teams/league_teams';
import { PoolTeamPicks } from '../pool_team_picks/pool_team_picks';

export const Games = new Mongo.Collection('games');

Games.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  gameId: {
    type: String,
    // this is not a UUID
  },
  gameDate: {
    type: Date,
  },
  week: {
    type: Number,
    optional: true,
  }, // only for NFL
  homeTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  homeScore: {
    type: Number,
    optional: true,
  },
  awayTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  awayScore: {
    type: Number,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['scheduled', 'in progress', 'completed', 'postponed', 'suspended', 'cancelled'],
  },
  period: { // quarter if NFL or NBA, inning if MLB, period if NHL
    type: String,
    allowedValues: ['pregame', '1', '2', 'halftime', '3', '4',
      '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      'overtime', 'final', 'final overtime'],
  },
  timeRemaining: {
    type: String,
    optional: true,
  },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
});

Games.attachSchema(Games.schema);

Games.helpers({
  title(poolId, seasonId) {
    // "Noah's #6 NYG at Charlie's #8 GB"

    return `${this.awayTeamName(poolId, seasonId)} at ${this.homeTeamName(poolId, seasonId)}`;
  },

  homeTeamName(poolId, seasonId) {
    const homePoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: this.homeTeamId,
    });

    let homePick = '';
    if (homePoolTeamPick) {
      const homePoolTeam = PoolTeams.findOne(homePoolTeamPick.poolTeamId);
      homePick = `${homePoolTeam.userTeamName}'s #${homePoolTeamPick.pickNumber} `;
    }

    const homeLeagueTeam = LeagueTeams.findOne(this.homeTeamId);

    return `${homePick}${homeLeagueTeam.abbreviation}`;
  },

  awayTeamName(poolId, seasonId) {
    const awayPoolTeamPick = PoolTeamPicks.findOne({
      seasonId,
      poolId,
      leagueTeamId: this.awayTeamId,
    });

    let awayPick = '';
    if (awayPoolTeamPick) {
      const awayPoolTeam = PoolTeams.findOne(awayPoolTeamPick.poolTeamId);
      awayPick = `${awayPoolTeam.userTeamName}'s #${awayPoolTeamPick.pickNumber} `;
    }

    const awayLeagueTeam = LeagueTeams.findOne(this.awayTeamId);

    return `${awayPick}${awayLeagueTeam.abbreviation}`;
  },

  friendlyDate() {
    const date = moment(this.gameDate).tz('US/Eastern').format('ddd M/D,');
    const est = moment(this.gameDate).tz('US/Eastern').format('ha');
    const pst = moment(this.gameDate).tz('US/Pacific').format('ha');
    return `${date} ${est} ET/${pst} PT`;
  },

  timeStatus() {
    if (this.status === 'scheduled') {
      return this.friendlyDate();
    } else {
      return this.period;
    }
  },

  showScore() {
    return this.status !== 'scheduled';
  },
});

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

