const page = {
  getTitleSelector: () => 'h2:contains("Simple Fantasy Sports")',
};

describe('homepage', () => {
  beforeEach(goToHomePage);

  it('should have a title', done => {
    waitForElement(page.getTitleSelector(), done);
  });
});
