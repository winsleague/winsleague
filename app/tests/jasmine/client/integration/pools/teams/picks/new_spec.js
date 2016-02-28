const page = {
  getFirstLeagueTeamSelector: () => 'select[name="leagueTeamId"]',
  getFirstPickNumberSelector: () => 'select[name="pickNumber"]',
};

describe('poolTeamPicksNew page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultSeasonLeagueTeam);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsShowPage);
  beforeEach(goToPoolTeamPicksNewPage);

  it('should create new pool team pick', done => {
    let leagueTeamId;

    waitForSubscription(LeagueTeams.find(), function() {
      // choose first team
      leagueTeamId = LeagueTeams.findOne()._id;
      $(page.getFirstLeagueTeamSelector()).find('option:eq(1)').prop('selected', true);

      // change to pick number #2
      $(page.getFirstPickNumberSelector()).find('option:eq(2)').prop('selected', true);

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
