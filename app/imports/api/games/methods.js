import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import mlbGameData from './server/mlb_game_data';
import SeasonFinder from '../seasons/finder';

export const ingestMlbSeasonData = new ValidatedMethod({
  name: 'mlbGameData.ingestSeasonData',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLoggedIn',
  },
  validate: new SimpleSchema({ }).validator(),
  run() {
    const season = SeasonFinder.getLatestByLeagueName('MLB');
    mlbGameData.ingestSeasonData(season);
  },
});
