describe('Pool Team collection hooks', () => {
  beforeEach(Package.testing.Fixtures.pools.createDefaultPool);
  beforeEach(Package.testing.Fixtures.poolTeams.createDefaultPoolTeam);
  beforeEach(Package.testing.Fixtures.poolTeamPicks.createDefaultPoolTeamPick);

  let spec;
  spec = it('should remove its PoolTeamPicks when PoolTeam is removed', () => {
    log.info('spec:', spec.description);

    const poolTeamId = PoolTeams.findOne()._id;

    let poolTeamPicksCount = PoolTeamPicks.find({ poolTeamId }).count();
    expect(poolTeamPicksCount).toBe(1);

    PoolTeams.remove(poolTeamId);

    poolTeamPicksCount = PoolTeamPicks.find({ poolTeamId }).count();
    expect(poolTeamPicksCount).toBe(0);
  });
});
