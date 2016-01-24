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
  beforeEach(done => {
    setTimeout(() => {
      goToPoolTeamsNewPage(done);
    }, DEFAULT_DELAY);
  });

  it('should create new pool team', done => {
    const userEmail = 'dummy@dummy.com';
    const userTeamName = "Dummy's Dummies";
    let leagueTeamId;

    setTimeout(() => {
      page.getUserEmailField().val(userEmail);

      page.getUserTeamNameField().val(userTeamName);

      // select first team
      leagueTeamId = LeagueTeams.findOne({})._id;
      page.getFirstLeagueTeamField().find('option:eq(1)').prop('selected', true);

      $('form').submit();
    }, DEFAULT_DELAY * 2);

    setTimeout(() => {
      const poolTeam = PoolTeams.findOne({ userTeamName });
      expect(poolTeam).not.toBe(undefined);
      log.info(`poolTeam: `, poolTeam);
      expect(poolTeam.userTeamName).toBe(userTeamName);
      expect(poolTeam.leagueTeamIds[0]).toBe(leagueTeamId);

      done();
    }, DEFAULT_DELAY * 5);
  });
});
