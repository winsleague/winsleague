/* globals
 deferAfterFlush: true,
 resetTestingEnvironment: true,
 createDefaultTeam: true,
 createDefaultUser: true,
 loginWithDefaultUser: true,
 logoutUser: true,
 waitForRouter: true,
 goToRoute: true,
 goToDefaultTeamPage: true
 */

// compensate for slight delay in retrieving from database
// http://experimentsinmeteor.com/meteor-testing-with-velocity-and-jasmine-part-1/index.html
DEFAULT_DELAY = 500;

function createMethodResultHandler(done, hook) {
  return (error, result) => {
    if (error) {
      log.error(error);
    }
    if (hook) {
      hook(error, result);
    }
    done(error, result);
  };
}

waitForElement = (selector, successCallback) => {
  var checkInterval = 50;
  var timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  var startTime = Date.now();
  var intervalId = Meteor.setInterval(function () {
    if (Date.now() > startTime + timeoutInterval) {
      Meteor.clearInterval(intervalId);
      // Jasmine will handle the test timeout error
    } else if ($(selector).length > 0) {
      Meteor.clearInterval(intervalId);
      successCallback();
    }
  }, checkInterval);
};

waitForSubscription = (query, successCallback) => {
  var checkInterval = 100;
  var timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  var startTime = Date.now();
  var intervalId = Meteor.setInterval(function () {
    if (Date.now() > startTime + timeoutInterval) {
      Meteor.clearInterval(intervalId);
      // Jasmine will handle the test timeout error
    } else if (query.count() > 0) {
      Meteor.clearInterval(intervalId);
      successCallback();
    }
  }, checkInterval);
};

deferAfterFlush = (callback) => {
  Tracker.afterFlush(() => {
    Meteor.defer(callback);
  });
};

resetTestingEnvironment = (done) => {
  Meteor.call('resetTestingEnvironment', createMethodResultHandler(done));
  log.debug(`called resetTestingEnvironment`);
};

createDefaultLeagues = (done) => {
  Meteor.call('fixtures/leagues/createDefault', createMethodResultHandler(done));
  log.debug(`called createDefaultLeagues`);
};

createDefaultPool = (done) => {
  Meteor.call(
    'fixtures/pools/createDefault',
    createMethodResultHandler(done, (error, pool) => {
      this.pool = pool;
    })
  );
  log.debug(`called createDefaultPool`);
};

createDefaultPoolTeam = (done) => {
  Meteor.call(
    'fixtures/pool_teams/createDefault',
    createMethodResultHandler(done, (error, poolTeam) => {
      this.poolTeam = poolTeam;
    })
  );
  log.debug(`called createDefaultPoolTeam`);
};

createDefaultUser = (done) => {
  Meteor.call(
    'fixtures/users/createDefault',
    createMethodResultHandler(done, (error, user) => {
      this.user = user;
    })
  );
  log.debug(`called createDefaultUser`);
};

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
