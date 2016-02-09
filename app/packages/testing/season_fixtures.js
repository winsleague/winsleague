function createOldSeason() {
  const leagueId = Leagues.findOne({ name: 'NFL' })._id;
  const seasonId = Seasons.insert({ leagueId, year: 2014 });
  log.debug(`created seasonId: ${seasonId}`);
}

Meteor.methods({
  'fixtures/seasons/createOld': createOldSeason,
});
