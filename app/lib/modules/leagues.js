Modules.leagues = {
  getByName(name) {
    return Leagues.findOne({ name });
  },

  getIdByName(name) {
    return Modules.leagues.getByName(name)._id;
  },
};
