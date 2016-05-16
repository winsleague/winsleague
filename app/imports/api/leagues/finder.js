import { Leagues } from './leagues';

export default {
  getByName(name) {
    return Leagues.findOne({ name });
  },

  getIdByName(name) {
    return Leagues.findOne({ name })._id;
  },
};
