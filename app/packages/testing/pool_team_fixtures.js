function createPoolTeam(poolTeam) {
  log.debug(`Creating poolTeam:`, poolTeam);
  const poolTeamId = PoolTeams.insert(poolTeam);
  log.debug(`poolTeamId: ${poolTeamId}`);
  return PoolTeams.findOne(poolTeamId);
}

function createDefaultPoolTeam() {
  const leagueId = Leagues.findOne()._id;
  const poolId = Pools.findOne({ leagueId })._id;
  const leagueTeamId = LeagueTeams.findOne({ leagueId })._id;
  const poolTeam = {
    leagueId,
    poolId,
    userTeamName: 'test',
    userId: getDefaultUserId(),
    leagueTeamIds: [leagueTeamId],
  };

  return createPoolTeam(poolTeam);
}

function createOldPoolTeam() {
  const leagueId = Leagues.findOne()._id;
  const seasonYear = 2014;
  const seasonId = Seasons.findOne({ leagueId, year: seasonYear })._id;
  const poolId = Pools.findOne({ leagueId })._id;
  const leagueTeamId = LeagueTeams.findOne({ leagueId })._id;
  const poolTeam = {
    leagueId,
    seasonId,
    seasonYear,
    poolId,
    userTeamName: 'old test',
    userId: getDefaultUserId(),
    leagueTeamIds: [leagueTeamId],
  };

  return createPoolTeam(poolTeam);
}

Meteor.methods({
  'fixtures/poolTeams/create': createPoolTeam,
  'fixtures/poolTeams/createDefault': createDefaultPoolTeam,
  'fixtures/poolTeams/createOld': createOldPoolTeam,
});
