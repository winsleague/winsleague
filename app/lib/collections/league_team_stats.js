LeagueTeamStats = new Mongo.Collection('league_team_stats');

LeagueTeamStats.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  leagueTeamId: { type: String },
  totalWins: { type: Number },
  totalGames: { type: Number },
  totalPlusMinus: { type: Number }
}));

if (Meteor.isServer) {
  LeagueTeamStats.allow({
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

  LeagueTeamStats.deny({
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
