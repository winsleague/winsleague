PoolLeagueTeams = new Mongo.Collection('pool_league_teams');

PoolLeagueTeams.attachSchema(new SimpleSchema({
  poolId: { type: String },
  userId: { type: String },
  leagueTeamId: { type: String },
  pickNumber: { type: Number }
}));

if (Meteor.isServer) {
  PoolLeagueTeams.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  PoolLeagueTeams.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
