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
    queryParams = queryParams || {};
    queryParams.jasmine = true;
    log.info(`Navigating to ${pathDef}/`, params);
    FlowRouter.go(pathDef, params, queryParams);
    waitForRouter(done);
  };
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
    const _id = pool._id;

    return goToRoute('poolsShow', { _id })(done);
  });
};

goToPoolsEditPage = done => {
  log.debug('goToPoolsEditPage called');
  waitForSubscription(Pools.find(), function () {
    const pool = Pools.findOne();
    const _id = pool._id;

    return goToRoute('poolsEdit', { _id })(done);
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

goToPoolTeamsEditPage = done => {
  log.debug('goToPoolTeamsEditPage called');
  waitForSubscription(PoolTeams.find(), function () {
    const poolTeam = PoolTeams.findOne();
    const poolId = poolTeam.poolId;
    const poolTeamId = poolTeam._id;

    return goToRoute('poolTeamsEdit', { poolId, poolTeamId })(done);
  });
};
