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

describe('poolTeamsNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(goToPoolTeamsNewPage);

  fit('should create new pool team', (done) => {
    setTimeout(() => {
      const userEmail = 'dummy@dummy.com';
      page.getUserEmailField().val(userEmail);

      const userTeamName = "Dummy's Dummies";
      page.getUserTeamNameField().val(userTeamName);

      // select first team
      page.getFirstLeagueTeamField().find('option:eq(1)').prop('selected', true);

      $('form').submit();

      const poolTeam = PoolTeams.findOne({ userEmail });
      expect(poolTeam).not.toBe(undefined);
      log.info(`poolTeam: `, poolTeam);
      expect(poolTeam.userTeamName).toBe(userTeamName);

      const newUser = Accounts.findUserByEmail(userEmail);
      expect(poolTeam.userId).toBe(newUser._id);
      done();
    }, DEFAULT_DELAY);
  });
});
