const page = {
  getLeagueTeamSelector: () => 'select[name="leagueTeamId"]',
  getPickNumberSelector: () => 'select[name="pickNumber"]',
};

describe('poolTeamPicksNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsShowPage);
  beforeEach(goToPoolTeamPicksNewPage);

  it('should create new pool team pick', done => {
    waitForSubscription(LeagueTeams.find(), function() {
      // choose first team
      const leagueTeamId = LeagueTeams.findOne()._id;
      $(page.getLeagueTeamSelector()).find('option:eq(1)').prop('selected', true);

      // change to pick number #2
      $(page.getPickNumberSelector()).find('option:eq(2)').prop('selected', true);

      $('form').submit();
      log.debug('form submitted!');

      waitForSubscription(PoolTeamPicks.find(), function() {
        const poolTeamPick = PoolTeamPicks.findOne();
        expect(poolTeamPick).not.toBe(undefined, 'poolTeamPick');
        log.debug(`poolTeamPick: `, poolTeamPick);
        expect(poolTeamPick.leagueTeamId).toBe(leagueTeamId, 'leagueTeamId');
        expect(poolTeamPick.pickNumber).toBe(2, 'pickNumber');

        done();
      });
    });
  });
});
