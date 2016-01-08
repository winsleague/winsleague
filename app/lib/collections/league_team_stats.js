LeagueTeamStats = new Mongo.Collection('league_team_stats');

LeagueTeamStats.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  leagueTeamId: { type: String },
  wins: { type: Number },
  losses: { type: Number },
  home_wins: { type: Number },
  home_losses: { type: Number },
  away_wins: { type: Number },
  away_losses: { type: Number },
  division_wins: { type: Number },
  division_losses: { type: Number },
  pointsFor: { type: Number },
  pointsAgainst: { type: Number }
}));

LeagueTeamStats.helpers({
  gamesPlayed: function () {
    return this.wins + this.losses;
  }
});

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
