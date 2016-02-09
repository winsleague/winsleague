const page = {
  getPoolTeamRowSelector: poolTeamId => `tr[id="${poolTeamId}"]`,
  getSeasonSwitcherSelector: seasonId => `a[id="${seasonId}"]`,
  getSecondPoolTeamRowSelector: () => `tr:nth-child(2)`,
};

describe('poolsShow page', () => {
  beforeEach(loginWithDefaultUser); // needed so we have a subscription to the Pools collection
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsShowPage);

  it('should display the list of pool teams', done => {
    waitForSubscription(PoolTeams.find(), function() {
      const poolTeam = PoolTeams.findOne();
      waitForElement(page.getPoolTeamRowSelector(poolTeam._id), done);
    });
  });

  fdescribe('when a pool spans multiple seasons', () => {
    beforeEach(createOldSeason);
    beforeEach(createOldPoolTeam);

    it('should allow user to switch seasons', done => {
      waitForSubscription(Seasons.find({ year: 2014 }), function() {
        const season = Seasons.findOne({ year: 2014 });
        waitForElement(page.getSeasonSwitcherSelector(season._id), done);
      });
    });
  });
});
