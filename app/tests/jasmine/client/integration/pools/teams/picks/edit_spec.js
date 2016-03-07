/* globals
 waitForSubscription,
 waitForElement,
 waitForMissingElement,
 */

const page = {
  getLeagueTeamSelector: () => 'select[name="leagueTeamId"]',
  getPickNumberSelector: () => 'select[name="pickNumber"]',
  getDeleteButtonSelector: () => 'a[href="#afModal"]',
  getDeleteButtonInModalSelector: () => 'button.btn-danger', // fragile way of doing this but good enough for now
  getPoolTeamsShowSelector: () => 'h3.poolTeamsShow',
  getPoolsShowSelector: () => 'h3.poolsShow',
};

describe('poolTeamPicksEdit page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(createDefaultPool);
  beforeEach(createDefaultPoolTeam);
  beforeEach(createDefaultPoolTeamPick);
  beforeEach(goToPoolsShowPage); // needed so we get subscription to PoolTeams
  beforeEach(goToPoolTeamsShowPage);
  beforeEach(goToPoolTeamPicksEditPage);

  let spec;
  spec = it('should edit a pool team pick', done => {
    log.info(`spec: `, spec.description);

    waitForSubscription(PoolTeamPicks.find(), function () {
      // change to second team
      $(page.getLeagueTeamSelector()).find('option:eq(2)').prop('selected', true);
      const leagueTeamId = LeagueTeams.findOne({}, { sort: ['cityName', 'asc'], skip: 1 })._id;
      log.info(`expecting leagueTeamId: ${leagueTeamId}`);

      // change to pick number #2
      $(page.getPickNumberSelector()).find('option:eq(2)').prop('selected', true);

      $('form').submit();

      // make sure we redirect to poolShow page
      waitForElement(page.getPoolTeamsShowSelector(), function () {
        waitForSubscription(PoolTeamPicks.find(), function () {
          const poolTeamPick = PoolTeamPicks.findOne();
          expect(poolTeamPick).not.toBe(undefined, 'poolTeamPick');
          log.debug(`poolTeamPick: `, poolTeamPick);
          expect(poolTeamPick.leagueTeamId).toBe(leagueTeamId, 'leagueTeamId');
          expect(poolTeamPick.pickNumber).toBe(2, 'pickNumber');

          done();
        });
      });
    });
  });

  spec = it('should delete a pool team pick', done => {
    log.info(`spec: `, spec.description);

    waitForSubscription(PoolTeamPicks.find(), function () {
      $(page.getDeleteButtonSelector()).click();

      waitForElement(page.getDeleteButtonInModalSelector(), function () {
        Meteor.setTimeout(function () {
          // this is needed because clicking too early on the button does nothing
          // it's as if the click() handler isn't setup until the modal animates,
          // but I don't know how to detect when the click handler is ready
          $(page.getDeleteButtonInModalSelector()).click();
        }, 1000);

        waitForMissingElement(page.getDeleteButtonInModalSelector(), function () {
          // make sure we redirect to poolShow page
          waitForElement(page.getPoolTeamsShowSelector(), function () {
            // make sure pool team pick is deleted
            waitForEmptySubscription(PoolTeamPicks.find(), function () {
              done();
            });
          });
        });
      });
    });
  });
});
