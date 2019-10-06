import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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
  abbreviation: {
    type: String,
  },
  wins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  losses: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  ties: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  homeWins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  homeLosses: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  homeTies: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  awayWins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  awayLosses: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  awayTies: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  pointsFor: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  pointsAgainst: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  closeWins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  closeLosses: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset(); // Prevent user from supplying their own value
      return undefined;
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
      return undefined;
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

  record() {
    if (this.ties > 0) {
      return `${this.wins}-${this.losses}-${this.ties}`;
    }
    return `${this.wins}-${this.losses}`;
  },

  winPercentage() {
    if (this.wins + this.losses + this.ties === 0) {
      return 'N/A';
    }
    return (this.wins / (this.wins + this.losses + this.ties)).toFixed(3);
  },
});

SeasonLeagueTeams.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
