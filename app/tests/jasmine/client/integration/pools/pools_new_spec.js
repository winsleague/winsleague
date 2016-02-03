const page = {
  getFirstLeagueSelector() {
    return 'input[name="leagueId"]:first';
  },
  getNameSelector() {
    return 'input[name="name"]';
  },
};

describe('poolsNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(goToPoolsNewPage);

  it('should display the league field', done => {
    waitForElement(page.getFirstLeagueSelector(), done);
  });

  it('should display the name field', done => {
    waitForElement(page.getNameSelector(), done);
  });

  it('should create new pool', (done) => {
    const poolName = 'Dummy';
    $(page.getNameSelector()).val(poolName);
    $('form').submit();

    waitForSubscription(Pools.find({}), function() {
      const pool = Pools.findOne({ name: poolName });
      expect(pool).not.toBe(undefined, 'pool');
      expect(pool.leagueId).not.toBe(undefined, 'leagueId');
      done();
    });
  });
});
