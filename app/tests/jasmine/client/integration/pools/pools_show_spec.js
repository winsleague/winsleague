const page = {
  getPoolTeamRowSelector(_id) {
    return `tr[id="${_id}"]`;
  },
};

fdescribe('poolsShow page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsShowPage);

  it('should display the list of pool teams', done => {
    waitForSubscription(PoolTeams.find(), function() {
      const poolTeam = PoolTeams.findOne();
      waitForElement(page.getPoolTeamRowSelector(poolTeam._id), done);
    });
  });
});
