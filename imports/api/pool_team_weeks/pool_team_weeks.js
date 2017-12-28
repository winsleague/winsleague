import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Pools } from '../pools/pools';
import { Seasons } from '../seasons/seasons';
import SeasonFinder from '../seasons/finder';

export const PoolTeamWeeks = new Mongo.Collection('pool_team_weeks');

PoolTeamWeeks.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        return Pools.findOne(this.field('poolId').value).leagueId;
      }
    },
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        const { leagueId } = Pools.findOne(this.field('poolId').value);
        const latestSeason = SeasonFinder.getLatestByLeagueId(leagueId);
        if (latestSeason) return latestSeason._id;
        throw new Error(`No season found for leagueId ${leagueId}`);
      }
    },
  },
  seasonYear: {
    type: SimpleSchema.Integer,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        const { leagueId } = Pools.findOne(this.field('poolId').value);
        const latestSeason = SeasonFinder.getLatestByLeagueId(leagueId);
        if (latestSeason) return latestSeason.year;
        throw new Error(`No season found for leagueId ${leagueId}`);
      }
    },
  },
  week: {
    type: SimpleSchema.Integer,
  },
  poolId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  poolTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userTeamName: {
    label: 'Team name',
    type: String,
  },
  pointsFor: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  pointsAgainst: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  plusMinus: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  gameSummary: {
    type: String,
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
PoolTeamWeeks.attachSchema(PoolTeamWeeks.schema);

/* Access control */
// Deny all client-side updates since we will be using methods to manage this collection
PoolTeamWeeks.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
