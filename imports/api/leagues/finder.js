import { Leagues } from './leagues';

export default {
  getByName(name) {
    return Leagues.findOne({ name });
  },

  getIdByName(name) {
    const league = Leagues.findOne({ name });
    if (!league) throw new Error('League not found!', name);
    return league._id;
  },
};
