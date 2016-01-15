PoolTeams = new Mongo.Collection('pool_teams');

PoolTeams.attachSchema(new SimpleSchema({
  leagueId: { type: String },
  seasonId: { type: String },
  poolId: { type: String },
  userId: { type: String },
  userTeamName: { type: String },
  leagueTeamIds: {
    type: [String],
    autoform: {
      minCount: 1,
      maxCount: 4,
      initialCount: 4
    }
  },
  'leagueTeamIds.$': {
    autoform: {
      afFieldInput: {
        options: function() {
          return LeagueTeams.find({}).map( function(leagueTeam) { return { label: `${leagueTeam.cityName} ${leagueTeam.mascotName}`, value: leagueTeam._id } } );
        }
      }
    }
  },
  pickNumbers: { type: [Number] },
  leagueTeamMascotNames: { type: [String], defaultValue: [] },
  totalWins: { type: Number, defaultValue: 0 },
  totalGames: { type: Number, defaultValue: 0 },
  totalPlusMinus: { type: Number, defaultValue: 0 },
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

PoolTeams.helpers({
  teamSummary: function () {
    let string = '';
    for (var i = 0; i < this.leagueTeamMascotNames.length; i++) {
      string += `${this.leagueTeamMascotNames[i]} #${this.pickNumbers[i]}, `;
    }
    if (string.length > 0)
      string = string.substr(0, string.length - 2);
    return string;
  }
});

if (Meteor.isServer) {
  PoolTeams.allow({
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

  PoolTeams.deny({
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
