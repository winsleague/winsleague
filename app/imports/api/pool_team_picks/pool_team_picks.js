import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Factory } from 'meteor/dburles:factory';
import log from '../../utils/log';

import { LeagueTeams } from '../league_teams/league_teams';
import { SeasonLeagueTeams } from '../season_league_teams/season_league_teams';
import { PoolTeams } from '../pool_teams/pool_teams';
import { Pools } from '../pools/pools';
import { Seasons } from '../seasons/seasons';

export const PoolTeamPicks = new Mongo.Collection('pool_team_picks');

PoolTeamPicks.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert) {
        return PoolTeams.findOne(this.field('poolTeamId').value).leagueId;
      }
    },
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && ! this.isSet) {
        return PoolTeams.findOne(this.field('poolTeamId').value).seasonId;
      }
    },
  },
  seasonYear: {
    type: Number,
    autoValue() {
      if (this.isInsert && ! this.isSet) {
        const seasonIdField = this.field('seasonId');
        if (seasonIdField.isSet) {
          const seasonId = seasonIdField.value;
          const season = Seasons.findOne(seasonId);
          if (season) return season.year;
          throw new Error(`No season found for seasonId ${seasonId}`);
        }
      }
    },
  },
  poolId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && ! this.isSet) {
        return PoolTeams.findOne(this.field('poolTeamId').value).poolId;
      }
    },
  },
  poolTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  leagueTeamId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Drafted team',
    autoform: {
      afFieldInput: {
        options() {
          return LeagueTeams.find({}, { sort: ['cityName', 'asc'] }).map(leagueTeam => ({
            label: leagueTeam.fullName(),
            value: leagueTeam._id,
          }));
        },
      },
    },
  },
  pickNumber: {
    type: Number,
    label: 'Pick number',
    autoform: {
      afFieldInput: {
        options() {
          return _.range(1, LeagueTeams.find().count() + 1).map(number => ({
            label: number,
            value: number,
          }));
        },
      },
    },
  },
  actualWins: {
    type: Number,
    defaultValue: 0,
  },
  expectedWins: {
    type: Number,
    decimal: true,
    defaultValue: 0,
  },
  pickQuality: {
    type: Number,
    decimal: true,
    defaultValue: 0,
  },
  actualLosses: {
    type: Number,
    defaultValue: 0,
  },
  actualTies: {
    type: Number,
    defaultValue: 0,
  },
  plusMinus: {
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

PoolTeamPicks.attachSchema(PoolTeamPicks.schema);

PoolTeamPicks.helpers({
  record() {
    if (this.actualTies > 0) {
      return `${this.actualWins}-${this.actualLosses}-${this.actualTies}`;
    }
    return `${this.actualWins}-${this.actualLosses}`;
  },
});

/* Access control */
function isPoolTeamOwner(userId, poolTeamId) {
  const poolTeam = PoolTeams.findOne(poolTeamId);
  return userId === poolTeam.userId;
}

function isCommissioner(userId, poolId) {
  const pool = Pools.findOne(poolId);
  return userId === pool.commissionerUserId;
}

if (Meteor.isServer) {
  PoolTeamPicks.allow({
    insert(userId, doc) {
      return isPoolTeamOwner(userId, doc.poolTeamId) ||
        isCommissioner(userId, doc.poolId);
    },

    update(userId, doc, fieldNames, modifier) {
      return isPoolTeamOwner(userId, doc.poolTeamId) ||
        isCommissioner(userId, doc.poolId);
    },

    remove(userId, doc) {
      return isPoolTeamOwner(userId, doc.poolTeamId) ||
        isCommissioner(userId, doc.poolId);
    },
  });
}


Factory.define('poolTeamPick', PoolTeamPicks, {
  poolTeamId: Factory.get('poolTeam'),
  leagueTeamId: Factory.get('leagueTeam'),
  pickNumber() { return _.random(1, 32); },
}).after(factory => {
  log.debug('poolTeamPick factory created:', factory);
});
