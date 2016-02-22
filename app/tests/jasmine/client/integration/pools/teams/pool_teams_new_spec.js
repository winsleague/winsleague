const page = {
  getUserEmailSelector: () => 'input[name="userEmail"]',
  getUserTeamNameSelector: () => 'input[name="userTeamName"]',
  getFirstLeagueTeamSelector: () => 'select[name="leagueTeamIds.0"]',
  getFirstPickNumberSelector: () => 'select[name="pickNumbers.0"]',
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
      $(page.getUserEmailSelector()).val(userEmail);
      $(page.getUserTeamNameSelector()).val(userTeamName);

      // choose first team
      leagueTeamId = LeagueTeams.findOne()._id;
      $(page.getFirstLeagueTeamSelector()).find('option:eq(1)').prop('selected', true);

      // change to pick number #2
      $(page.getFirstPickNumberSelector()).find('option:eq(2)').prop('selected', true);

      $('form').submit();
      log.debug('form submitted!');

      waitForSubscription(PoolTeams.find(), function() {
        const poolTeam = PoolTeams.findOne({ userTeamName });
        expect(poolTeam).not.toBe(undefined, 'poolTeam');
        log.debug(`poolTeam: `, poolTeam);
        expect(poolTeam.userTeamName).toBe(userTeamName, 'userTeamName');
        expect(poolTeam.leagueTeamIds[0]).toBe(leagueTeamId, 'leagueTeamId');
        expect(poolTeam.leagueTeamIds[1]).toBe(2, 'pickNumber');

        done();
      });
    });
  });
});
