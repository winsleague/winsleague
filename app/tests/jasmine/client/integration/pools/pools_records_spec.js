const page = {
  getMostWinsAllTimeCellSelector: () => `table#pool_users_most_wins_all_time tbody tr td.metric`,
  getMostLossesAllTimeCellSelector: () => `table#pool_users_most_losses_all_time tbody tr td.metric`,
  getBestPlusMinusAllTimeCellSelector: () => `table#pool_users_best_plus_minus_all_time tbody tr td.metric`,
  getWorstPlusMinusAllTimeCellSelector: () => `table#pool_users_worst_plus_minus_all_time tbody tr td.metric`,
};

fdescribe('poolsRecord page', () => {
  beforeEach(loginWithDefaultUser); // needed so we have a subscription to the Pools collection
  beforeEach(createDefaultSeasonLeagueTeam);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam); // TODO: add other pool teams in this season and in others to validate record numbers
  beforeEach(goToPoolsRecordsPage);

  it('should display the teams with the most wins of all time', done => {
    waitForElement(page.getMostWinsAllTimeCellSelector(), function() {
      const wins = $(page.getMostWinsAllTimeCellSelector()).text();
      expect(wins).toBe('10');
    });
  });

  it('should display the teams with the most losses of all time', done => {
    waitForElement(page.getMostLossesAllTimeCellSelector(), function() {
      const losses = $(page.getMostLossesAllTimeCellSelector()).text();
      expect(losses).toBe('6');
    });
  });

  it('should display the teams with the best point differential of all time', done => {
    waitForElement(page.getBestPlusMinusAllTimeCellSelector(), function() {
      const plusMinus = $(page.getBestPlusMinusAllTimeCellSelector()).text();
      expect(plusMinus).toBe('3');
    });
  });

  it('should display the teams with the worst point differential of all time', done => {
    waitForElement(page.getWorstPlusMinusAllTimeCellSelector(), function() {
      const plusMinus = $(page.getWorstPlusMinusAllTimeCellSelector()).text();
      expect(plusMinus).toBe('3');
    });
  });
});
