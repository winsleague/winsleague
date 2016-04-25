import { Meteor } from 'meteor/meteor';
import log from '../../startup/log';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { LeagueTeams } from './league_teams';

export const getByName = new ValidatedMethod({
  name: 'leagueTeams.getByName',
  validate: new SimpleSchema({
    league: {
      type: Object,
    },
    cityName: {
      type: String,
    },
    mascotName: {
      type: String,
    },
  }).validator(),
  run({ league, cityName, mascotName }) {
    return LeagueTeams.findOne({ leagueId: league._id, cityName, mascotName });
  },
});
