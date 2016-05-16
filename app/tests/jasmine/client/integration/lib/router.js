/* globals
 loginWithDefaultUser: true,
 logoutUser: true,
 waitForRouter: true,
 goToRoute: true,
 deferAfterFlush: true,
 goToHomePage: true,
 goToPoolsNewPage: true,
 goToPoolsShowPage: true,
 goToPoolsRecordsPage: true,
 goToPoolsEditPage: true,
 goToPoolTeamsNewPage: true,
 goToPoolTeamsShowPage: true,
 goToPoolTeamsEditPage: true,
 goToPoolTeamPicksNewPage: true,
 goToPoolTeamPicksEditPage: true,
 createMethodResultHandler,
 waitForSubscription,
 */

loginWithDefaultUser = (done) => {
  Meteor.loginWithPassword(
    'test@test.com',
    'test',
    createMethodResultHandler(done)
  );
  log.debug(`called loginWithDefaultUser`);
};

logoutUser = () => {
  Meteor.logout();
  log.debug(`called logoutUser`);
};

waitForRouter = done => {
  Tracker.autorun((computation) => {
    if (FlowRouter.subsReady()) {
      computation.stop();
      deferAfterFlush(done);
    }
  });
  log.debug(`called waitForRouter`);
};

goToRoute = (pathDef, params, queryParams) => {
  return (done) => {
    const newQueryParams = queryParams || {};
    newQueryParams.jasmine = true;
    log.info(`Navigating to ${pathDef}/`, params);
    FlowRouter.go(pathDef, params, newQueryParams);
    waitForRouter(done);
  };
};

deferAfterFlush = (callback) => {
  Tracker.afterFlush(() => {
    Meteor.defer(callback);
  });
};

goToHomePage = done => {
  return goToRoute('/')(done);
};

goToPoolsNewPage = done => {
  return goToRoute('poolsNew')(done);
};

goToPoolsShowPage = done => {
  log.debug('goToPoolsShowPage called');
  waitForSubscription(Pools.find(), function () {
    const pool = Pools.findOne();
    const poolId = pool._id;

    return goToRoute('Pools.show', { poolId })(done);
  });
};

goToPoolsRecordsPage = done => {
  log.debug('goToPoolsRecordsPage called');
  waitForSubscription(Pools.find(), function () {
    const pool = Pools.findOne();
    const poolId = pool._id;

    return goToRoute('poolsRecords', { poolId })(done);
  });
};

goToPoolsEditPage = done => {
  log.debug('goToPoolsEditPage called');
  waitForSubscription(Pools.find(), function () {
    const pool = Pools.findOne();
    const poolId = pool._id;

    return goToRoute('poolsEdit', { poolId })(done);
  });
};

goToPoolTeamsNewPage = done => {
  log.debug('goToPoolsShowPage called');
  waitForSubscription(Pools.find(), function () {
    const pool = Pools.findOne();
    const poolId = pool._id;

    return goToRoute('poolTeamsNew', { poolId })(done);
  });
};

goToPoolTeamsShowPage = done => {
  log.debug('goToPoolTeamsShowPage called');
  waitForSubscription(PoolTeams.find(), function () {
    const pool = PoolTeams.findOne();
    const poolId = pool.poolId;
    const poolTeamId = pool._id;

    return goToRoute('poolTeamsShow', { poolId, poolTeamId })(done);
  });
};

goToPoolTeamsEditPage = done => {
  log.debug('goToPoolTeamsEditPage called');
  waitForSubscription(PoolTeams.find(), function () {
    const poolTeam = PoolTeams.findOne();
    const poolId = poolTeam.poolId;
    const poolTeamId = poolTeam._id;

    return goToRoute('poolTeamsEdit', { poolId, poolTeamId })(done);
  });
};

goToPoolTeamPicksNewPage = done => {
  log.debug('goToPoolTeamPicksNewPage called');
  waitForSubscription(PoolTeams.find(), function () {
    const poolTeam = PoolTeams.findOne();
    const poolId = poolTeam.poolId;
    const poolTeamId = poolTeam._id;

    return goToRoute('poolTeamPicksNew', { poolId, poolTeamId })(done);
  });
};

goToPoolTeamPicksEditPage = done => {
  log.debug('goToPoolTeamPicksEditPage called');
  waitForSubscription(PoolTeamPicks.find(), function () {
    const poolTeamPick = PoolTeamPicks.findOne();
    const poolId = poolTeamPick.poolId;
    const poolTeamId = poolTeamPick.poolTeamId;
    const poolTeamPickId = poolTeamPick._id;

    return goToRoute('poolTeamPicksEdit', { poolId, poolTeamId, poolTeamPickId })(done);
  });
};
