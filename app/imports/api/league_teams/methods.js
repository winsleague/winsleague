import { Meteor } from 'meteor/meteor';
import { log } from '../../startup/log';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { LeagueTeams } from './league_teams';

const NAME_ONLY = new SimpleSchema({
  league: {
    type: Object,
  },
  cityName: {
    type: String,
  },
  mascotName: {
    type: String,
  }
}).validator();

export const getByName = new ValidatedMethod({
  name: 'leagueTeams.getByName',
  validate: NAME_ONLY,
  run({ league, cityName, mascotName }) {
    return LeagueTeams.findOne({ leagueId: league._id, cityName, mascotName });
  },
});
