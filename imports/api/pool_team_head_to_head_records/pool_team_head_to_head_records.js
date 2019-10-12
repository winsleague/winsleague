import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { PoolTeams } from '../pool_teams/pool_teams';
import { Seasons } from '../seasons/seasons';

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
  seasonYear: {
    type: SimpleSchema.Integer,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        const { seasonId } = PoolTeams.findOne(this.field('poolTeamId').value);
        const season = Seasons.findOne(seasonId);
        if (season) return season.year;
        throw new Error(`No season found for seasonId ${seasonId}`);
      }
      return undefined;
    },
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
  gameCount: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
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

PoolTeamHeadToHeadRecords.attachSchema(PoolTeamHeadToHeadRecords.schema);

PoolTeamHeadToHeadRecords.helpers({
  totalGames() {
    return this.wins + this.losses + this.ties;
  },

  record() {
    const perc = (this.winPercentage * 100).toFixed(0);
    if (this.ties > 0) {
      return `${this.wins}-${this.losses}-${this.ties} (${perc}%)`;
    }
    return `${this.wins}-${this.losses} (${perc}%)`;
  },

  userTeamName() {
    const poolTeam = PoolTeams.findOne(this.poolTeamId);
    return poolTeam.userTeamName;
  },

  opponentTeamName() {
    const poolTeam = PoolTeams.findOne(this.opponentPoolTeamId);
    return poolTeam.userTeamName;
  },
});

PoolTeamHeadToHeadRecords.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
