import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import log from '../../utils/log';

import '../league_teams/league_teams'; // needed for factory
import '../seasons/seasons'; // needed for factory
import '../pool_teams/pool_teams'; // needed for factory

export const SeasonLeagueTeams = new Mongo.Collection('season_league_teams');

SeasonLeagueTeams.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  leagueTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  wins: {
    type: Number,
    defaultValue: 0,
  },
  losses: {
    type: Number,
    defaultValue: 0,
  },
  ties: {
    type: Number,
    defaultValue: 0,
  },
  homeWins: {
    type: Number,
    defaultValue: 0,
  },
  homeLosses: {
    type: Number,
    defaultValue: 0,
  },
  homeTies: {
    type: Number,
    defaultValue: 0,
  },
  awayWins: {
    type: Number,
    defaultValue: 0,
  },
  awayLosses: {
    type: Number,
    defaultValue: 0,
  },
  awayTies: {
    type: Number,
    defaultValue: 0,
  },
  pointsFor: {
    type: Number,
    defaultValue: 0,
  },
  pointsAgainst: {
    type: Number,
    defaultValue: 0,
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

SeasonLeagueTeams.attachSchema(SeasonLeagueTeams.schema);

SeasonLeagueTeams.helpers({
  totalGames() {
    return this.wins + this.losses + this.ties;
  },
});

SeasonLeagueTeams.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


Factory.define('seasonLeagueTeam', SeasonLeagueTeams, {
  leagueId: Factory.get('poolTeam'),
  seasonId: Factory.get('season'),
  leagueTeamId: Factory.get('leagueTeam'),
}).after(factory => {
  log.debug('seasonLeagueTeam factory created:', factory);
});
