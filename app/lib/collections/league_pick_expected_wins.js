LeaguePickExpectedWins = new Mongo.Collection('league_pick_expected_wins');

LeaguePickExpectedWins.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  rank: { type: Number },
  wins: { type: Number, decimal: true },
}));

if (Meteor.isServer) {
  LeaguePickExpectedWins.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      return false;
    },

    remove(userId, doc) {
      return false;
    },
  });
}
