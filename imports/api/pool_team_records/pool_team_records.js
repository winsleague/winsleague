import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PoolTeamRecords = new Mongo.Collection('pool_team_records');

PoolTeamRecords.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  poolId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  poolTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  opponentPoolTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
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
  pointsFor: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  pointsAgainst: {
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
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset(); // Prevent user from supplying their own value
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

PoolTeamRecords.attachSchema(PoolTeamRecords.schema);

PoolTeamRecords.helpers({
  totalGames() {
    return this.wins + this.losses + this.ties;
  },

  record() {
    if (this.ties > 0) {
      return `${this.wins}-${this.losses}-${this.ties}`;
    }
    return `${this.wins}-${this.losses}`;
  },

  winningPercentage() {
    if (this.wins + this.losses + this.ties == 0) {
      return null;
    }
    return this.wins / (this.wins + this.losses + this.ties);
  },
});

PoolTeamRecords.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
