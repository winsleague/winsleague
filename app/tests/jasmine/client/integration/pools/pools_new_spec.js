const page = {
  getNameField() {
    return $('input[name="name"]');
  },
};

describe('pools new page', () => {
  beforeEach(loginWithDefaultUser);
  beforeEach(goToPoolsNewPage);

  it('should display the name field', () => {
    log.info(`result: ${page.getNameField()}`);
    expect(page.getNameField().is(':visible')).toBe(true);
  });
});
