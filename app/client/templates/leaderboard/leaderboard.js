/*****************************************************************************/
/* Leaderboard: Event Handlers */
/*****************************************************************************/
Template.Leaderboard.events({
});

/*****************************************************************************/
/* Leaderboard: Helpers */
/*****************************************************************************/
Template.Leaderboard.helpers({
  teams: () => { return PoolUserTeams.find() }
});

/*****************************************************************************/
/* Leaderboard: Lifecycle Hooks */
/*****************************************************************************/
Template.Leaderboard.onCreated(function () {
  this.subscribe('leaderboard', function(){
    log.info(`Leaderboard data ready: ${PoolUserTeams.find().count()}`);
  });
});

Template.Leaderboard.onRendered(function () {
});

Template.Leaderboard.onDestroyed(function () {
});
