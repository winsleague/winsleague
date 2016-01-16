Template.poolTeamsNew.events({
});

Template.poolTeamsNew.helpers({
  insertPoolTeamSchema: () => {
    return new SimpleSchema({
      poolId: { type: String, regEx: SimpleSchema.RegEx.Id },
      userTeamName: { label: "Team name", type: String },
      userEmail: { type: String, regEx: SimpleSchema.RegEx.Email },
      leagueTeamIds: {
        label: "Drafted teams",
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
            options: function () {
              return LeagueTeams.find({}).map(function (leagueTeam) {
                return {label: leagueTeam.fullName(), value: leagueTeam._id}
              });
            }
          }
        }
      }
    });
  },
  leagueId: () => {
    const instance = Template.instance();
    return instance.getPool().leagueId;
  },
  seasonId: () => {
    const instance = Template.instance();
    return instance.getPool().seasonId;
  },
  poolId: () => {
    const instance = Template.instance();
    return instance.getPoolId();
  }
});

Template.poolTeamsNew.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPool = () => Pools.findOne({ _id: this.getPoolId() });

  this.autorun(() => {
    this.subscribe('singlePool', this.getPoolId(), () => {
      log.info(`singlePool subscription ready: ${Pools.find().count()} pools`);
    });
    this.subscribe('leagueTeams', () => {
      log.info(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
    });
  });
});

Template.poolTeamsNew.onRendered(function() {
});

Template.poolTeamsNew.onDestroyed(function() {
});


AutoForm.hooks({
  insertPoolPlayerForm: {
    onSuccess: (operation, poolId) => {
      FlowRouter.go("poolsShow", { _id: poolId });
    }
  }
});
