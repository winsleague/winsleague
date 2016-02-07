function createPoolTeam(poolTeam) {
  log.debug(`Creating poolTeam:`, poolTeam);
  const poolTeamId = PoolTeams.insert(poolTeam);
  log.debug(`poolTeamId: ${poolTeamId}`);
  return PoolTeams.findOne(poolTeamId);
}

function createDefaultPoolTeam() {
  const leagueId = Leagues.findOne({}, { fields: { _id: 1 } })._id;
  const poolId = Pools.findOne({ leagueId }, { fields: { _id: 1 } })._id;
  const leagueTeamId = LeagueTeams.findOne({ leagueId }, { fields: { _id: 1 } })._id;
  const poolTeam = {
    leagueId,
    poolId,
    userTeamName: 'test',
    userId: Meteor.userId(),
    leagueTeamIds: [leagueTeamId],
  };

  return createPoolTeam(poolTeam);
}

Meteor.methods({
  'fixtures/pool_teams/create': createPoolTeam,
  'fixtures/pool_teams/createDefault': createDefaultPoolTeam,
});
