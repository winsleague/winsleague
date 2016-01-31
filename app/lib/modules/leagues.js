Modules.leagues = {
  getByName(name) {
    return Leagues.findOne({ name });
  },
};
