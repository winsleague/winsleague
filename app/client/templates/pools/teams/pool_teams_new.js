Template.poolTeamsNew.events({
});

PoolTeams.insertFormSchema = new SimpleSchema({
  poolId: { type: String, regEx: SimpleSchema.RegEx.Id },
  userTeamName: { label: "Team name", type: String },
  userEmail: { label: "Email", type: String, regEx: SimpleSchema.RegEx.Email },
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
          return LeagueTeams.find({}, {sort: ["cityName", "asc"]}).map(function (leagueTeam) {
            return {label: leagueTeam.fullName(), value: leagueTeam._id}
          });
        }
      }
    }
  }
});

Template.poolTeamsNew.helpers({
  insertPoolTeamSchema: PoolTeams.insertFormSchema,
  poolId: () => {
    const instance = Template.instance();
    return instance.getPoolId();
  }
});

Template.poolTeamsNew.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getLeagueId = () => Pools.findOne({ _id: this.getPoolId() }, { fields: { leagueId: 1 } }).leagueId;

  this.autorun(() => {
    this.subscribe('singlePool', this.getPoolId(), () => {
      log.info(`pool subscription ready: ${Pools.find().count()} pools`);
      this.subscribe('leagueTeams', this.getLeagueId(), () => {
        log.info(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
  });
});

Template.poolTeamsNew.onRendered(function() {
});

Template.poolTeamsNew.onDestroyed(function() {
});


AutoForm.hooks({
  insertPoolPlayerForm: {
    onSuccess: (operation, poolTeamId) => {
      // TODO: redirect to poolId, not poolTeamId
      FlowRouter.go("poolsShow", { _id: poolTeamId });
    }
  }
});
