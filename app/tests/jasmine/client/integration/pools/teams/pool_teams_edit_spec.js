const page = {
  getUserTeamNameSelector() {
    return 'input[name="userTeamName"]';
  },
  getFirstLeagueTeamSelector() {
    return 'select[name="leagueTeamIds.0"]';
  },
};

describe('poolTeamsEdit page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(goToPoolsShowPage); // needed so we get subscription to PoolTeams
  beforeEach(goToPoolTeamsEditPage);

  it('should edit a pool team', done => {
    const userTeamName = "Billy's Dummies";
    let leagueTeamId;

    waitForSubscription(PoolTeams.find(), function() {
      $(page.getUserTeamNameSelector()).val(userTeamName);

      // select second team
      $(page.getFirstLeagueTeamSelector()).find('option:eq(2)').prop('selected', true);
      leagueTeamId = LeagueTeams.findOne({}, { sort: ['cityName', 'asc'], skip: 1 })._id;
      log.info(`expecting leagueTeamId: ${leagueTeamId}`);

      $('form').submit();

      waitForSubscription(PoolTeams.find({ userTeamName }), function() {
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
