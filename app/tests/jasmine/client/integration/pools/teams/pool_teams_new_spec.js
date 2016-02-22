const page = {
  getUserEmailSelector() {
    return 'input[name="userEmail"]';
  },
  getUserTeamNameSelector() {
    return 'input[name="userTeamName"]';
  },
  getFirstLeagueTeamSelector() {
    return 'select[name="leagueTeamIds.0"]';
  },
};

describe('poolTeamsNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(goToPoolTeamsNewPage);

  it('should create new pool team', done => {
    const userEmail = 'dummy@dummy.com';
    const userTeamName = "Dummy's Dummies";
    let leagueTeamId;

    waitForSubscription(LeagueTeams.find(), function() {
      log.info('form loaded');

      $(page.getUserEmailSelector()).val(userEmail);

      $(page.getUserTeamNameSelector()).val(userTeamName);

      // select first team
      leagueTeamId = LeagueTeams.findOne()._id;
      $(page.getFirstLeagueTeamSelector()).find('option:eq(1)').prop('selected', true);

      $('form').submit();
      log.info('form submitted!');

      waitForSubscription(PoolTeams.find(), function() {
        const poolTeam = PoolTeams.findOne({ userTeamName });
        expect(poolTeam).not.toBe(undefined, 'poolTeam');
        log.debug(`poolTeam: `, poolTeam);
        expect(poolTeam.userTeamName).toBe(userTeamName, 'userTeamName');
        expect(poolTeam.leagueTeamIds[0]).toBe(leagueTeamId, 'leagueTeamId');

        done();
      });
    });
  });
});
