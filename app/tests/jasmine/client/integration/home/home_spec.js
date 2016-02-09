const page = {
  getTitleSelector() {
    return 'h2:contains("Simple Fantasy Sports")';
  },
};

describe('The homepage', () => {
  beforeEach(goToHomePage);

  it('should have a title', done => {
    waitForElement(page.getTitleSelector(), done);
  });
});
