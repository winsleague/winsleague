function createOldSeason() {
  const leagueId = Leagues.findOne({ name: 'NFL' })._id;
  const seasonId = Seasons.insert({
    leagueId,
    year: 2014,
    startDate: moment('2014-09-10').toDate(),
    endDate: moment('2015-01-03').toDate(),
  });
  log.debug(`created seasonId: ${seasonId}`);
}

Meteor.methods({
  'fixtures/seasons/createOld': createOldSeason,
});
