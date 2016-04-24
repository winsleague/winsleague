import { Leagues } from './leagues';

export default {
  getByName() {
    return Leagues.findOne({ name });
  },

  getIdByName(name) {
    return Leagues.findOne({ name })._id;
  },
};
