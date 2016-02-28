function createPoolTeamPick(poolTeamPick) {
  log.debug(`Creating poolTeamPick:`, poolTeamPick);
  const poolTeamPickId = PoolTeamPicks.insert(poolTeamPick);
  log.debug(`poolTeamPickId: ${poolTeamPickId}`);
  return PoolTeamPicks.findOne(poolTeamPickId);
}

function createDefaultPoolTeamPick() {
  const leagueId = Leagues.findOne()._id;
  const poolTeamId = PoolTeams.findOne({ leagueId })._id;
  const leagueTeamId = LeagueTeams.findOne({ leagueId })._id;
  const poolTeamPick = {
    poolTeamId,
    leagueTeamId,
    pickNumber: 1,
  };

  return createPoolTeamPick(poolTeamPick);
}

Fixtures.poolTeamPicks = {
  createPoolTeamPick,
  createDefaultPoolTeamPick,
};

Meteor.methods({
  'fixtures/poolTeamPicks/create': createPoolTeamPick,
  'fixtures/poolTeamPicks/createDefault': createDefaultPoolTeamPick,
});

