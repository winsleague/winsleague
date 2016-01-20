const page = {
  getFirstLeagueField() {
    return $('input[name="leagueId"]:first');
  },
  getNameField() {
    return $('input[name="name"]');
  },
};

describe('pools new page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(goToPoolsNewPage);

  it('should display the form field', () => {
    expect(page.getFirstLeagueField().is(':visible')).toBe(true);
    expect(page.getNameField().is(':visible')).toBe(true);
  });

  it('should create new pool', () => {
    const poolName = 'Dummy';
    page.getNameField().val(poolName);
    $('form').submit();

    const pool = Pools.findOne({ name: poolName });
    expect(pool).not.toBe(undefined);
  });
});
