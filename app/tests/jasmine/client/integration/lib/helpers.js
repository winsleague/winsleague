/* globals
 deferAfterFlush: true,
 resetTestingEnvironment: true,
 createDefaultTeam: true,
 createDefaultUser: true,
 loginWithDefaultUser: true,
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
};

createDefaultUser = (done) => {
  Meteor.call(
    'fixtures/users/createDefault',
    createMethodResultHandler(done, (error, user) => {
      this.user = user;
    })
  );
};

loginWithDefaultUser = (done) => {
  Meteor.loginWithPassword(
    'test@test.com',
    'test',
    createMethodResultHandler(done)
  );
};

waitForRouter = (done) => {
  Tracker.autorun((computation) => {
    if (FlowRouter.subsReady()) {
      computation.stop();
      deferAfterFlush(done);
    }
  });
};

goToRoute = (pathDef, params, queryParams) => {
  return (done) => {
    queryParams = queryParams || {};
    queryParams.jasmine = true;
    log.debug(`Navigating to ${pathDef}/${params}?${queryParams}`);
    FlowRouter.go(pathDef, params, queryParams);
    waitForRouter(done);
  };
};

goToHomePage = (done) => {
  return goToRoute('/')(done);
};

goToPoolsNewPage = (done) => {
  return goToRoute('/pools/new')(done);
};
