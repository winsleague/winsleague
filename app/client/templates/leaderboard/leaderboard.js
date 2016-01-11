/*****************************************************************************/
/* Leaderboard: Event Handlers */
/*****************************************************************************/
Template.Leaderboard.events({
});

/*****************************************************************************/
/* Leaderboard: Helpers */
/*****************************************************************************/
Template.Leaderboard.helpers({
  poolUserTeams: () => { return PoolUserTeams.find() }
});

/*****************************************************************************/
/* Leaderboard: Lifecycle Hooks */
/*****************************************************************************/
Template.Leaderboard.onCreated(function () {
  this.subscribe('leaderboard', function(){
    log.info(`Leaderboard data ready: ${PoolUserTeams.find().count()} teams`);
  });
});

Template.Leaderboard.onRendered(function () {
});

Template.Leaderboard.onDestroyed(function () {
});
