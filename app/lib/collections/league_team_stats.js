LeagueTeamStats = new Mongo.Collection('league_team_stats');

LeagueTeamStats.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  leagueTeamId: { type: String },
  wins: { type: Number },
  losses: { type: Number },
  ties: { type: Number },
  homeWins: { type: Number },
  homeLosses: { type: Number },
  homeTies: { type: Number },
  awayWins: { type: Number },
  awayLosses: { type: Number },
  awayTies: { type: Number },
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
