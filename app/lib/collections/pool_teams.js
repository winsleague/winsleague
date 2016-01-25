PoolTeams = new Mongo.Collection('pool_teams');

PoolTeams.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert) {
        return Pools.findOne(this.field('poolId').value).leagueId;
      }
    },
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert) {
        return Pools.findOne(this.field('poolId').value).seasonId;
      }
    },
  },
  poolId: { type: String, regEx: SimpleSchema.RegEx.Id },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userTeamName: {
    label: 'Team name',
    type: String,
  },
  leagueTeamIds: {
    label: 'Drafted teams',
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      minCount: 1,
      maxCount: 4,
      initialCount: 4,
    },
  },
  'leagueTeamIds.$': {
    autoform: {
      afFieldInput: {
        options() {
          return LeagueTeams.find({}).map(leagueTeam => {
            return { label: leagueTeam.fullName(), value: leagueTeam._id };
          });
        },
      },
    },
  },
  pickNumbers: {
    type: [Number],
    autoValue() {
      // TODO: this is placeholder until we wire this up
      if (this.isInsert) {
        let numbers = [];
        for (let leagueTeamId of this.field('leagueTeamIds').value) {
          numbers.push(0);
        }
        return numbers;
      }
    },
  },
  leagueTeamMascotNames: {
    type: [String],
    autoValue() {
      if (this.isInsert) {
        let mascots = [];
        for (let leagueTeamId of this.field('leagueTeamIds').value) {
          const leagueTeam = LeagueTeams.findOne(leagueTeamId);
          mascots.push(leagueTeam.mascotName);
        }
        return mascots;
      }
    },
  },
  totalWins: { type: Number, defaultValue: 0 },
  totalGames: { type: Number, defaultValue: 0 },
  totalPlusMinus: { type: Number, defaultValue: 0 },
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
PoolTeams.attachSchema(PoolTeams.schema);

PoolTeams.helpers({
  teamSummary() {
    let string = '';
    for (let i = 0; i < this.leagueTeamMascotNames.length; i++) {
      string += `${this.leagueTeamMascotNames[i]} #${this.pickNumbers[i]}, `;
    }
    if (string.length > 0) string = string.substr(0, string.length - 2);
    return string;
  },
});

if (Meteor.isServer) {
  PoolTeams.allow({
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

  PoolTeams.deny({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove(userId, doc) {
      return true;
    },
  });
}
