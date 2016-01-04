describe("Bootstrap", function () {
  it ("should initialize the leagues", function () {
    expect(Leagues.find().count()).toEqual(1);
  });
});
