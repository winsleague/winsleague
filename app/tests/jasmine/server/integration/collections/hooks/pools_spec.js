describe('Pool collection hooks', () => {
  beforeEach(Package.testing.Fixtures.pools.createDefaultPool);
  beforeEach(Package.testing.Fixtures.poolTeams.createDefaultPoolTeam);

  it('should remove its PoolTeams when Pool is removed', () => {
    const poolId = Pools.findOne()._id;

    let poolTeamsCount = PoolTeams.find({ poolId }).count();
    expect(poolTeamsCount).toBe(1);

    Pools.remove(poolId);

    poolTeamsCount = PoolTeams.find({ poolId }).count();
    expect(poolTeamsCount).toBe(0);
  });
});
