const page = {
  getUserEmailField() {
    return $('input[name="userEmail"]');
  },
  getUserTeamNameField() {
    return $('input[name="userTeamName"]');
  },
  getFirstLeagueTeamField() {
    return $('select[name="leagueTeamIds.0"]');
  },
};

fdescribe('poolTeamsNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(goToPoolTeamsNewPage);
  afterEach(logoutUser);

  it('should create new pool team', (done) => {
    const userEmail = 'dummy@dummy.com';
    const userTeamName = "Dummy's Dummies";

    setTimeout(() => {
      page.getUserEmailField().val(userEmail);

      page.getUserTeamNameField().val(userTeamName);

      // select first team
      page.getFirstLeagueTeamField().find('option:eq(1)').prop('selected', true);

      $('form').submit();
    }, DEFAULT_DELAY);

    setTimeout(() => {
      const poolTeam = PoolTeams.findOne({ userTeamName });
      expect(poolTeam).not.toBe(undefined);
      log.info(`poolTeam: `, poolTeam);
      expect(poolTeam.userTeamName).toBe(userTeamName);

      const newUser = Accounts.findUserByEmail(userEmail);
      expect(poolTeam.userId).toBe(newUser._id);
      done();
    }, DEFAULT_DELAY * 2);
  });
});
