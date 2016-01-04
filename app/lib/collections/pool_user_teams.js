PoolUserTeams = new Mongo.Collection('pool_user_teams');

PoolUserTeams.attachSchema(new SimpleSchema({
  poolId: { type: String },
  userId: { type: String },
  userTeamName: { type: String }
}));

if (Meteor.isServer) {
  PoolUserTeams.allow({
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

  PoolUserTeams.deny({
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
