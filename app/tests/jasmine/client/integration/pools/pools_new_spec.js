const page = {
  getLeagueField() {
    return $('input[name="leagueId"]');
  },
  getNameField() {
    return $('input[name="name"]');
  },
};

describe('pools new page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(goToPoolsNewPage);

  it('should display the leagues field', () => {
    expect(page.getLeagueField().is(':visible')).toBe(true);
  });

  it('should display the name field', () => {
    expect(page.getNameField().is(':visible')).toBe(true);
  });
});
