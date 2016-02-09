const prettyjson = Meteor.npmRequire('prettyjson');

describe('Pool collection hooks', () => {
  it('should remove its PoolTeams when Pool is removed', () => {
    const user = Accounts.findUserByEmail('test@test.com');
    spyOn(Meteor, 'userId').and.returnValue(user._id);

    Meteor.call('fixtures/pools/createDefault');
    const poolTeam = Meteor.call('fixtures/poolTeams/createDefault');
    const poolId = poolTeam.poolId;

    let poolTeamsCount = PoolTeams.find({ poolId }).count();
    expect(poolTeamsCount).toBe(1);

    Pools.remove(poolId);

    poolTeamsCount = PoolTeams.find({ poolId }).count();
    expect(poolTeamsCount).toBe(0);
  });
});
