const page = {
  getUserTeamNameSelector() {
    return 'input[name="userTeamName"]';
  },
  getFirstLeagueTeamSelector() {
    return 'select[name="leagueTeamIds.0"]';
  },
};

fdescribe('poolTeamsEdit page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsShowPage); // needed so we get subscription to PoolTeams
  beforeEach(goToPoolTeamsEditPage);

  it('should create edit pool team', done => {
    const userTeamName = "Billy's Dummies";
    let leagueTeamId;

    waitForSubscription(PoolTeams.find({}), function() {
      log.info('form loaded');

      $(page.getUserTeamNameSelector()).val(userTeamName);

      // select second team
      leagueTeamId = LeagueTeams.find({}, { skip: 1, limit: 1 })._id;
      $(page.getFirstLeagueTeamSelector()).find('option:eq(2)').prop('selected', true);

      $('form').submit();
      log.info('form submitted!');

      waitForSubscription(PoolTeams.find(), function() {
        const poolTeam = PoolTeams.findOne({ userTeamName });
        expect(poolTeam).not.toBe(undefined);
        log.info(`poolTeam: `, poolTeam);
        expect(poolTeam.userTeamName).toBe(userTeamName, 'userTeamName');
        expect(poolTeam.leagueTeamIds[0]).toBe(leagueTeamId, 'leagueTeamId');

        done();
      });
    });
  });
});
