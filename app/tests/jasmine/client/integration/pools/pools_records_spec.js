const page = {
  getMostWinsAllTimeHeaderSelector: () => `table#pool_users_most_wins_all_time`,
  getMostLossesAllTimeHeaderSelector: () => `table#pool_users_most_losses_all_time`,
  getBestPlusMinusAllTimeHeaderSelector: () => `table#pool_users_best_plus_minus_all_time`,
  getWorstPlusMinusAllTimeHeaderSelector: () => `table#pool_users_worst_plus_minus_all_time`,
};

fdescribe('poolsRecord page', () => {
  beforeEach(loginWithDefaultUser); // needed so we have a subscription to the Pools collection
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsRecordsPage);

  it('should display the teams with the most wins of all time', done => {
    waitForElement(page.getMostWinsAllTimeHeaderSelector(), function() {
      done();
    });
  });

  it('should display the teams with the most losses of all time', done => {
    waitForElement(page.getMostLossesAllTimeHeaderSelector(), function() {
      done();
    });
  });

  it('should display the teams with the best point differential of all time', done => {
    waitForElement(page.getBestPlusMinusAllTimeHeaderSelector(), function() {
      done();
    });
  });

  it('should display the teams with the worst point differential of all time', done => {
    waitForElement(page.getWorstPlusMinusAllTimeHeaderSelector(), function() {
      done();
    });
  });
});
