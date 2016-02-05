Template.poolTeamsEdit.events({
});

PoolTeams.updateFormSchema = new SimpleSchema({
  poolId: { type: String, regEx: SimpleSchema.RegEx.Id },
  userTeamName: { label: 'Team name', type: String },
  userEmail: { label: 'Email', type: String, regEx: SimpleSchema.RegEx.Email },
  leagueTeamIds: {
    label: 'Drafted teams',
    type: [String],
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
          return LeagueTeams.find({}, { sort: ['cityName', 'asc'] }).map(function (leagueTeam) {
            return { label: leagueTeam.fullName(), value: leagueTeam._id };
          });
        },
      },
    },
  },
});

Template.poolTeamsEdit.helpers({
  updatePoolTeamSchema: PoolTeams.updateFormSchema,
  poolId: () => Template.instance().getPoolId(),
  poolTeamDoc: () => Template.instance().getPoolTeamDoc(),
});

Template.poolTeamsEdit.onCreated(function() {
  this.getPoolId = () => FlowRouter.getParam('poolId');
  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');
  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;
  this.getPoolTeamDoc = () => PoolTeams.findOne(this.getPoolTeamId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.info(`pools.single subscription ready: ${Pools.find().count()} pools`);
      this.subscribe('leagueTeams.of_league', this.getLeagueId(), () => {
        log.info(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });
    this.subscribe('poolTeams.single', this.getPoolTeamId(), () => {
      log.info(`poolTeams.single subscription ready`);
    });
  });
});

Template.poolTeamsEdit.onRendered(function() {
});

Template.poolTeamsEdit.onDestroyed(function() {
});


AutoForm.hooks({
  updatePoolTeamForm: {
    onSuccess: (operation, doc) => {
      FlowRouter.go('poolsShow', { _id: FlowRouter.getParam('poolId') });
    },
  },
});
