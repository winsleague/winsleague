describe('Weekly Report', () => {
  beforeEach(Package.testing.Fixtures.pools.createDefaultPool);
  beforeEach(Package.testing.Fixtures.poolTeams.createDefaultPoolTeam);

  it('puts together player emails', () => {
    const poolTeam = PoolTeams.findOne();
    const poolId = poolTeam.poolId;
    const seasonId = poolTeam.seasonId;

    const email = 'another@user.com';
    Accounts.createUser({ email });
    const anotherUserId = Accounts.findUserByEmail(email)._id;

    PoolTeams.insert({
      leagueId: poolTeam.leagueId,
      poolId,
      userTeamName: 'another user',
      userId: anotherUserId,
    });

    const playerEmails = Modules.server.weeklyReport.getPlayerEmails(poolId, seasonId);

    expect(playerEmails).toBe('test <test@test.com>, another user <another@user.com>');
  });
});
