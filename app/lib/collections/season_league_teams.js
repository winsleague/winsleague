SeasonLeagueTeams = new Mongo.Collection('season_league_teams');

SeasonLeagueTeams.attachSchema(new SimpleSchema({
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
  pointsAgainst: { type: Number },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
}));


/*Helpers */
SeasonLeagueTeams.helpers({
  totalGames: function () {
    return this.wins + this.losses + this.ties;
  }
});


/* Hooks */
SeasonLeagueTeams.after.insert(function (userId, doc) {
  Modules.server.poolUserTeams.refreshWhoPickedLeagueTeam(doc.leagueId, doc.seasonId, doc.leagueTeamId);
});

SeasonLeagueTeams.after.update(function (userId, doc, fieldNames, modifier, options) {
  Modules.server.poolUserTeams.refreshWhoPickedLeagueTeam(doc.leagueId, doc.seasonId, doc.leagueTeamId);
}, { fetchPrevious: false });


/* Access control */
if (Meteor.isServer) {
  SeasonLeagueTeams.allow({
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

  SeasonLeagueTeams.deny({
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
