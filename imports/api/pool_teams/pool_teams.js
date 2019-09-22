import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Pools } from '../pools/pools';
import SeasonFinder from '../seasons/finder';

export const PoolTeams = new Mongo.Collection('pool_teams');

PoolTeams.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        return Pools.findOne(this.field('poolId').value).leagueId;
      }
      return undefined;
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
      return undefined;
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
      return undefined;
    },
  },
  poolId: {
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
  teamSummary: {
    type: String,
    defaultValue: '',
  },
  totalWins: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  totalLosses: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  totalGames: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  totalPickQuality: {
    type: Number,
    defaultValue: 0,
  },
  totalPlusMinus: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  currentRanking: {
    type: SimpleSchema.Integer,
    optional: true, // there's no ranking at the start of the season
  },
  undefeatedWeeks: { // only for NFL
    type: SimpleSchema.Integer,
    optional: true,
    defaultValue: 0,
  },
  defeatedWeeks: { // only for NFL
    type: SimpleSchema.Integer,
    optional: true,
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
}, { tracker: Tracker });

PoolTeams.attachSchema(PoolTeams.schema);

PoolTeams.helpers({
  friendlyTeamName() {
    if (this.currentRanking) {
      return `(${this.currentRanking}) ${this.userTeamName}`;
    }
    return this.userTeamName;
  },
});

PoolTeams.formSchema = new SimpleSchema({
  poolId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userTeamName: {
    label: 'Team name',
    type: String,
  },
  userEmail: {
    label: 'Email',
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
}, { tracker: Tracker });


/* Access control */
if (Meteor.isServer) {
  PoolTeams.allow({
    insert(userId, doc) { return Meteor.isAppTest; },

    update(userId, doc, fieldNames, modifier) {
      // verify userId either owns PoolTeam or is commissioner of pool
      const { poolId } = doc;
      const pool = Pools.findOne(poolId);
      return (userId === doc.userId
        || userId === pool.commissionerUserId);
    },

    remove(userId, doc) {
      // verify userId either owns PoolTeam or is commissioner of pool
      const { poolId } = doc;
      const pool = Pools.findOne(poolId);
      return (userId === doc.userId
        || userId === pool.commissionerUserId);
    },
  });
}
