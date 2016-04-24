import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Pools = new Mongo.Collection('pools');

Pools.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'League',
    autoform: {
      type: 'select-radio-inline',
    },
  },
  name: {
    type: String,
    max: 50,
  },
  commissionerUserId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && this.isSet === false) {
        return Meteor.userId(); // so we can easily stub this in tests
      }
    },
  },
  latestSeasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && ! this.isSet) {
        // select latest season for league
        const leagueIdField = this.field('leagueId');
        if (leagueIdField.isSet) {
          const leagueId = leagueIdField.value;
          const latestSeason = Modules.seasons.getLatestByLeagueId(leagueId);
          if (latestSeason) return latestSeason._id;
          throw new Error(`No season found for leagueId ${leagueId}`);
        }
        this.unset();
      }
    },
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

Pools.attachSchema(Pools.schema);

if (Meteor.isServer) {
  Pools.allow({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return (userId === doc.commissionerUserId);
    },

    remove(userId, doc) {
      return (userId === doc.commissionerUserId);
    },
  });
}
