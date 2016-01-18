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

function createMethodResultHandler(done, hook) {
  return function funcHandler(error, result) {
    if (error) {
      console.error(error);
    }
    if (hook) {
      hook(error, result);
    }
    done(error, result);
  };
}

deferAfterFlush = function(callback) {
  Tracker.afterFlush(function () {
    Meteor.defer(callback);
  });
};

resetTestingEnvironment = function(done) {
  Meteor.call('resetTestingEnvironment', createMethodResultHandler(done));
};

createDefaultLeagues = function() {
  Meteor.call('fixtures/leagues/createDefault');
};

createDefaultPool = function(done) {
  var self = this;

  Meteor.call(
    'fixtures/pools/createDefault',
    createMethodResultHandler(done, function (error, pool) {
      self.pool = pool;
    })
  );
};

createDefaultUser = function(done) {
  var self = this;

  Meteor.call(
    'fixtures/users/createDefault',
    createMethodResultHandler(done, function (error, user) {
      self.user = user;
    })
  );
};

loginWithDefaultUser = function(done) {
  Meteor.loginWithPassword(
    'test@test.com',
    'test',
    createMethodResultHandler(done)
  );
};

waitForRouter = function(done) {
  Tracker.autorun(function (computation) {
    if (FlowRouter.subsReady()) {
      computation.stop();
      deferAfterFlush(done);
    }
  });
};

goToRoute = function(pathDef, params, queryParams) {
  return function (done) {
    queryParams = queryParams || {};
    queryParams.jasmine = true;
    FlowRouter.go(pathDef, params, queryParams);
    waitForRouter(done);
  };
};

goToPoolsNewPage = function(done) {
  return goToRoute('/pools/new')(done);
};
