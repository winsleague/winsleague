const page = {
  getFirstLeagueField() {
    return $('input[name="leagueId"]');
  },
  getNameField() {
    return $('input[name="name"]');
  },
};

describe('pools new page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(goToPoolsNewPage);

  it('should display the league field', (done) => {
    setTimeout(() => {
      expect(page.getFirstLeagueField()).toExist();
      done();
    }, DEFAULT_DELAY);
  });

  it('should display the name field', (done) => {
    setTimeout(() => {
      expect(page.getNameField()).toExist();
      done();
    }, DEFAULT_DELAY);
  });

  it('should create new pool', (done) => {
    setTimeout(() => {
      const poolName = 'Dummy';
      page.getNameField().val(poolName);
      $('form').submit();

      const pool = Pools.findOne({ name: poolName });
      expect(pool).not.toBe(undefined);
      expect(pool.leagueId).not.toBe(undefined);
      expect(pool.seasonId).not.toBe(undefined);
      done();
    }, DEFAULT_DELAY);
  });
});
