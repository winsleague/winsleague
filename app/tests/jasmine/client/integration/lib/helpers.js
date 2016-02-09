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

createMethodResultHandler = (done, hook) => {
  return (error, result) => {
    if (error) {
      log.error(error);
    }
    if (hook) {
      hook(error, result);
    }
    done(error, result);
  };
};

resetTestingEnvironment = (done) => {
  Meteor.call('resetTestingEnvironment', createMethodResultHandler(done));
  log.debug(`called resetTestingEnvironment`);
};

createDefaultLeagues = (done) => {
  Meteor.call('fixtures/leagues/createDefault', createMethodResultHandler(done));
  log.debug(`called createDefaultLeagues`);
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

createOldSeason = (done) => {
  Meteor.call('fixtures/seasons/createOld', createMethodResultHandler(done));
  log.debug(`called createOldSeason`);
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
    'fixtures/poolTeams/createDefault',
    createMethodResultHandler(done, (error, poolTeam) => {
      this.poolTeam = poolTeam;
    })
  );
  log.debug(`called createDefaultPoolTeam`);
};

createOldPoolTeam = (done) => {
  Meteor.call(
    'fixtures/poolTeams/createOld',
    createMethodResultHandler(done, (error, poolTeam) => {
      this.poolTeam = poolTeam;
    })
  );
  log.debug(`called createOldPoolTeam`);
};
