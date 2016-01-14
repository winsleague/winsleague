/*****************************************************************************/
/* Leaderboard: Event Handlers */
/*****************************************************************************/
Template.leaderboard.events({
});

/*****************************************************************************/
/* Leaderboard: Helpers */
/*****************************************************************************/
Template.leaderboard.helpers({
  poolUserTeams: () => { return PoolUserTeams.find() }
});

/*****************************************************************************/
/* Leaderboard: Lifecycle Hooks */
/*****************************************************************************/
Template.leaderboard.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('leaderboard', function () {
      log.info(`Leaderboard data ready: ${PoolUserTeams.find().count()} teams`);
    });
  });
});

Template.leaderboard.onRendered(function () {
});

Template.leaderboard.onDestroyed(function () {
});
