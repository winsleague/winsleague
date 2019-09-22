import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PoolTeamHeadToHeadRecords = new Mongo.Collection('pool_team_head_to_head_records');

PoolTeamHeadToHeadRecords.schema = new SimpleSchema({
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
  winPercentage: {
    type: Number,
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

PoolTeamHeadToHeadRecords.attachSchema(PoolTeamHeadToHeadRecords.schema);

PoolTeamHeadToHeadRecords.helpers({
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

PoolTeamHeadToHeadRecords.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
