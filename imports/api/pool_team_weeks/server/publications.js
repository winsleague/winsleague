import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { PoolTeamWeeks } from '../pool_team_weeks';

Meteor.publish('poolTeamWeeks.ofPool', function poolTeamWeeksOfPool(poolId, seasonId = null) {
  check(poolId, String);
  check(seasonId, Match.Maybe(String));
  if (!poolId) {
    return this.ready();
  }

  if (seasonId) {
    check(seasonId, String);
    return PoolTeamWeeks.find({ poolId, seasonId });
  }
  return PoolTeamWeeks.find({ poolId });
});
