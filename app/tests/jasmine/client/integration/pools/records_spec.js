/* globals
 waitForSubscription,
 waitForElement,
 */

const page = {
  getMostWinsAllTimeCellSelector: () =>
    `table#pool_users_most_wins_all_time tbody tr td.metric`,
  getMostLossesAllTimeCellSelector: () =>
    `table#pool_users_most_losses_all_time tbody tr td.metric`,
  getBestPlusMinusAllTimeCellSelector: () =>
    `table#pool_users_best_plus_minus_all_time tbody tr td.metric`,
  getWorstPlusMinusAllTimeCellSelector: () =>
    `table#pool_users_worst_plus_minus_all_time tbody tr td.metric`,

  getMostWinsSeasonCellSelector: () =>
    `table#pool_teams_most_wins_season tbody tr td.metric`,
  getMostLossesSeasonCellSelector: () =>
    `table#pool_teams_most_losses_season tbody tr td.metric`,
  getBestPlusMinusSeasonCellSelector: () =>
    `table#pool_teams_best_plus_minus_season tbody tr td.metric`,
  getWorstPlusMinusSeasonCellSelector: () =>
    `table#pool_teams_worst_plus_minus_season tbody tr td.metric`,

  getBestPickQualitySeasonCellSelector: () =>
    `table#pool_team_picks_best_pick_quality_season tbody tr td.metric`,
  getWorstPickQualitySeasonCellSelector: () =>
    `table#pool_team_picks_worst_pick_quality_season tbody tr td.metric`,
};

describe('poolsRecord page', () => {
  beforeEach(loginWithDefaultUser); // needed so we have a subscription to the Pools collection
  beforeEach(createDefaultSeasonLeagueTeam);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam); // TODO: add other pool teams in this season and in other seasons to validate record numbers
  beforeEach(createDefaultPoolTeamPick);
  beforeEach(goToPoolsRecordsPage);

  it('should display the teams with the most wins of all time', done => {
    waitForElement(page.getMostWinsAllTimeCellSelector(), function () {
      const wins = $(page.getMostWinsAllTimeCellSelector()).text();
      expect(wins).toBe('10');
      done();
    });
  });

  it('should display the teams with the most losses of all time', done => {
    waitForElement(page.getMostLossesAllTimeCellSelector(), function () {
      const losses = $(page.getMostLossesAllTimeCellSelector()).text();
      expect(losses).toBe('6');
      done();
    });
  });

  it('should display the teams with the best point differential of all time', done => {
    waitForElement(page.getBestPlusMinusAllTimeCellSelector(), function () {
      const plusMinus = $(page.getBestPlusMinusAllTimeCellSelector()).text();
      expect(plusMinus).toBe('3');
      done();
    });
  });

  it('should display the teams with the worst point differential of all time', done => {
    waitForElement(page.getWorstPlusMinusAllTimeCellSelector(), function () {
      const plusMinus = $(page.getWorstPlusMinusAllTimeCellSelector()).text();
      expect(plusMinus).toBe('3');
      done();
    });
  });

  it('should display the teams with the most wins in a single season', done => {
    waitForElement(page.getMostWinsSeasonCellSelector(), function () {
      const wins = $(page.getMostWinsSeasonCellSelector()).text();
      expect(wins).toBe('10');
      done();
    });
  });

  it('should display the teams with the most losses in a single season', done => {
    waitForElement(page.getMostLossesSeasonCellSelector(), function () {
      const losses = $(page.getMostLossesSeasonCellSelector()).text();
      expect(losses).toBe('6');
      done();
    });
  });

  it('should display the teams with the best point differential in a single season', done => {
    waitForElement(page.getBestPlusMinusSeasonCellSelector(), function () {
      const plusMinus = $(page.getBestPlusMinusSeasonCellSelector()).text();
      expect(plusMinus).toBe('3');
      done();
    });
  });

  it('should display the teams with the worst point differential in a single season', done => {
    waitForElement(page.getWorstPlusMinusSeasonCellSelector(), function () {
      const plusMinus = $(page.getWorstPlusMinusSeasonCellSelector()).text();
      expect(plusMinus).toBe('3');
      done();
    });
  });

  it('should display the teams with the best pick quality in a single season', done => {
    waitForElement(page.getBestPickQualitySeasonCellSelector(), function () {
      const pickQuality = $(page.getBestPickQualitySeasonCellSelector()).text();
      expect(pickQuality).toBe('-3.8');
      done();
    });
  });

  it('should display the teams with the worst pick quality in a single season', done => {
    waitForElement(page.getWorstPickQualitySeasonCellSelector(), function () {
      const pickQuality = $(page.getWorstPickQualitySeasonCellSelector()).text();
      expect(pickQuality).toBe('-3.8');
      done();
    });
  });
});
