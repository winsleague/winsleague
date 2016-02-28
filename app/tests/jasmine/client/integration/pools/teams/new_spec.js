const page = {
  getUserEmailSelector: () => 'input[name="userEmail"]',
  getUserTeamNameSelector: () => 'input[name="userTeamName"]',
};

describe('poolTeamsNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(goToPoolTeamsNewPage);

  it('should create new pool team', done => {
    const userEmail = 'dummy@dummy.com';
    const userTeamName = "Dummy's Dummies";

    waitForSubscription(LeagueTeams.find(), function() {
      $(page.getUserEmailSelector()).val(userEmail);
      $(page.getUserTeamNameSelector()).val(userTeamName);

      $('form').submit();
      log.debug('form submitted!');

      waitForSubscription(PoolTeams.find(), function() {
        const poolTeam = PoolTeams.findOne({ userTeamName });
        expect(poolTeam).not.toBe(undefined, 'poolTeam');
        log.debug(`poolTeam: `, poolTeam);
        expect(poolTeam.userTeamName).toBe(userTeamName, 'userTeamName');

        done();
      });
    });
  });
});
